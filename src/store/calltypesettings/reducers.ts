import {
    CallTypeSettingsState,
    SET_CALL_TYPE_SETTINGS_STATE,
    CallTypeSettingsAction
} from './types';

const INITIAL_STATE: CallTypeSettingsState = {
    callElements:[],
    callTypeElementsLoading: false,
    activeScreen: "iphone",
    editing: false,
    buttonName: "Edit",
    callType: "",
    activeCallType: ""
}
export default (state = INITIAL_STATE, action:CallTypeSettingsAction):CallTypeSettingsState  => {
    switch(action.type) {
        case SET_CALL_TYPE_SETTINGS_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}