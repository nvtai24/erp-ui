import { useState, useEffect } from "react";
import { Contract } from "../../types/contract";
import employeeService from "../../services/employeeService";

interface Employee {
  employeeId: number;
  fullName: string;
}

type Props = {
  contract?: Contract;
  onSubmit: (data: Omit<Contract, "contractId" | "employeeName">) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
};

export default function ContractForm({ contract, onSubmit, onClose, isSubmitting }: Props) {
  const [formData, setFormData] = useState<Partial<Contract>>({
    contractType: "",
    startDate: "",
    endDate: "",
    baseSalary: 0,
    position: "",
    status: "Active",
    employeeId: 0,
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Lấy danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({
        pageNumber: 1,
        pageSize: 100,
      });
      if (res.success && res.data) {
        setEmployees(
          res.data.map((emp: any) => ({
            employeeId: emp.employeeId,
            fullName: emp.fullName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Load dữ liệu khi edit
  useEffect(() => {
    if (contract) {
      setFormData({
        contractId: contract.contractId,
        contractType: contract.contractType,
        startDate: contract.startDate?.substring(0, 10),
        endDate: contract.endDate?.substring(0, 10),
        baseSalary: contract.baseSalary,
        position: contract.position,
        status: contract.status,
        employeeId: contract.employeeId,
      });
    } else {
      setFormData({
        contractType: "",
        startDate: "",
        endDate: "",
        baseSalary: 0,
        position: "",
        status: "Active",
        employeeId: 0,
      });
    }
  }, [contract]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "baseSalary" || name === "employeeId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as Omit<Contract, "contractId" | "employeeName">);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          {contract ? "Edit Contract" : "Create New Contract"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contract Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Contract Type</label>
            <input
              type="text"
              name="contractType"
              value={formData.contractType || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          {/* Start - End Date */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* Base Salary */}
          <div>
            <label className="block text-sm font-medium mb-1">Base Salary (VND)</label>
            <input
              type="number"
              name="baseSalary"
              value={formData.baseSalary || ""}
              onChange={handleChange}
              min={0}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position || ""}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Employee selection */}
          {contract ? (
            <div>
              <label className="block text-sm font-medium mb-1">Employee</label>
              <input
                type="text"
                value={contract.employeeName}
                readOnly
                className="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Select Employee</label>
              <select
                name="employeeId"
                value={formData.employeeId || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full max-h-40 overflow-y-auto"
                required
              >
                <option value="">-- Select an employee --</option>
                {loadingEmployees ? (
                  <option disabled>Loading...</option>
                ) : (
                  employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.fullName}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : contract ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
