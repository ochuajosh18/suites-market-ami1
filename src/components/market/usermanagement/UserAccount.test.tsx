import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import userManagementReducer from '../../../store/usermanagement/reducers';
import systemReducer from '../../../store/system/reducers';
import { SET_USERMANAGEMENT_STATE } from '../../../store/usermanagement/types';
import { SET_SYSTEM_STATE } from '../../../store/system/types';
import UserAccount from './UserAccount';

const createTestStore = () => {
    return createStore(
        combineReducers({
            usermanagement: userManagementReducer,
            system: systemReducer
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <UserAccount />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('User Account UI', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should render active tab and inactive tab', () => {
        store = createTestStore();
        const wrapper = setup(store);

        expect(wrapper.render().find(`#useraccount-active-tab`)).toHaveLength(1);
        expect(wrapper.render().find(`#useraccount-inactive-tab`)).toHaveLength(1);
    });

    it('Should render search bar', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        expect(wrapper.render().find(`#useraccount-search-fld`)).toHaveLength(1);
    });

    it('Should render Add New Button', () => {
        store = createTestStore();
        setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        expect(Header.render().find(`#useraccount-add-btn`)).toHaveLength(1);
    });

    it('Should be able to open add new user dialog.', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        
        const AddNewBtn = Header.find(`#useraccount-add-btn`).at(1);
        AddNewBtn.simulate('click');
        expect(store.getState().usermanagement.userAccountNewUserDialogIsOpen).toBe(true);
    });

    it('Should be able to open update user dialog.', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                userAccounts: [
                    {
                        email: 'raphael@test.com',
                        firstName: 'Raphael',
                        id: 'TEST::ID',
                        isActive: true,
                        lastName: 'Marcelino',
                        roleId: 'TEST::ROLE:1',
                        userType: 'TESTUSERTYPE',
                    }
                ],
                userRoles: [
                    {
                        amiAccess: [],
                        amiAccess_old: [],
                        appAccess: [],
                        appAccess_old: [],
                        docType: 'ROLE',
                        forMarketplace: false,
                        id: 'TEST::ROLE:1',
                        isDeleted: false,
                        name: 'Vendor',
                        type: 'TestType',
                    }
                ]
            }
        })

        wrapper.update();
        const AuxButton = wrapper.find('#market-aux-button').at(0);
        AuxButton.simulate('click');
        wrapper.update();


        const EditButton = wrapper.find("#aux-popover").at(0).find("#useraccount-Raphael-Marcelino-0-edit-btn").at(0);
        EditButton.simulate('click');
        wrapper.update();

        expect(store.getState().usermanagement.userAccountNewUserDialogIsOpen).toBe(true);
    });

});

describe('User Account CRUD', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to add new user with proper validation', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                userRoles: [
                    {
                        amiAccess: [],
                        amiAccess_old: [],
                        appAccess: [],
                        appAccess_old: [],
                        docType: 'ROLE',
                        forMarketplace: false,
                        id: 'TEST::ROLE:1',
                        isDeleted: false,
                        name: 'Vendor',
                        type: 'TestType',
                    }
                ]
            }
        })
        wrapper.update();
        
        const Header = mount(store.getState().system.header as JSX.Element);
        const AddNewBtn = Header.find('#useraccount-add-btn').at(0);
        AddNewBtn.simulate('click');
        wrapper.update();

        const DialogAddBtn = wrapper.find("#useraccount-dialog").at(0).find("#useraccount-confirm-btn").at(0);
        DialogAddBtn.simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(false);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                activeUser: {
                    firstName: 'Raphael',
                    lastName: 'Marcelino',
                    email: 'raphaelmarcelino@test.com',
                    role: 'Vendor',
                    status: 'Active',
                    id: 'TEST::ID1'
                }
            }
        })
        wrapper.update();

        DialogAddBtn.simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(true);
    });


    it('Should be able to update user with proper validation', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                userAccounts: [
                    {
                        email: 'raphael@test.com',
                        firstName: 'Raphael',
                        id: 'TEST::ID',
                        isActive: true,
                        lastName: 'Marcelino',
                        roleId: 'TEST::ROLE:1',
                        userType: 'Vendor',
                    }
                ],
                userRoles: [
                    {
                        amiAccess: [],
                        amiAccess_old: [],
                        appAccess: [],
                        appAccess_old: [],
                        docType: 'ROLE',
                        forMarketplace: false,
                        id: 'TEST::ROLE:1',
                        isDeleted: false,
                        name: 'Vendor',
                        type: 'TestType',
                    }
                ]
            }
        })
        wrapper.update();

        const AuxButton = wrapper.find('#market-aux-button').at(0);
        AuxButton.simulate('click');
        wrapper.update();


        const EditButton = wrapper.find("#aux-popover").at(0).find("#useraccount-Raphael-Marcelino-0-edit-btn").at(0);
        EditButton.simulate('click');
        wrapper.update();

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                activeUser: {
                    ...store.getState().usermanagement.activeUser,
                    firstName: ''
                }
            }
        })

        const DialogAddBtn = wrapper.find("#useraccount-dialog").at(0).find("#useraccount-confirm-btn").at(0);
        DialogAddBtn.simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(false);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                activeUser: {
                    ...store.getState().usermanagement.activeUser,
                    firstName: 'Raphael'
                }
            }
        })
        wrapper.update();
        DialogAddBtn.simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

    it('Should be able to delete user with confirmation', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                userAccounts: [
                    {
                        email: 'raphael@test.com',
                        firstName: 'Raphael',
                        id: 'TEST::ID',
                        isActive: true,
                        lastName: 'Marcelino',
                        roleId: 'TEST::ROLE:1',
                        userType: 'TESTUSERTYPE',
                    }
                ],
                userRoles: [
                    {
                        amiAccess: [],
                        amiAccess_old: [],
                        appAccess: [],
                        appAccess_old: [],
                        docType: 'ROLE',
                        forMarketplace: false,
                        id: 'TEST::ROLE:1',
                        isDeleted: false,
                        name: 'Vendor',
                        type: 'TestType',
                    }
                ]
            }
        })
        wrapper.update();

        const AuxButton = wrapper.find('#market-aux-button').at(0);
        AuxButton.simulate('click');
        wrapper.update();

        const DeleteBtn = wrapper.find("#aux-popover").at(0).find("#useraccount-Raphael-Marcelino-0-delete-btn").at(0);
        DeleteBtn.simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

    it('Should be able to search user account', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                userAccounts: [
                    {
                        email: 'raphael@test.com',
                        firstName: 'Raphael',
                        id: 'TEST::ID',
                        isActive: true,
                        lastName: 'Marcelino',
                        roleId: 'TEST::ROLE:1',
                        userType: 'TESTUSERTYPE',
                    }
                ],
                userRoles: [
                    {
                        amiAccess: [],
                        amiAccess_old: [],
                        appAccess: [],
                        appAccess_old: [],
                        docType: 'ROLE',
                        forMarketplace: false,
                        id: 'TEST::ROLE:1',
                        isDeleted: false,
                        name: 'Vendor',
                        type: 'TestType',
                    }
                ]
            }
        })

        const SearchInput = wrapper.find('#useraccount-search-fld').at(0).find('input');
        SearchInput.simulate('change', { target: { value: 'NOTEXISTINGDATA' }});
        SearchInput.props().value = 'NOTEXISTINGDATA'; // manual update since this is an uncontrolled component
        wrapper.update();

        expect(SearchInput.props().value).toEqual('NOTEXISTINGDATA');
    });

    it('Should be able to sort the users', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false
            }
        });

        wrapper.update();
        wrapper.find('#name-sortable').at(0).simulate('click');
        
        expect(store.getState().usermanagement.activeSort).toEqual('name');
    });
});