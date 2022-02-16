export type AccessibilityTabs = 'AMI' | 'APP';

export interface AccessibilityModules {
    id: string;
    name: string;
    isView: boolean;
    isEdit: boolean;
    isAdd: boolean;
    isDelete: boolean;
}
export interface AccessibilitySetting {
    id: string;
    roleName: string;
    dateCreated: string;
    lastUpdated: string;
    appType: string;
    activeTab: AccessibilityTabs;
    modules: Array<AccessibilityModules>;
}

export interface AccessibilitySettingsState { 
   // accessibilityModules: Array<AccessibilityModules>;
    activeAccessilibility: AccessibilitySetting;
    activeTab: string;
    appType: string;
}

export const SET_ACCESSIBILITY_SETTINGS_STATE = 'set_accessibility_settings_state';
export const UPDATE_ACTIVE_ACCESSIBILITY_SETTINGS = 'update_active_accessibility_settings';


export interface AccessibilitySettingsInput {
    [name: string]: string |  Array<AccessibilityModules> | boolean  | AccessibilitySetting | AccessibilityTabs ; 
}

export type ActiveAccessibilityInputData = string | [number, number] | boolean;

export interface ActiveAccessibilitySettingsInput {
    field: string;
    text: ActiveAccessibilityInputData;
}
export interface SetAccessibilitySettingsState {
    type: typeof SET_ACCESSIBILITY_SETTINGS_STATE;
    payload: AccessibilitySettingsInput;
}
export interface UpdateAccessibilitySettingsState {
    type: typeof UPDATE_ACTIVE_ACCESSIBILITY_SETTINGS;
    payload: ActiveAccessibilitySettingsInput;
}

export type AccessibilitySettingsAction = SetAccessibilitySettingsState | UpdateAccessibilitySettingsState;
