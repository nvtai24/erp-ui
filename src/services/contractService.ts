import axios from "axios";
import { Contract, ContractSave, ContractSearch } from "../types/contract";

const API_URL = "https://localhost:7080/api/contracts";

export const getContracts = async (params?: ContractSearch) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const getContractById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createContract = async (data: ContractSave) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateContract = async (data: ContractSave) => {
  const res = await axios.put(API_URL, data);
  return res.data;
};

export const deleteContract = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
