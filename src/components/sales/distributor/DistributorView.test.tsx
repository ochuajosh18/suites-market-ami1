import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import distributor from '../../../store/distributor/reducers';
import salesperson from '../../../store/salesperson/reducers';
import system from '../../../store/system/reducers';
import { SET_DISTRIBUTOR_STATE, Distributor as DistributorType } from '../../../store/distributor/types';
import { SET_SYSTEM_STATE } from '../../../store/system/types';
import DistributorView from './DistributorView';
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
            distributor,
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
                <DistributorView />
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
        section: 'General Information'
    },
    {
        name: 'name',
        title: 'Distributor Name',
        row: 0,
        type: 'Input Text',
        section: 'General Information'
    },
];

describe('Sales Distributor View', () => { // test suite
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to render common information fields using module fields', () => {
        store = createTestStore();
        const id = v4();
        const CUSTOMER_DATA = {
            id,
            name: 'Test Distributor',
            isActive: true,
            salespersonId: 'test',
            email: 'testdistributor@test.com',
            contactNumber: '09999999999',
            logo: { path: '', name: '', size: 0, type: '' }
        } as DistributorType;

        // set test data
        store.dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: {
                activeDistributor: CUSTOMER_DATA,
                distributorViewLoading: false,
                distributorViewActiveTab: 'Common Information'
            }
        });

        // // set save button
        store.dispatch({
            type: SET_SYSTEM_STATE,
            payload: {
                headerEndButton: <span>{JSON.stringify(store.getState().distributor.activeDistributor)}</span>
            }
        });

        const span = store.getState().system.headerEndButton;
        const spanWrapper = mount(span as JSX.Element);

        expect(spanWrapper.text()).toBe(JSON.stringify(CUSTOMER_DATA)); // expect your active distributor data to be the same with the test data
    });

    it('Should be able to render and toggle delete distributor with module fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: {
                activeDistributor: { 
                    id: 'test',
                    name: 'Test Distributor',
                    isActive: true,
                    salespersonId: '',
                    email: '',
                    contactNumber: ''
                } as DistributorType,
                distributorViewLoading: false,
                distributorViewActiveTab: 'Common Information',
                fields: mockedFields,
                sections: ['General Information']
            }
        });
        wrapper.update();
        // click aux button at the right side of the header
        const AuxButton = wrapper.find('#sales-aux-button').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#distributor-delete-btn").at(1);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });


    it('Should be able to save common information fields using module fields', () => {
        store = createTestStore();
        const id = v4();
        const DISTRIBUTOR_DATA = {
            id,
            name: 'Test Distributor',
            isActive: true,
            email: 'testdistrib@test.com',
            contactNumber: '09999999999',
            logo: { path: '', name: '', size: 0, type: '' }
        } as DistributorType;
        store.dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: {
                activeDistributor: { 
                    id,
                    name: 'Test Distributor',
                    isActive: true,
                    email: 'testdistrib@test.com',
                    contactNumber: '09999999999',
                    logo: { path: '', name: '', size: 0, type: ''}
                } as DistributorType,
                distributorViewLoading: false,
                distributorViewActiveTab: 'Common Information',
                fields: mockedFields,
                sections: ['General Information']
            }
        });

        // // set save button
        store.dispatch({
            type: SET_SYSTEM_STATE,
            payload: {
                headerEndButton: <span>{JSON.stringify(store.getState().distributor.activeDistributor)}</span>
            }
        });

        const span = store.getState().system.headerEndButton;
        const spanWrapper = mount(span as JSX.Element);

        expect(spanWrapper.text()).toBe(JSON.stringify(DISTRIBUTOR_DATA)); // expect your active customer data to be the same with the test data
    });
});