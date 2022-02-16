import {
    SET_APPLICATION_SETTINGS_STATE,
    ApplicationSettingsState,
    ApplicationSettingsAction
} from './types';

const INITIAL_STATE: ApplicationSettingsState = {
    activeTab: 'Application',
    activePermissionTab: 'IPHONE',
    permissionTabs: [
        {
            id: 'test',
            label: 'Sample Module 1',
            value: '',
            row: 1,
        },
        {
            id: 'test2',
            label: 'Sample Module 2',
            value: '',
            row: 2,
        },
        {
            id: 'test3',
            label: 'Sample Module 3',
            value: '',
            row: 3,
        },
        {
            id: 'test4',
            label: 'Sample Module 4',
            value: '',
            row: 4,
        },
        {
            id: 'test5',
            label: 'Sample Module 5',
            value: '',
            row: 5,
        },
        {
            id: 'test6',
            label: 'Sample Module 6',
            value: '',
            row: 6
        },
        {
            id: 'test7',
            label: 'Sample Module 7',
            value: '',
            row: 7,
        },
        {
            id: 'test8',
            label: 'Sample Module 8',
            value: '',
            row: 8,
        },
        {
            id: 'test9',
            label: 'Sample Module 9',
            value: '',
            row: 9,
        },
        {
            id: 'test10',
            label: 'Sample Module 10',
            value: '',
            row: 10,
        }
    ],
    editing: false
}

export default (state = INITIAL_STATE, action: ApplicationSettingsAction): ApplicationSettingsState => {
    switch (action.type) {
        case SET_APPLICATION_SETTINGS_STATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}