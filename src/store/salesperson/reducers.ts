import {
    SALESPERSON_CLICK, 
    SalespersonState,
    SalespersonAction,
    LOAD_SALESPERSON_LIST,
    TOGGLE_SALESPERSON_LIST_LOADING,
    LOAD_SALESPERSON_DETAILS,
    TOGGLE_SALESPERSON_DETAILS_LOADING,
    SET_SALESPERSON_STATE,
    SET_NEW_ACTIVE_SALESPERSON_DETAILS,
    TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING
} from './types';

const INITIAL_STATE: SalespersonState = {
    salespersonSearch: '',
    salespersons: [],
    activeSalesperson: '',
    salespersonListLoading: false,
    activeSalespersonDetail: undefined,
    salespersonDetailLoading: false,
    SalespersonCreateLoading:false,
    salespersonListTab: 'Active',
    fields: [],
    sections: [],
    filters: {},
    activeFilters: {}
}

export default (state = INITIAL_STATE, action: SalespersonAction): SalespersonState => {
    switch(action.type){
        case SALESPERSON_CLICK: 
            return { ...state, activeSalesperson: action.payload };
        case  LOAD_SALESPERSON_LIST:
            return { ...state, salespersons: action.payload };
        case  TOGGLE_SALESPERSON_LIST_LOADING:
            return { ...state, salespersonListLoading: action.payload };
        case  LOAD_SALESPERSON_DETAILS:
            return { ...state, activeSalespersonDetail: action.payload };
        case  TOGGLE_SALESPERSON_DETAILS_LOADING:
            return { ...state, salespersonDetailLoading: action.payload };
        case  SET_SALESPERSON_STATE:
            return { ...state,  ...action.payload };
        case  SET_NEW_ACTIVE_SALESPERSON_DETAILS:
            return { ...state, activeSalespersonDetail: action.payload };
        case  TOGGLE_NEW_ACTIVE_SALESPERSON_DETAILS_LOADING:
            return { ...state, SalespersonCreateLoading: action.payload };
        default: return state;
    }
}