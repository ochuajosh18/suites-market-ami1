import {
    SET_CUSTOMER_STATE,
    CustomerState,
    CustomerAction,
    UPDATE_ACTIVE_CUSTOMER,
    UPDATE_ACTIVE_CONTACT,
    ICustomer,
    CustomerContact
} from './types';

const INITIAL_STATE: CustomerState = {
    customerSearch: '',
    customerList: [],
    activeCustomerId: '',
    activeFields: [],
    customerListLoading: false,
    customerViewLoading: false,
    customerCreateLoading: false,
    activeTab: 'INFO',
    showContactForm: false,
    activeContacts: [],
    customerAction: 'UPDATE',
    contactLoading: false,
    activeContactFields: [],
    customerListActiveTab: 'Active',
    customerViewActiveTab: 'Common Information',
    customerContactLoading: false,
    customerContacts: [],
    fields: [],
    sections: [],
    contactFields: [],
    contactSections: [],
    activeFilters: { },
    filters: { },
    searchString: ''
}

export default (state = INITIAL_STATE, action: CustomerAction): CustomerState => {
    switch (action.type) {
        case SET_CUSTOMER_STATE:
            return { ...state, ...action.payload };
        case UPDATE_ACTIVE_CUSTOMER:
            return { ...state, activeCustomer: { ...state.activeCustomer as ICustomer, ...{[action.payload.field]: action.payload.text} }}
        case UPDATE_ACTIVE_CONTACT:
            return { ...state, activeContact: { ...state.activeContact as CustomerContact, ...{[action.payload.field]: action.payload.value }} }
        default:
        return state;
    }
}