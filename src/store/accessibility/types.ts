export type AccessibilityTabs = 'AMI' | 'APP';

export interface UserRole {
    name: string;
    id: string;
    amiAccess: Array<string>;
    appAccess: Array<string>;
    description: string;
    dateCreated: string;
    dateUpdated: string;
    countryCode?: string;
    organizationId?: string;
}

export interface Module {
    name: string;
    action: Array<string>;
}

export interface AccessibilityState {
    activeTab: AccessibilityTabs;
    amiModules: Array<string>;
    appModules: Array<string>;
    platform: Array<string>;
    userRoles: Array<UserRole>;
    activePlatform: string;
    activeUserRole: string;
    modules: Array<string>;
    activeEditUserRole?: UserRole;
    activeModuleCheckbox: Array<string>;
    roleLoading: boolean;
    roles: Array<UserRole>;
    rolesLoading: boolean;
}

export interface AutocompleteKeyPair { 
    label: string; 
    value: string 
};

export const SET_ACCESSIBILITY_STATE = 'set_accessibility_state';

export interface AccessibilityInput {
    [name: string] : string | boolean | number | undefined | AutocompleteKeyPair | UserRole | Array<string> | {} | object
}

export interface SetAccessibilityStateAction {
    type: typeof SET_ACCESSIBILITY_STATE;
    payload: AccessibilityInput;
}


export type AccessibilityAction = SetAccessibilityStateAction;