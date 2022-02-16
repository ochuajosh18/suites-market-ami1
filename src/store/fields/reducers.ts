import {
    SET_FIELDS_STATE,
    FieldsState,
    FieldsAction
} from './types';

const INITIAL_STATE: FieldsState = {
    fields: [],
    fieldsAdded: [],
    curFieldId: '',
    curFieldName: '',
    curFieldType: '',
    curFieldSection: '',
    curFieldRow: '',
    curFieldRequired: false,
    curFieldOptions: [],
    curFieldDefaultOption: '',
    modalVisible: false,
    fieldsEditing: false,
    fieldsLoading: false,
    screen: 'VIEW',
    fieldDialogType: 'ADD',
    activeCustomerTab: 'CUSTOMERFIELDS',
    activeModule: 'Product Management',
    sections: [],
    elements: [],
    activeFieldName: '',
    activeFieldSection: '',
    openSections: []
};

export default (state = INITIAL_STATE, action: FieldsAction): FieldsState => {
    switch(action.type) {
        case SET_FIELDS_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
} 
