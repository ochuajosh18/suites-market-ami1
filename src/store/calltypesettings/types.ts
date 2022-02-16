export interface Meeting {
    title: string | undefined;
    elements: Array<string> | undefined;
}
export interface CustomerProfiling {
    title: string | undefined;
    elements: Array<string> | undefined;
}

export interface Ipad {
    meeting: Meeting,
    customerProfiling: CustomerProfiling 
}

export interface Iphone {
    meeting: Meeting,
    customerProfiling: CustomerProfiling
}

export interface CallTypeSettingsState { 
        activeScreen: string;
        buttonName: string;
        editing: boolean;
        callType: string;
        callElements: Array<string>;
        activeCallType: string;
        callTypeElementsLoading: boolean;
        ipad?:Ipad;
        iphone?: Iphone;     
}

export const SET_CALL_TYPE_SETTINGS_STATE = 'set_call_type_settings_state';

export interface CallTypeSettingsInput {
    [name: string]: string  | boolean | Array<string> | undefined | Ipad | Iphone | Meeting | CustomerProfiling;
}
export interface SetCallTypeSettingsState {
    type: typeof SET_CALL_TYPE_SETTINGS_STATE;
    payload: CallTypeSettingsInput;
}

export type CallTypeSettingsAction = SetCallTypeSettingsState;

