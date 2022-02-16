export type FieldDialogType = 'ADD' | 'UPDATE';

export interface AutocompletePair {
    value: string | boolean;
    label: string;
}

export interface RenderTree {
    id: string;
    name: string;
    children?: Array<RenderTree>
}

export interface Field {
    id: string;
    name: string;
    title: string;
    type: string;
    section: string | number;
    row?: string | number;
    isRequired: boolean;
    isActive: boolean;
    isDefault: boolean;
    activeUpdated?: boolean;
    values?: Array<string>;
    defaultValue?: string;
    isMultiple?: boolean;
    minName?: string;
    minTitle?: string;
    maxName?: string;
    maxTitle?: string;
    accepts?: Array<string>;
    disabled?: boolean;
    minDisabled?: boolean;
    maxDisabled?: boolean;
    validRange?: string;
}

export interface FieldSection {
    name: string;
    fields: Array<Field>;
}

export interface FieldsState {
    fields: Array<Field>;
    fieldsAdded: Array<Field>;
    curFieldId: string;
    curFieldName: string;
    curFieldType: string;
    curFieldSection: string;
    curFieldRow: string;
    curFieldRequired: boolean;
    curFieldOptions: Array<string>;
    curFieldDefaultOption: string;
    modalVisible: boolean;
    fieldsEditing: boolean;
    fieldsLoading: boolean;
    screen: FieldScreen;
    fieldDialogType: FieldDialogType;
    activeCustomerTab: FieldCustomerTabs;
    activeModule: string;
    sections: Array<FieldSection>;
    elements: Array<Field>;
    activeField?: Field;
    activeFieldName: string;
    activeFieldSection: string;
    openSections: Array<string>;
}

export type FieldScreen = 'VIEW' | 'ADD';

export type FieldCustomerTabs = 'CUSTOMERFIELDS' | 'CONTACTFIELDS';

export const SET_FIELDS_STATE  = 'set_fields_state';

export interface FieldStateInput {
    [name: string]: Array<Field> | string | FieldScreen | boolean | number | Field  | FieldCustomerTabs | undefined | Array<string> | Array<FieldSection> | FieldDialogType; 
}

export interface SetFieldsStateAction {
    type: typeof SET_FIELDS_STATE;
    payload: FieldStateInput
}

export type FieldEditInputType = string | boolean;
export type FieldsInput = 'fields' | 'modalVisible' | 'fieldsEditing' | 'screen' | 'activeCustomerTab' ;
export type FieldEditInput = 'curFieldName' | 'curFieldType' | 'curFieldSection' | 'curFieldRow' | 'curFieldVisible' | 'curFieldRequired' | 'curFieldOptions' | 'curFieldDefaultOption';

export type FieldsAction = SetFieldsStateAction;