export type ApplicationSettingsTabs = 'Application' | 'Permission';
export type ApplicationPermissionTabs = 'IPHONE' | 'IPAD';
export interface PermissionTab {
    id: string;
    label: string;
    value: string;
    row: string | number;
}

export interface ApplicationSettingsState {
    activeTab: ApplicationSettingsTabs;
    activePermissionTab: ApplicationPermissionTabs;
    permissionTabs: Array<PermissionTab>;
    editing: boolean;
}

export const SET_APPLICATION_SETTINGS_STATE = 'set_application_settings_state';

export interface ApplicationSettingsInput {
    [name: string]: string | Array<PermissionTab> | boolean  ;
   
}
export interface ApplicationSettingsInputAction {
    type: typeof SET_APPLICATION_SETTINGS_STATE;
    payload: ApplicationSettingsInput;
}

export type ApplicationSettingsAction = ApplicationSettingsInputAction;