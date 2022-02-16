export interface AdministrationUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: string;
    isActive: boolean;
    userType: string;
}

export interface UserRole {
    id: string;
    name: string;
    access: Array<{ [name: string]: Array<string> }>;
}

export interface AdministrationState {
    userLoading: boolean;
    activeUserId: string;
    users: Array<AdministrationUser>;
    userSearch: string;
    activeUser: (AdministrationUser) | undefined;
    roles: Array<UserRole>;
    userAction: string;
}

export const SET_ADMINISTRATION_STATE = 'set_administration_state';

export interface AdministrationStateInput {
    [name: string]: string | boolean | AdministrationUser | Partial<AdministrationUser> | Array<AdministrationUser> | undefined;
   
}
export interface SetAdministrationStateAction {
    type: typeof SET_ADMINISTRATION_STATE;
    payload: AdministrationStateInput;
}

export type AdministrationAction = SetAdministrationStateAction;