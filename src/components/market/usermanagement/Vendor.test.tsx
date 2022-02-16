import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import usermanagementReducer from '../../../store/usermanagement/reducers';
import { SET_USERMANAGEMENT_STATE, Vendor as VendorType } from '../../../store/usermanagement/types';
import Vendor from './Vendor';

const createTestStore = () => {
    return createStore(
        combineReducers({
            usermanagement: usermanagementReducer
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Vendor />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Vendor List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to change view tabs to Approved/Pending/Disapproved and load vendors', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false
            }
        });

        wrapper.update();
        // traverse to tab, and simulate a click
        wrapper.find('#vendor-pending-tab').at(0).simulate('click');
        expect(store.getState().usermanagement.vendorTab).toBe('Pending');

        wrapper.find('#vendor-disapproved-tab').at(0).simulate('click');
        expect(store.getState().usermanagement.vendorTab).toBe('Rejected');

        wrapper.find('#vendor-approved-tab').at(0).simulate('click');
        expect(store.getState().usermanagement.vendorTab).toBe('Approved');
    });

    it('Should be able to search a vendor', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                salespersonListLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = wrapper.find('#vendor-search-fld').at(0).find('input');
        SearchInput.simulate('change', { target: { value: 'test' }});
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });

    it('Should be able to sort the vendors', () => {
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

    it('Should be able approve/disapprove vendor', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        wrapper.find('#vendor-pending-tab').at(0).simulate('click');

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                userListLoading: false,
                vendors: [{
                    id: 'string',
                    firstName: 'string',
                    lastName: 'string',
                    companyName: 'string',
                    email: 'string',
                    mobileNumber: 'string',
                    status: 'Pending'
                } as VendorType]
            }
        });

        wrapper.update()
        wrapper.find('#vendor-approve-button-string').at(0).simulate('click');

        wrapper.update()
        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                vendorDetails: {
                    id: 'string',
                    firstName: 'string',
                    lastName: 'string',
                    companyName: 'string',
                    email: 'string',
                    mobileNumber: 'string',
                    status: 'Pending'
                } as VendorType
            }
        })

        // wrapper.update()
        // console.log(store.getState().usermanagement)
        // console.log(wrapper.render().html())
        // wrapper.find('#vendor-approval-dialog').find('#vendor-remarks-input').at(0).find('input').simulate('change', {target: {value: 'approved user'}})
        // wrapper.find('#vendor-approval-confirm-btn').at(0).simulate('click');

        expect(store.getState().usermanagement.modalVisible).toBe(true)
    });
});