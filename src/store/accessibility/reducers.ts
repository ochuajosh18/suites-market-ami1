import { 
    AccessibilityAction,
    AccessibilityState,
    SET_ACCESSIBILITY_STATE
} from './types';

const INITIAL_STATE: AccessibilityState = {
    activeTab: 'AMI',
    amiModules: [ 'Product Management', 'Reviews', 'Order Management', 'Promo Banner', 'Category Management', 'Library' ],
    appModules: [ 'Categories', 'Favorites', 'Shopping Bag', 'My Account' ],
    platform: ['Symphony Sales', 'Symphony Market'],
    userRoles: [],
    activePlatform: 'Symphony Market',
    activeUserRole: '',
    modules: [],
    activeModuleCheckbox: [],
    roleLoading: false,
    roles: [],
    rolesLoading: false
}

export default (state = INITIAL_STATE, action: AccessibilityAction): AccessibilityState => {
    switch (action.type) {
        case SET_ACCESSIBILITY_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}