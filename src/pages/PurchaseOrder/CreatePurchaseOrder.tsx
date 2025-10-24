import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "../../components/common/ComponentCard";
import Alert from "../../components/ui/alert/Alert";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import SearchableSelect from "../../components/form/SearchableSelect";
import { Product } from "../../types/product";
import {
  CreatePurchaseOrderDto,
  PurchaseOrderDetail,
  PurchaseOrderItem,
  NewProduct,
  Category,
} from "../../types/purchaseOrder";
import { Supplier } from "../../types/supplier";
import { purchaseOrderService } from "../../services/purchaseOrderService";

export default function CreatePurchaseOrder() {
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

  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplier, setNewSupplier] = useState({ name: "", phone: "" });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<PurchaseOrderItem[]>([
    { id: 1, productId: 0, quantity: 1, unitPrice: 0 },
  ]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProducts, setNewProducts] = useState<NewProduct[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, suppliersData, productsData] = await Promise.all(
          [
            purchaseOrderService.getCategories(),
            purchaseOrderService.getSuppliers(),
            purchaseOrderService.getProducts(),
          ]
        );

        console.log("Categories loaded:", categoriesData);
        console.log("Suppliers loaded:", suppliersData);
        console.log("Products loaded:", productsData);

        setCategories(categoriesData);
        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setAlert({
          show: true,
          variant: "error",
          title: "Error!",
          message: "Failed to load initial data. Please refresh the page.",
        });
        setTimeout(() => {
          setAlert((prev) => ({ ...prev, show: false }));
        }, 2000);
      }
    };

    loadInitialData();
  }, []);

  // Transform supplier data for select
  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.supplierId.toString(),
    label: `${supplier.supplierName} (${supplier.contact})`,
  }));

  // Transform product data for select and filter out selected products
  const getProductOptions = (currentItemId: number) => {
    // Get all selected product IDs except the current item
    const selectedProductIds = items
      .filter((item) => item.id !== currentItemId && item.productId !== 0)
      .map((item) => item.productId);

    // Filter out products that are already selected in other items
    return products
      .filter((product) => !selectedProductIds.includes(product.productId))
      .map((product) => ({
        value: product.productId.toString(),
        label: `
        ${product.productId} - ${product.productName}`,
      }));
  };

  const handleSupplierSelect = (value: string) => {
    setSupplierId(Number(value));
    setIsAddingSupplier(false);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now(), productId: 0, quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleRemoveItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleProductSelect = (value: string, itemId: number) => {
    const product = products.find((p) => p.productId === Number(value));
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

  const handleQuantityChange = (value: string, itemId: number) => {
    const quantity = parseInt(value) || 0;
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handlePriceChange = (value: string, itemId: number) => {
    const unitPrice = parseFloat(value) || 0;
    setItems(
      items.map((item) => (item.id === itemId ? { ...item, unitPrice } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty items first
    const validItems = items.filter((item) => item.productId !== 0);
    setItems(validItems); // Update state to remove empty items

    // Validate supplier info
    if (!supplierId && (!newSupplier.name || !newSupplier.phone)) {
      setAlert({
        show: true,
        variant: "error",
        title: "Invalid Supplier Information",
        message:
          "Please select a supplier or fill in all new supplier information (name and phone)",
      });
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 2000);
      return;
    }

    // Check if both lists are empty (no valid products and no new products)
    if (validItems.length === 0 && newProducts.length === 0) {
      setAlert({
        show: true,
        variant: "error",
        title: "No Products Added",
        message: "Please add at least one product to the order",
      });
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 2000);
      return;
    }

    // Prepare order data
    // Validate new products if any
    if (newProducts.length > 0) {
      const invalidProducts = newProducts.filter(
        (p) => !p.name || !p.categoryId || !p.unitPrice || p.quantity < 1
      );

      if (invalidProducts.length > 0) {
        setAlert({
          show: true,
          variant: "error",
          title: "Invalid Product Information",
          message:
            "Please fill in all required information for all new products (name, category, price, and quantity)",
        });
        setTimeout(() => {
          setAlert((prev) => ({ ...prev, show: false }));
        }, 2000);
        return;
      }
    }

    // Combine existing products and new products into purchaseOrderDetails
    // Use the already filtered validItems from above
    const existingProductDetails = validItems.map(
      ({ productId, quantity, unitPrice }) => ({
        productId,
        productName: "",
        categoryId: 0,
        quantity,
        unitPrice,
      })
    );

    const newProductDetails = newProducts.map((p) => ({
      productId: 0, // Always set productId to 0 for new products
      productName: p.name,
      categoryId: p.categoryId,
      quantity: p.quantity,
      unitPrice: p.unitPrice,
    }));

    const orderData: CreatePurchaseOrderDto = {
      supplierId: supplierId || 0,
      supplierName: newSupplier.name,
      contact: newSupplier.phone,
      purchaseOrderDetails: [...existingProductDetails, ...newProductDetails],
    };

    setLoading(true);
    try {
      console.log("Creating purchase order with data:", orderData);
      await purchaseOrderService.createPurchaseOrder(orderData);
      setAlert({
        show: true,
        variant: "success",
        title: "Success!",
        message: "Purchase order has been created successfully.",
      });
      // Hide alert after 2 seconds
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 2000);
      // Navigate after alert is hidden
      setTimeout(() => {
        navigate("/purchases");
      }, 2300);
    } catch (error) {
      console.error("Failed to create purchase order:", error);
      setAlert({
        show: true,
        variant: "error",
        title: "Error!",
        message: "Failed to create purchase order. Please try again.",
      });
      setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const total =
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) +
    newProducts.reduce(
      (sum, product) => sum + product.quantity * product.unitPrice,
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
      <ComponentCard title="Create Purchase Order">
        <form onSubmit={handleSubmit} className="space-y-6">
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <div>
            <Label>Supplier</Label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SearchableSelect
                    options={supplierOptions}
                    placeholder="Search existing supplier..."
                    onChange={handleSupplierSelect}
                    value={supplierId?.toString() || ""}
                    className="dark:bg-dark-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSupplier(true);
                    setSupplierId(null);
                  }}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Add Supplier
                </button>
              </div>

              {isAddingSupplier && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="Supplier name"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Phone number"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier((prev) => ({
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
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (items.length === 1 && items[0].productId === 0) {
                      setItems([]); // Clear existing items if there's only one empty item
                    }
                    setIsAddingProduct(true);
                    setNewProducts([
                      {
                        id: -1,
                        name: "",
                        categoryId: 0,
                        unitPrice: 0,
                        quantity: 1,
                      },
                    ]);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
                >
                  New Product
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1 text-sm text-brand-500 border border-brand-500 rounded hover:bg-brand-50"
                >
                  Add Item
                </button>
              </div>
            </div>

            {isAddingProduct && (
              <div className="p-4 border rounded space-y-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg">New Products</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProducts([
                        ...newProducts,
                        {
                          id: -Date.now(), // Use negative timestamp to ensure unique IDs
                          name: "",
                          categoryId: 0,
                          unitPrice: 0,
                          quantity: 1,
                        },
                      ]);
                    }}
                    className="px-3 py-1 text-sm border border-brand-500 text-brand-500 rounded hover:bg-brand-50"
                  >
                    Add Product
                  </button>
                </div>

                {/* Header for new products form */}
                <div className="grid grid-cols-5 gap-2 text-sm text-gray-500 font-medium px-1">
                  <div>Product Name</div>
                  <div>Category</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Quantity</div>
                  <div></div>
                </div>

                {newProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-5 gap-2 items-start"
                  >
                    <Input
                      type="text"
                      placeholder="Enter product name..."
                      value={product.name}
                      onChange={(e) =>
                        setNewProducts(
                          newProducts.map((p) =>
                            p.id === product.id
                              ? { ...p, name: e.target.value }
                              : p
                          )
                        )
                      }
                    />
                    <SearchableSelect
                      options={
                        categories?.length
                          ? categories.map((cat) => ({
                              value: cat.categoryId.toString(),
                              label: cat.categoryName,
                            }))
                          : []
                      }
                      placeholder="Select category..."
                      value={
                        product.categoryId ? product.categoryId.toString() : ""
                      }
                      onChange={(value) =>
                        setNewProducts(
                          newProducts.map((p) =>
                            p.id === product.id
                              ? { ...p, categoryId: Number(value) }
                              : p
                          )
                        )
                      }
                      className="dark:bg-dark-900"
                    />
                    <Input
                      type="number"
                      placeholder="Enter unit price..."
                      value={product.unitPrice}
                      onChange={(e) =>
                        setNewProducts(
                          newProducts.map((p) =>
                            p.id === product.id
                              ? { ...p, unitPrice: Number(e.target.value) }
                              : p
                          )
                        )
                      }
                      className="text-right"
                    />
                    <Input
                      type="number"
                      placeholder="Enter quantity..."
                      value={product.quantity}
                      min="1"
                      onChange={(e) =>
                        setNewProducts(
                          newProducts.map((p) =>
                            p.id === product.id
                              ? { ...p, quantity: Number(e.target.value) }
                              : p
                          )
                        )
                      }
                      className="text-right"
                    />
                    {newProducts.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setNewProducts(
                            newProducts.filter((p) => p.id !== product.id)
                          )
                        }
                        className="inline-flex items-center justify-center w-10 h-10 text-red-500 border border-red-200 rounded hover:bg-red-50"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingProduct(false);
                      setNewProducts([]);
                    }}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="p-4 border rounded space-y-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-lg">Existing Products</h3>
                </div>

                <div className="grid grid-cols-5 gap-2 text-sm text-gray-500 font-medium px-1">
                  <div>Product Name</div>
                  <div>Product Name</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Quantity</div>
                  <div></div>
                </div>

                {items.map((item) => (
                  <div
                    key={`item-${item.id}`}
                    className="grid grid-cols-5 gap-2 items-start"
                  >
                    <div className="col-span-2">
                      <SearchableSelect
                        key={`select-${item.id}`}
                        options={getProductOptions(item.id)}
                        placeholder="Search for existing products..."
                        onChange={(value) =>
                          handleProductSelect(value, item.id)
                        }
                        value={item.productId ? item.productId.toString() : ""}
                        className="dark:bg-dark-900"
                      />
                    </div>
                    <Input
                      key={`price-${item.id}`}
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handlePriceChange(e.target.value, item.id)
                      }
                      className="text-right"
                    />
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
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-semibold">
              Total: {total.toLocaleString()}đ
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate("/purchase-orders")}
                className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded bg-brand-500 hover:bg-brand-600"
              >
                Create Purchase Order
              </button>
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
