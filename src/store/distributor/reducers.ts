import {
    SET_DISTRIBUTOR_STATE,
    DistributorAction,
    DistributorState
} from './types';

const INITIAL_STATE: DistributorState = {
    distributors: [],
    distributorViewActiveTab: 'Common Information',
    distributorViewLoading: false,
    activeDistributorCustomerListLoading: false,
    activeDistributorCustomers: [],
    activeDistributorModalOpen: false,
    filters: {},
    activeFilters: {},
    distributorListLoading: false,
    activeTab: 'Active',
    activeContacts: [],
    search: '',
    distributorContactLoading: false,
    fields: [
        {
            id: 'name',
            title: 'Distributor Name',
            name: 'name',
            section: 'General Information',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'status',
            title: 'Status',
            name: 'isActive',
            section: 'General Information',
            row: 0,
            type: 'Radio Button',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'id',
            title: 'ID',
            name: 'displayId',
            section: 'General Information',
            row: 0,
            type: 'View',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'salespersonId',
            title: 'Salesperson Name',
            name: 'salespersonId',
            section: 'General Information',
            row: 0,
            type: 'Searchable Dropdown',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'email',
            title: 'Email',
            name: 'email',
            section: 'General Information',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'channel',
            title: 'Channel',
            name: 'channel',
            section: 'General Information',
            row: 0,
            type: 'Searchable Dropdown',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'logo',
            title: 'Logo',
            name: 'logo',
            section: 'General Information',
            row: 0,
            type: 'Multimedia',
            isRequired: false,
            isDefault: true,
            isActive: true,
            isMultiple: false
        },
        {
            id: 'address',
            title: 'Street Address 1',
            name: 'address',
            section: 'Address',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'address2',
            title: 'Street Address 2',
            name: 'address2',
            section: 'Address',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'postalCode',
            title: 'Postal Code',
            name: 'postalCode',
            section: 'Address',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'city',
            title: 'City',
            name: 'city',
            section: 'Address',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
        {
            id: 'country',
            title: 'Country',
            name: 'country',
            section: 'Address',
            row: 0,
            type: 'Input Text',
            isRequired: false,
            isDefault: true,
            isActive: true
        },
    ],
    sections: ['General Information', 'Address'],
    contactFields: [],
    contactSections: [],
    customerList: []
}

const distributorReducer = (state = INITIAL_STATE, action: DistributorAction): DistributorState => {
    switch(action.type) {
        case SET_DISTRIBUTOR_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}

export default distributorReducer;