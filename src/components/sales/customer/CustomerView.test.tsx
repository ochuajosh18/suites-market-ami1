import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import customer from '../../../store/customer/reducers';
import salesperson from '../../../store/salesperson/reducers';
import system from '../../../store/system/reducers';
import { SET_CUSTOMER_STATE, ICustomer as CustomerType } from '../../../store/customer/types';
import { SET_SYSTEM_STATE } from '../../../store/system/types';
import CustomerView from './CustomerView';
import { v4 } from 'uuid';

// mock google map components
jest.mock('@react-google-maps/api', () => {
    return {
        withGoogleMap: (Component) => Component,
        withScriptjs: (Component) => Component,
        Polyline: (props) => <div />,
        Marker: (props) => <div />,
        GoogleMap: (props) => (<div><div className="mock-google-maps" /></div>),
        StandaloneSearchBox: (props) => (<div><div className="mock-searchbox" /></div>),
    };
});

const createTestStore = () => {
    return createStore(
        combineReducers({
            customer,
            salesperson,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <CustomerView />
            </Router>
        </Provider>
    )
    return wrapper;
}



const mockedFields = [
    {
        name: 'test',
        title: 'test',
        row: 0,
        type: 'Input Text',
        section: 'mock'
    },
    {
        name: 'name',
        title: 'Customer Name',
        row: 0,
        type: 'Input Text',
        section: 'mock'
    },
];

describe('Sales Customer View', () => { // test suite
    let store: ReturnType<typeof createTestStore>;
    
    it('Should be able to update common information fields with module fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                activeCustomer: { 
                    id: '',
                    name: 'Test Customer',
                    isActive: true,
                    salespersonId: '',
                    email: '',
                    contactNumber: ''
                } as CustomerType,
                customerViewLoading: false,
                customerViewActiveTab: 'Common Information',
                fields: mockedFields,
                sections: ['mock']
            }
        });

        const html = wrapper.render(); // # = id . = className (selector)
        expect(html.find('#name-input').val()).toBe('Test Customer');
    });

    it('Should be able to save common information fields using module fields', () => {
        store = createTestStore();
        const id = v4();
        const CUSTOMER_DATA = {
            id,
            name: 'Test Customer',
            isActive: true,
            salespersonId: 'test',
            email: 'testcustomer@test.com',
            contactNumber: '09999999999',
            logo: { path: '', name: '', size: 0, type: '' }
        } as CustomerType;

        // set test data
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                activeCustomer: CUSTOMER_DATA,
                customerViewLoading: false,
                customerViewActiveTab: 'Common Information'
            }
        });

        // // set save button
        store.dispatch({
            type: SET_SYSTEM_STATE,
            payload: {
                headerEndButton: <span>{JSON.stringify(store.getState().customer.activeCustomer)}</span>
            }
        });

        const span = store.getState().system.headerEndButton;
        const spanWrapper = mount(span as JSX.Element);

        expect(spanWrapper.text()).toBe(JSON.stringify(CUSTOMER_DATA)); // expect your active customer data to be the same with the test data
    });

    it('Should be able to delete a customer with module fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                activeCustomer: { 
                    id: 'test',
                    name: 'Test Customer',
                    isActive: true,
                    salespersonId: '',
                    email: '',
                    contactNumber: ''
                } as CustomerType,
                customerViewLoading: false,
                customerViewActiveTab: 'Common Information',
                fields: mockedFields,
                sections: ['mock']
            }
        });
        wrapper.update();
        // click aux button at the right side of the header
        const AuxButton = wrapper.find('#sales-aux-button').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#customer-delete-btn").at(1);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

});