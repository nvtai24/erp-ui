import { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";

interface CustomerFormData {
  name: string;
  phone: string;
  address: string;
}

interface CustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

export default function CustomerForm({
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Customer Name</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter customer name"
        />
      </div>

      <div>
        <Label>Phone Number</Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      <div>
        <Label>Address</Label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Enter address"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white rounded bg-brand-500 hover:bg-brand-600"
        >
          Add Customer
        </button>
      </div>
    </form>
  );
}
