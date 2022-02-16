export interface ManageCustomer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string
    roleId: string;
    dateCreated?: string;
    mobileNumber: string;
    landlineNumber?: string;
    country: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
}

export interface ManageVendor {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    role: string
    roleId: string;
    remarks: string;
    status: string;
    dateCreated?: string;
    mobileNumber: string;
    landlineNumber?: string;
    country: string;
    province: string;
    city: string;
    addressLine: string;
    postalCode: string;
}

export interface UserRole {
    id: string;
    name: string;
    access: Array<{ [name: string]: Array<string> }>;
}

export interface ManageState {
    entityLoading: boolean;
    activeEntityId: string;
    entities: Array<ManageCustomer & ManageVendor>;
    entitySearch: string;
    activeEntity: (ManageCustomer & ManageVendor) | undefined;
    activeEntityType: string;
    activeEntityLoading: boolean;
    entityRoles: Array<UserRole>
}

export const SET_MANAGE_STATE = 'set_manage_state';

export interface ManageStateInput {
    [name: string]: string | boolean | ManageCustomer | Partial<ManageCustomer> | Array<ManageCustomer>|  ManageVendor | Partial<ManageVendor> | Array<ManageVendor> | undefined;
   
}
export interface SetManageStateAction {
    type: typeof SET_MANAGE_STATE;
    payload: ManageStateInput;
}

export type ManageAction = SetManageStateAction;