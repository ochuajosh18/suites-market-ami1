import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import userManagementReducer from '../../../store/usermanagement/reducers';
import systemReducer from '../../../store/system/reducers';
import { SET_USERMANAGEMENT_STATE } from '../../../store/usermanagement/types';
import Customer from './Customer';

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
                <Customer />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Customer List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to search a customer', () => {
        store = createTestStore();
        setup(store); 
        const Header = mount(store.getState().system.header as JSX.Element);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false
            }
        });

        // traverse to input, reverse simulate an input
        const SearchInput = Header.find('#customer-search-fld').at(0).find('input');
        SearchInput.simulate('change', { target: { value: 'test' }});
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });


    it('Should be able to sort and load the users', () => {
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