import {
    UserManagementState,
    UserManagementAction,
    SET_USERMANAGEMENT_STATE,
    LOAD_VENDOR_LIST,
    LOAD_VENDOR_DETAILS,
    LOAD_CUSTOMER_LIST,
    LOAD_CUSTOMER_DETAILS,
    LOAD_ROLE_LIST
} from './types';

const INITIAL_STATE: UserManagementState = {
    vendors: [],
    customers: [],
    userListLoading: false,
    userDetailLoading: false,
    vendorTab: "Pending",
    modalVisible: false,
    vendorStatusUpdate: '',
    vendorRemarksUpdate: '',
    statusLoading: false,
    userAccounts: [],
    userRoles: [],
    userAccountDialogeConfirmLabel: 'Add',
    userAccountTab: 'Active',
    userAccountNewUserDialogIsOpen: false,
    userAccountSaveLoading: false,
    roles: [],
    selectedRoleId: "",
    selectedRoleName: "",
    selectedRoleDescription: "",
    deleteModalVisible: false,
    activeSort: '',
    activeSortOrder: '',
    activeFilters: { },
    search: ''
}

export default (state = INITIAL_STATE, action: UserManagementAction): UserManagementState => {
    switch(action.type){
        case  SET_USERMANAGEMENT_STATE:
            return { ...state,  ...action.payload };
        case  LOAD_VENDOR_LIST:
            return { ...state, vendors: action.payload };
        case  LOAD_VENDOR_DETAILS:
            return { ...state,  vendorDetails: action.payload };
        case  LOAD_CUSTOMER_LIST:
            return { ...state, customers: action.payload };
        case  LOAD_CUSTOMER_DETAILS:
            return { ...state,  customerDetails: action.payload };
        case  LOAD_ROLE_LIST:
            return { ...state, roles: action.payload };
        default: return state;
    }
}