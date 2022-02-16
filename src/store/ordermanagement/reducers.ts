import {
    SET_ORDER_MANAGEMENT_STATE,
    OrderManagementState,
    OrderManagementAction,
} from './types';

const INITIAL_STATE: OrderManagementState = {
    filters: { },
    activeFilters: { },
    filterMinPrice: 0,
    filterMaxPrice: 1,
    activeSort: '',
    activeSortOrder: '',
    activeOrderLoading: false,
    orderHistoryTab: 'All',
    orders: [],
    orderLoading: false,
    salesOrderTab: 'Unassigned',
    search: '',
    historyOpen: false
};

export default (state = INITIAL_STATE, action: OrderManagementAction): OrderManagementState => {
    switch(action.type) {
        case SET_ORDER_MANAGEMENT_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
} 
