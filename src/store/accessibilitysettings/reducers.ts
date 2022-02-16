import {
  SET_ACCESSIBILITY_SETTINGS_STATE,
  AccessibilitySettingsState,
  AccessibilitySettingsAction,
  AccessibilitySetting,
  UPDATE_ACTIVE_ACCESSIBILITY_SETTINGS,

} from '../../store/accessibilitysettings/types';

const INITIAL_STATE: AccessibilitySettingsState = {
    activeAccessilibility: {
        id: 'testModule',
        roleName: 'Salesperson',
        dateCreated: 'February 2, 2021 8:00 AM',
        lastUpdated: 'February 2, 2021 8:00 AM',
        appType: 'Basic',
        activeTab: 'AMI',
        modules: [
            {
                id: 'testModule1',
                name: 'Sample Module 1',
                isView: true,
                isEdit: true,
                isAdd: true,
                isDelete: false
            },
            {
                id: 'testModule2',
                name: 'Sample Module 2',
                isView: true,
                isEdit: false,
                isAdd: true,
                isDelete: false
            },
            {
                id: 'testModule3',
                name: 'Sample Module 3',
                isView: true,
                isEdit: false,
                isAdd: false,
                isDelete: false
            },
            {
                id: 'testModule4',
                name: 'Sample Module 4',
                isView: true,
                isEdit: true,
                isAdd: true,
                isDelete: false
            },
            {
                id: 'testModule5',
                name: 'Sample Module 5',
                isView: true,
                isEdit: true,
                isAdd: true,
                isDelete: false
            },
        ]
    },
    appType: 'Basic',
    activeTab: 'AMI',
}
export default (state = INITIAL_STATE, action:AccessibilitySettingsAction):AccessibilitySettingsState  => {
    switch(action.type) {
        case SET_ACCESSIBILITY_SETTINGS_STATE:
            return { ...state, ...action.payload };
        case UPDATE_ACTIVE_ACCESSIBILITY_SETTINGS:
          return { ...state, activeAccessilibility: { ...state.activeAccessilibility as AccessibilitySetting, ...{[action.payload.field]: action.payload.text }} }
          default:
            return state;
    }
}