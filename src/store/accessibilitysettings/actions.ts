import {    
   SET_ACCESSIBILITY_SETTINGS_STATE,
   UPDATE_ACTIVE_ACCESSIBILITY_SETTINGS,
   AccessibilitySettingsInput,
   AccessibilitySettingsAction,
   ActiveAccessibilitySettingsInput,
} from '../../store/accessibilitysettings/types';

export const setAccessibilitySettingsState = (state: AccessibilitySettingsInput): AccessibilitySettingsAction => ({
    type: SET_ACCESSIBILITY_SETTINGS_STATE,
    payload: state
});

export const updateActiveAccessibilitySettings = (input: ActiveAccessibilitySettingsInput): AccessibilitySettingsAction => ({
    type: UPDATE_ACTIVE_ACCESSIBILITY_SETTINGS,
    payload: input
});