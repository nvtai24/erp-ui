// import React, { useEffect, useState } from "react";
// import { Contract } from "../../types/contract";
// import { getContracts, deleteContract } from "../../services/contractService";
// // import ContractForm from "../../components/contract/ContractForm";
// import ContractList from "../../components/contract/ContractList";

// const ContractsPage: React.FC = () => {
//   const [contracts, setContracts] = useState<Contract[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

//   const loadContracts = async () => {
//     const res = await getContracts();
//     setContracts(res.data || []);
//   };

//   useEffect(() => {
//     loadContracts();
//   }, []);

//   const handleEdit = (contract: Contract) => {
//     setSelectedContract(contract);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: number) => {
//     if (window.confirm("Are you sure you want to delete this contract?")) {
//       await deleteContract(id);
//       loadContracts();
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Contract Management</h3>
//       {!showForm ? (
//         <>
//           <button className="btn btn-primary mb-3" onClick={() => setShowForm(true)}>
//             Add New Contract
//           </button>
//           <ContractList
//             contracts={contracts}
//             onEdit={handleEdit}
//             onDelete={handleDelete}
//           />
//         </>
//       ) : (
//         <ContractForm
//           initialData={selectedContract || undefined}
//           onSuccess={() => {
//             setShowForm(false);
//             setSelectedContract(null);
//             loadContracts();
//           }}
//           onCancel={() => {
//             setShowForm(false);
//             setSelectedContract(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default ContractsPage;
