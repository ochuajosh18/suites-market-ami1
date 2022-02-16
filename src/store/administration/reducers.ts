import {
    SET_ADMINISTRATION_STATE,
    AdministrationAction,
    AdministrationState,
} from './types';

const INITIAL_STATE: AdministrationState = {
    users: [],
    userLoading: false,
    activeUserId: '',
    userSearch: '',
    activeUser: undefined,
    roles: [],
    userAction: '',
}

export default (state = INITIAL_STATE, action: AdministrationAction): AdministrationState => {
    switch (action.type) {
        case SET_ADMINISTRATION_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}