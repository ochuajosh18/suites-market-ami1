import { GenericMedia, SortOrder } from '../system/types';

export interface UserManagementFilter {
    orderBy: string;
    order: string;
}

export interface Vendor {
    id: string;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    role: string;
    mobileNumber: string;
    avatar?: GenericMedia;
    countryCode: string;
    areaCode: string;
    landlineNumber: string;
    status: string;
    remarks: string;
    addressLine: string;
    postalCode: number;
    city: string;
    province: string;
    country: string;
    updatedBy: string;
    countryNumber?: string;
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    countryCode: string;
    mobileNumber: string;
    areaCode: string;
    landlineNumber: string;
    avatar?: GenericMedia;
    countryNumber?: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface Address {
    addressLine: string;
    city: string;
    country: string;
    customerId: string;
    dateCreated: string;
    dateUpdated: string;
    docType: string;
    id: string;
    isDeleted: boolean;
    postalCode: number;
    province: string;
    tag: string;
}

export interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: 'Active' | 'Inactive';
    id: string;
}

export interface Role {
    amiAccess: Array<string>;
    amiAccess_old: Array<string>;
    appAccess: Array<string>;
    appAccess_old: Array<string>;
    docType: string;
    forMarketplace: boolean;
    id: string;
    isDeleted: boolean;
    name: string;
    type: string;
    isDefault: boolean;
}

export interface UserAccountsType {
    email: string;
    firstName: string;
    id: string;
    isActive: boolean;
    lastName: string;
    roleId: string;
    userType: string;
}

export interface UserManagementState {
    userListLoading: boolean;
    userDetailLoading: boolean;
    vendorTab: string;
    vendors: Array<Vendor>;
    vendorDetails?: Vendor;
    customers: Array<Customer>;
    customerDetails?: Customer;
    customerHomeAddress?: Address;
    customerOfficeAddress?: Address;
    modalVisible: boolean;
    vendorStatusUpdate: string;
    vendorRemarksUpdate: string;
    statusLoading: boolean;
    activeUser?: User;
    userAccounts: Array<UserAccountsType>;
    userRoles: Array<Role>;
    userAccountTab: 'Active' | 'Inactive';
    userAccountNewUserDialogIsOpen: boolean;
    userAccountDialogeConfirmLabel: 'Add' | 'Save';
    userAccountSaveLoading: boolean;
    roles: Array<Role>;
    selectedRoleId: string;
    selectedRoleName: string
    selectedRoleDescription: string;
    deleteModalVisible: boolean;
    activeSort: string;
    activeSortOrder: SortOrder;
    activeFilters: Partial<UserManagementFilter>;
    search: string;
};

export const SET_USERMANAGEMENT_STATE = 'set_usermanagement_state';
export const LOAD_VENDOR_LIST = 'load_vendor_list';
export const LOAD_VENDOR_DETAILS = 'load_vendor_details'
export const LOAD_CUSTOMER_LIST = 'load_customer_list';
export const LOAD_CUSTOMER_DETAILS = 'load_customer_details'
export const LOAD_ROLE_LIST = 'load_role_list';

export interface UserManagementStateInput {
    [name: string]: string | Array<string> | Vendor | Array<Vendor> | Array<Role> | boolean | User | undefined | Partial<UserManagementFilter>;
}

export interface SetUserManagementStateAction {
    type: typeof SET_USERMANAGEMENT_STATE;
    payload: UserManagementStateInput;
}

export interface LoadVendorListAction  {
    type: typeof LOAD_VENDOR_LIST;
    payload: Array<Vendor>;
}

export interface loadVendorAction  {
    type: typeof LOAD_VENDOR_DETAILS;
    payload: Vendor;
}

export interface loadCustomerListAction  {
    type: typeof LOAD_CUSTOMER_LIST;
    payload: Array<Vendor>;
}

export interface loadCustomerAction  {
    type: typeof LOAD_CUSTOMER_DETAILS;
    payload: Customer;
}

export interface LoadRoleListAction  {
    type: typeof LOAD_ROLE_LIST;
    payload: Array<Role>;
}

export type UserManagementAction = SetUserManagementStateAction | LoadVendorListAction | loadVendorAction | loadCustomerListAction | loadCustomerAction | LoadRoleListAction ;