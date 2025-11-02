export interface ViewPurchaseOrderDto {
  staffId: number | null;
  orderId: number;
  orderDate: string;
  supplierId: number;
  supplierName: string;
  contact: string;
  staffName: string | null;
  purchaseOrderDetails: PurchaseOrderDetail[];
}

export interface Supplier {
  supplierId: number;
  supplierName: string;
  contact: string;
  address: string;
}

export interface PurchaseOrderDetail {
  detailId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrderDetailDto {
  productId: number;
  productName: string;
  categoryId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchaseOrderDto {
  supplierId: number;
  supplierName: string;
  contact: string;
  purchaseOrderDetails: PurchaseOrderDetailDto[];
}

export interface PurchaseOrderItem extends PurchaseOrderDetail {
  id: number; // local id for UI management
}

export interface NewProduct {
  id: number;
  name: string;
  categoryId: number;
  unitPrice: number;
  quantity: number;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}
