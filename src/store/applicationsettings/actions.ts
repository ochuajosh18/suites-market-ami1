import {
    SET_APPLICATION_SETTINGS_STATE,
    ApplicationSettingsInput,
    ApplicationSettingsInputAction
} from './types';

export const setApplicationSettingsState = (state: ApplicationSettingsInput): ApplicationSettingsInputAction => ({
    type: SET_APPLICATION_SETTINGS_STATE,
    payload: state
});