export type OrderManagementInputType = Array<string> | string | boolean | Partial<OrderManagementFilter> | { } | undefined;
export type SortOrder = 'ASC' | 'DESC' | '';

export interface OrderManagementType<T> {
    [key: string]: T;
}

export interface OrderManagementFilter {
    status: Array<string>;
    paymentMethod: Array<string>;
    minPrice: number;
    maxPrice: number;
    startDate: string;
    endDate: string;
    orderBy: string;
    order: string;
    assigned: boolean;
    keyword: string;
}

export interface OrderItem extends OrderManagementType<OrderManagementInputType> {
    name: string;
    price: number;
    productId: string;
    productSkuId: string;
    image: string;
    qty: number;
    skuNumber: string;
    status: string;
    totalAmount: number;
    discountPrice: number;
}

export interface OrderManagementAddress {
    addressLine: string;
    city: string;
    province: string;
    country: string;
    customerId: string;
    dateCreated: string;
    dateUpdated: string;
    postalCode: number;
    tag: string;
}

export interface OrderUpdatesHistory {
    date: string;
    status: string;
    update: string;
}

export interface Order extends OrderManagementType<OrderManagementInputType> {
    id: string;
    orderNumber: string;
    dateCreated: string;
    dateUpdated: string;
    billingAddress?: OrderManagementAddress;
    shippingAddress?: OrderManagementAddress
    customerEmail: string;
    items: Array<OrderItem>;
    paymentMethod: string;
    status: string;
    totalAmount: number;
    vendorId: string;
    customerName?: string;
    mobileNumber?: string;
    landlineNumber?: string;
    salespersonId?: string;
    history: Array<OrderUpdatesHistory>;
}

export interface OrderManagementState {
    filters: Partial<OrderManagementFilter>;
    filterMinPrice: number;
    filterMaxPrice: number;
    activeFilters: Partial<OrderManagementFilter>;
    activeSort: string;
    activeSortOrder: SortOrder;
    activeOrder?: Order;
    activeOrderLoading: boolean;
    orderHistoryTab: string;
    orders: Array<Order>;
    orderLoading: boolean;
    salesOrderTab: string;
    search: string;
    historyOpen: boolean;
}

export const SET_ORDER_MANAGEMENT_STATE  = 'set_order_management_state';

export interface OrderManagementInput {
    [name: string]: OrderManagementInputType;
}

export interface SetOrderManagementStateAction {
    type: typeof SET_ORDER_MANAGEMENT_STATE;
    payload: OrderManagementInput;
}

export type OrderManagementAction = SetOrderManagementStateAction;