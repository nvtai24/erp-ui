export interface ViewPurchaseOrderDto {
  purchaseOrderId: number;
  supplierName: string;
  contact: string;
  orderDate: string;
  purchaseOrderDetails: PurchaseOrderDetail[];
}

export interface PurchaseOrderDetail {
  productId: number;
  productName?: string;
  categoryId?: number;
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