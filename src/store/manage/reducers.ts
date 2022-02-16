import {
    SET_MANAGE_STATE,
    ManageAction,
    ManageState,
} from './types';

const INITIAL_STATE: ManageState = {
    entities: [],
    entityLoading: false,
    activeEntityId: '',
    entitySearch: '',
    activeEntity: undefined,
    activeEntityType: '',
    activeEntityLoading: false,
    entityRoles: []
}

export default (state = INITIAL_STATE, action: ManageAction): ManageState => {
    switch (action.type) {
        case SET_MANAGE_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}