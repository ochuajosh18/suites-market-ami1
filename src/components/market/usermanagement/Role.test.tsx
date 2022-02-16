import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import usermanagementReducer from '../../../store/usermanagement/reducers';
import systemReducer from '../../../store/system/reducers';
import { SET_USERMANAGEMENT_STATE, Role as RoleType } from '../../../store/usermanagement/types'
import Role from './Role';

const createTestStore = () => {
    return createStore(
        combineReducers({
            usermanagement: usermanagementReducer,
            system: systemReducer
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Role />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Role List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to search a role', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = wrapper.find('#role-search-fld').at(0).find('input');
        SearchInput.simulate('change', { target: { value: 'test' }});
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });

    it('It should render Add New Button', () => {
        store = createTestStore();
        setup(store);
        const Header = mount(store.getState().system.headerEndButton as JSX.Element);
        
        expect(Header.render().find(`#add-role-btn`)).toHaveLength(1);
    });

    it('Should be able add role', () => {
        store = createTestStore();
        setup(store); 
        const Header = mount(store.getState().system.headerEndButton as JSX.Element);

        Header.find(`#add-role-btn`).at(0).simulate('click');
        expect(store.getState().usermanagement.modalVisible).toBe(true)
    });

    it('Should be able edit role', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                roles: [{
                    id: 'test',
                    name: 'test',
                    description: 'test'
                } as RoleType]
            }
        });

        wrapper.update()
        wrapper.find('#aux-button-test').at(0).simulate('click');

        wrapper.update()
        wrapper.find('#role-edit-btn-test').at(0).simulate('click');

        expect(store.getState().usermanagement.modalVisible).toBe(true)
    });

    it('Should be able delete role', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                roles: [{
                    id: 'test',
                    name: 'test',
                    description: 'test'
                } as RoleType]
            }
        });

        wrapper.update()
        wrapper.find('#aux-button-test').at(0).simulate('click');

        wrapper.update()
        wrapper.find('#role-delete-btn-test').at(0).simulate('click');

        expect(store.getState().usermanagement.deleteModalVisible).toBe(true)
    });
});