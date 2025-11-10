// import React, { useEffect, useState } from "react";
// import { ContractSave } from "../../types/contract";
// import { createContract, updateContract } from "../../services/contractService";
// import { getEmployees } from "../../services/employeeService"; // optional service for dropdown

// interface ContractFormProps {
//   onSuccess: () => void;
//   onCancel: () => void;
//   initialData?: ContractSave;
// }

// const ContractForm: React.FC<ContractFormProps> = ({ onSuccess, onCancel, initialData }) => {
//   const [formData, setFormData] = useState<ContractSave>(
//     initialData || {
//       employeeId: 0,
//       contractType: "",
//       position: "",
//       baseSalary: 0,
//       startDate: "",
//       endDate: "",
//     }
//   );

//   const [employees, setEmployees] = useState<{ employeeId: number; name: string }[]>([]);

//   useEffect(() => {
//     loadEmployees();
//   }, []);

//   const loadEmployees = async () => {
//     const res = await getEmployees();
//     setEmployees(res.data || []);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formData.contractId) await updateContract(formData);
//     else await createContract(formData);
//     onSuccess();
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-3">
//       <div className="mb-3">
//         <label className="form-label">Employee</label>
//         <select
//           name="employeeId"
//           className="form-select"
//           value={formData.employeeId}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select employee</option>
//           {employees.map((emp) => (
//             <option key={emp.employeeId} value={emp.employeeId}>
//               {emp.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Contract Type</label>
//         <input
//           type="text"
//           className="form-control"
//           name="contractType"
//           value={formData.contractType}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Position</label>
//         <input
//           type="text"
//           className="form-control"
//           name="position"
//           value={formData.position}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Base Salary</label>
//         <input
//           type="number"
//           className="form-control"
//           name="baseSalary"
//           value={formData.baseSalary}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Start Date</label>
//         <input
//           type="date"
//           className="form-control"
//           name="startDate"
//           value={formData.startDate}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">End Date</label>
//         <input
//           type="date"
//           className="form-control"
//           name="endDate"
//           value={formData.endDate}
//           onChange={handleChange}
//         />
//       </div>

//       <div className="d-flex justify-content-end">
//         <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
//           Cancel
//         </button>
//         <button type="submit" className="btn btn-primary">
//           {formData.contractId ? "Update" : "Create"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ContractForm;
