import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";

import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import SearchableSelect from "../../components/form/SearchableSelect";
import type { CreateOrderDto, OrderDetail } from "../../services/orderService";
import axiosClient from "../../utils/axiosClient";
import { Customer } from "../../types/customer";
import { Product } from "../../types/product";

interface OrderItem extends OrderDetail {
  id: string; // local id for UI management
}

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    variant: "info",
    title: "",
    message: "",
  });
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([
    { id: "1", productId: 0, quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    // Load customers
    axiosClient
      .get<Customer[]>("/customers/v2")
      .then((response) => {
        console.log("Customers loaded:", response.data);
        setCustomers(response.data);
        console.log("Customers state:", customers);
      })
      .catch((error) => {
        console.error("Failed to load customers:", error);
      });

    // Load products
    axiosClient
      .get<Product[]>("/products")
      .then((response) => {
        console.log("Products loaded:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
      });
  }, []);

  // Transform customer data for select
  const customerOptions = customers.map((customer) => ({
    value: customer.customerId.toString(),
    label: `${customer.name} (${customer.contact})`,
  }));

  // Transform product data for select and filter out selected products
  const getProductOptions = (currentItemId: string) => {
    // Get all selected product IDs except the current item
    const selectedProductIds = items
      .filter((item) => item.id !== currentItemId && item.productId !== 0)
      .map((item) => item.productId);

    // Filter out products that are already selected in other items
    return products
      .filter((product) => !selectedProductIds.includes(product.productId))
      .map((product) => ({
        value: product.productId.toString(),
        label: `${
          product.productName
        } - ${product.unitPrice.toLocaleString()}đ`,
      }));
  };

  const handleCustomerSelect = (value: string) => {
    setCustomerId(Number(value));
    setIsAddingCustomer(false); // Hide add customer form when selecting existing
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), productId: 0, quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleProductSelect = (value: string, itemId: string) => {
    const product = products.find(
      (p: Product) => p.productId === Number(value)
    );
    if (!product) return;

    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              productId: product.productId,
              unitPrice: product.unitPrice,
            }
          : item
      )
    );
  };

  const handleQuantityChange = (value: string, itemId: string) => {
    const quantity = parseInt(value) || 0;
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", { customerId, newCustomer, items });

    // Validate customer info
    if (!customerId && (!newCustomer.name || !newCustomer.phone)) {
      setAlert({
        show: true,
        variant: "error",
        title: "Invalid Customer Information",
        message:
          "Please select a customer or fill in all new customer information (name and phone)",
      });
      return;
    }

    // Validate items
    if (items.length === 0) {
      setAlert({
        show: true,
        variant: "error",
        title: "No Items Added",
        message: "Please add at least one item to the order",
      });
      return;
    }

    // Validate products selection
    if (items.some((i) => i.productId === 0)) {
      setAlert({
        show: true,
        variant: "error",
        title: "Invalid Products",
        message: "Please select products for all items in the order",
      });
      return;
    }

    // Prepare order data
    const orderData: CreateOrderDto = {
      customerId: customerId || 0,
      name: newCustomer.name,
      contact: newCustomer.phone,
      address: "",
      orderDetails: items.map(({ productId, quantity, unitPrice }) => ({
        productId,
        quantity,
        unitPrice,
      })),
    };

    setLoading(true);
    try {
      console.log("Creating order with data:", orderData);
      await axiosClient.post("/orders", orderData);
      setAlert({
        show: true,
        variant: "success",
        title: "Success!",
        message: "Order has been created successfully.",
      });
      // Hide alert after 3 seconds
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 3000);
      // Navigate after alert is hidden
      setTimeout(() => {
        navigate("/orders");
      }, 3500);
    } catch (error) {
      console.error("Failed to create order:", error);
      setAlert({
        show: true,
        variant: "error",
        title: "Error!",
        message: "Failed to create order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <div className="relative">
      {alert.show && (
        <div className="fixed bottom-4 right-4 max-w-sm z-50">
          <div className="transform transition-all duration-300 ease-in-out">
            <Alert
              variant={alert.variant}
              title={alert.title}
              message={alert.message}
            />
          </div>
        </div>
      )}
      <ComponentCard title="Create Order">
        <form onSubmit={handleSubmit} className="space-y-6">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <div>
            <Label>Customer</Label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SearchableSelect
                    options={customerOptions}
                    placeholder="Search existing customer..."
                    onChange={handleCustomerSelect}
                    value={customerId?.toString() || ""}
                    className="dark:bg-dark-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCustomer(true);
                    setCustomerId(null);
                  }}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Add Customer
                </button>
              </div>

              {isAddingCustomer && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="Customer name"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Phone number"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Order Items</Label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 text-sm text-brand-500 border border-brand-500 rounded hover:bg-brand-50"
              >
                Add Item
              </button>
            </div>

            {items.map((item) => (
              <div key={`item-${item.id}`} className="flex items-center gap-2">
                <div className="flex-1">
                  <SearchableSelect
                    key={`select-${item.id}`}
                    options={getProductOptions(item.id)}
                    placeholder="Search product..."
                    onChange={(value) => handleProductSelect(value, item.id)}
                    value={item.productId ? item.productId.toString() : ""}
                    className="dark:bg-dark-900"
                  />
                </div>
                <div className="w-32">
                  <Input
                    key={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(e.target.value, item.id)
                    }
                    className="text-right"
                  />
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="inline-flex items-center justify-center w-10 h-10 text-red-500 border border-red-200 rounded hover:bg-red-50"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: {total.toLocaleString()}đ
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded bg-brand-500 hover:bg-brand-600"
              >
                Create Order
              </button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
