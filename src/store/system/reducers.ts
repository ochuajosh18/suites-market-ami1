import {
    SET_SESSION,
    SET_HEADER_TEXT,
    SELECT_SIDEBAR_TAB,
    SET_HEADER_END_BUTTON,
    SET_INTERCEPTOR,
    EJECT_INTERCEPTOR,
    SystemAction,
    SystemState,
    SET_SYSTEM_STATE,
} from './types';
const INITIAL_STATE: SystemState = {
    userType: undefined,
    session: null,
    headerText: { main: '', sub: '' },
    header: undefined,
    sidebarTabValue: '',
    interceptors: null,
    route: '',
    expandedNavigation: '',
    systemDialogOpen: false,
    systemDialogMaxWidth: false,
    systemDialogTitle: '',
    systemDialogContent: '',
    systemDialogActions: undefined,
    systemDialogSimple: false,
    systemDialogConfirm: false,
    systemOverrideTitle: '',
    systemConfirmOnly: false,
    systemDialogConfirmAction: () => {},
    shallRedirect: false,
    redirectTo: ''
};

export default (
    state = INITIAL_STATE,
    action: SystemAction,
): SystemState => {
    switch (action.type) {
        case SET_SESSION:
            return { ...state, session: action.payload };
        case SET_HEADER_TEXT: {
            const { mainText, subText } = action.payload;
            return { ...state, headerText: { main: mainText, sub: subText } };
        }
        case SELECT_SIDEBAR_TAB: {
            return { ...state, sidebarTabValue: action.payload };
        }
        case SET_HEADER_END_BUTTON:
            return { ...state, headerEndButton: action.payload };
        case SET_INTERCEPTOR:
            return { ...state, interceptors: action.payload }
        case EJECT_INTERCEPTOR:
            return { ...state, interceptors: null }
        case SET_SYSTEM_STATE:
            return { ...state, ...action.payload };
        case 'clear_route_settings': 
            return { ...state, route: '', expandedNavigation: '', headerText: undefined }
        default:
            return state;
    }
}
