import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import userManagementReducer from '../../../store/usermanagement/reducers';
import system from '../../../store/system/reducers';
import { SET_USERMANAGEMENT_STATE, Customer, Address } from '../../../store/usermanagement/types';
import CustomerView from './CustomerView';

const createTestStore = () => {
    return createStore(
        combineReducers({
            usermanagement: userManagementReducer,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/market/customer/TEST']}>
                <Route path="/market/customer/:salespersonId" component={CustomerView} />
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

const setupForRead = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    store.dispatch({
        type: SET_USERMANAGEMENT_STATE,
        payload: {
            customerDetails: {
                id: 'test::id',
                firstName: 'sample',
                lastName: 'testing',
                email: 'testsample@gmail.com',
                mobileNumber: '12341234',
                countryCode: '+63',
                areaCode: '1234',
                landlineNumber: '432123'
            } as Customer,
            userDetailLoading: false
        }
    });
    wrapper.update()
}


describe('Customer view', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to render customer fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForRead(wrapper, store);
        const customerKeys = Object.keys(store.getState().usermanagement.customerDetails!).map((c) => c.toLowerCase());
        let withValue = true;

        wrapper.find('input').forEach((node) => {
            const { id, value } = node.props();
            if(id) {
                for(const key of customerKeys) {
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

    it('Should be able to render address fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForRead(wrapper, store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                customerHomeAddress: {
                   addressLine: 'test',
                   postalCode: 1234,
                   province: 'test',
                   country: 'test',
                   city: 'test'
                } as Address
            }
        });
        wrapper.update()

        const addressKeys = Object.keys(store.getState().usermanagement.customerHomeAddress!).map((c) => c.toLowerCase());
        let withValue = true;

        wrapper.find('input').forEach((node) => {
            const { id, value } = node.props();
            if(id) {
                for(const key of addressKeys) {
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

    it('Should be able to render address fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForRead(wrapper, store);

        store.dispatch({
            type: SET_USERMANAGEMENT_STATE,
            payload: {
                customerOfficeAddress: {
                   addressLine: 'test',
                   postalCode: 1234,
                   province: 'test',
                   country: 'test',
                   city: 'test'
                } as Address
            }
        });
        wrapper.update()

        const addressKeys = Object.keys(store.getState().usermanagement.customerOfficeAddress!).map((c) => c.toLowerCase());
        let withValue = true;

        wrapper.find('input').forEach((node) => {
            const { id, value } = node.props();
            if(id) {
                for(const key of addressKeys) {
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

});