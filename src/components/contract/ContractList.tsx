import React from "react";
import { Contract } from "../../types/contract";

interface ContractListProps {
  contracts: Contract[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: number) => void;
}

const ContractList: React.FC<ContractListProps> = ({ contracts, onEdit, onDelete }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Employee</th>
          <th>Type</th>
          <th>Position</th>
          <th>Salary</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map((c, index) => (
          <tr key={c.contractId}>
            <td>{index + 1}</td>
            <td>{c.employeeName}</td>
            <td>{c.contractType}</td>
            <td>{c.position}</td>
            <td>{c.baseSalary}</td>
            <td>{c.startDate}</td>
            <td>{c.endDate || "-"}</td>
            <td>
              <span className={`badge ${c.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                {c.status}
              </span>
            </td>
            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => onEdit(c)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(c.contractId)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContractList;
