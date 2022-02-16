import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { SET_ACCESSIBILITY_STATE, UserRole } from '../../../store/accessibility/types';
import accessibility from '../../../store/accessibility/reducers';
import system from '../../../store/system/reducers';
import Accessibility from './Accessibility';

console.warn = jest.fn();

const createTestStore = () => {
    return createStore(
        combineReducers({
            accessibility,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Accessibility />
            </Router>
        </Provider>
    )
    return wrapper;
}

const setupForCrud = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    store.dispatch({
        type: SET_ACCESSIBILITY_STATE,
        payload: { 
            userRoles: [{
                id: 'test',
                name: 'testrole',
                description: '',
                amiAccess: [],
                appAccess: [],
                dateCreated: '',
                dateUpdated: ''
            }] as Array<UserRole>,
            activeUserRole: 'testrole',
            activeEditUserRole: {
                id: 'test',
                name: 'testrole',
                amiAccess: [],
                appAccess: [],
                dateCreated: '',
                dateUpdated: ''
            } 
        }
    });
}

describe('Accessbility CRUD', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to fetch roles', () => {
        store = createTestStore();
        setup(store); // your wrapped component by enzyme
        store.dispatch({
            type: SET_ACCESSIBILITY_STATE,
            payload: { 
                userRoles: [{
                    id: 'test',
                    name: 'testrole',
                    description: '',
                    amiAccess: [],
                    appAccess: [],
                    dateCreated: '',
                    dateUpdated: ''
                }] as Array<UserRole>
            }
        });

        expect(store.getState().accessibility.userRoles).toHaveLength(1)
    });
    
    it('Should be able to load the role table', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        expect(wrapper.find('#accessibility-crud-table').at(0)).toHaveLength(1);
    });

    it('Should be able to check an accessibility checkbox', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityTable = wrapper.find('#accessibility-crud-table').at(0);
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-view-checkbox').at(0).simulate('click');
        expect(store.getState().accessibility.activeEditUserRole!.amiAccess).toContain('VIEW::PRODUCT_MANAGEMENT');
    });

    it('Should be able to uncheck an accessibility checkbox', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityTable = wrapper.find('#accessibility-crud-table').at(0);
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-view-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-view-checkbox').at(0).simulate('click');
        expect(store.getState().accessibility.activeEditUserRole!.amiAccess).toHaveLength(0);
    });

    it('Should be able to check module row checkbox if all accessibilities are checked', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityTable = wrapper.find('#accessibility-crud-table').at(0);
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-view-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-create-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-update-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-delete-checkbox').at(0).simulate('click');
        expect(store.getState().accessibility.activeModuleCheckbox).toContain('Product Management');
    });

    it('Should be able to uncheck module row checkbox if not all accessibilities are checked', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityTable = wrapper.find('#accessibility-crud-table').at(0);
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-view-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-create-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-update-checkbox').at(0).simulate('click');
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-delete-checkbox').at(0).simulate('click');
        expect(store.getState().accessibility.activeModuleCheckbox).toContain('Product Management');

        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-delete-checkbox').at(0).simulate('click');
        expect(store.getState().accessibility.activeModuleCheckbox).toHaveLength(0);
    });

    it('Should be able to check ALL modules checkbox when all accessibilities are checked', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityTable = wrapper.find('#accessibility-table-container').at(0);
        AccessibilityTable.find('#accessibility-table-all-checkbox').at(0).simulate('click')

        expect(store.getState().accessibility.activeModuleCheckbox).toContain('ALL');
    });

    it('Should be able to uncheck ALL modules checkbox when all accessibilities are checked', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityContainer = wrapper.find('#accessibility-table-container').at(0);
        AccessibilityContainer.find('#accessibility-table-all-checkbox').at(0).simulate('click')

        expect(store.getState().accessibility.activeModuleCheckbox).toContain('ALL');
        const AccessibilityTable = wrapper.find('#accessibility-crud-table').at(0);
        AccessibilityTable.find('#module-PRODUCT_MANAGEMENT-view-checkbox').at(0).simulate('click');

        expect(store.getState().accessibility.activeModuleCheckbox).toHaveLength(store.getState().accessibility.amiModules.length - 1)
    });

    it('Should be able to save the accessibilities of the role selected', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud(wrapper, store);
        wrapper.update();
        const AccessibilityContainer = wrapper.find('#accessibility-table-container').at(0);
        AccessibilityContainer.find('#accessibility-table-all-checkbox').at(0).simulate('click')

        const SaveButton = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveButton.find('button').at(0).simulate('click');

        expect(store.getState().accessibility.roleLoading).toBe(true);
    });
});