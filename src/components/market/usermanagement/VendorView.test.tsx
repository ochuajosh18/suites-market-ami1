import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import usermanagementReducer from '../../../store/usermanagement/reducers';
import system from '../../../store/system/reducers';
import { SET_USERMANAGEMENT_STATE, Vendor } from '../../../store/usermanagement/types';
import VendorView from './VendorView';

const createTestStore = () => {
    return createStore(
        combineReducers({
            usermanagement: usermanagementReducer,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/market/vendor/TEST']}>
                <Route path="/market/vendor/:salespersonId" component={VendorView} />
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

const setupForRead = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    store.dispatch({
        type: SET_USERMANAGEMENT_STATE,
        payload: {
            vendorDetails: {
                id: 'test::id',
                firstName: 'sample',
                lastName: 'testing',
                companyName: 'testing',
                email: 'testsample@gmail.com',
                mobileNumber: '12341234',
                countryCode: '+63',
                areaCode: '1234',
                landlineNumber: '432123',
                status: 'Pending',
                addressLine: 'test',
                postalCode: 1234,
                city: 'test',
                province: 'test',
                country: 'test'
            } as Vendor,
            userDetailLoading: false
        }
    });
    wrapper.update()
}

describe('Vendor View', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to render vendor fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForRead(wrapper, store);
        const vendorKeys = Object.keys(store.getState().usermanagement.vendorDetails!).map((c) => c.toLowerCase());
        let withValue = true;

        wrapper.find('input').forEach((node) => {
            const { id, value } = node.props();
            if(id) {
                for(const key of vendorKeys) {
                    if(id.toLowerCase().indexOf(key) > -1) {
                        if(!value) {
                            withValue = false
                        }
                    }
                }
            }
        })
        expect(withValue).toBe(true)  
    });

    it('Should be able approve/dissapprove vendor', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        setupForRead(wrapper, store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: { userDetailLoading: false }
        });

        wrapper.update()
        wrapper.find('#approve-vendor-menu-item').at(0).simulate('click');

        expect(store.getState().usermanagement.modalVisible).toBe(true)
    });
});