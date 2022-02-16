import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import salespersonReducer from '../../../store/salesperson/reducers';
import system from '../../../store/system/reducers';
import { DynamicSalesSalespersonInput, SET_SALESPERSON_STATE } from '../../../store/salesperson/types';
import SalespersonView from './SalespersonView';

const createTestStore = () => {
    return createStore(
        combineReducers({
            salesperson: salespersonReducer,
            system
        }),
        applyMiddleware(thunk)
    );
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
        name: 'firstName',
        title: 'First Name',
        row: 0,
        type: 'Input Text',
        section: 'mock'
    },
    {
        name: 'lastName',
        title: 'Last Name',
        row: 0,
        type: 'Input Text',
        section: 'mock'
    },
];

const setup = (store: ReturnType<typeof createTestStore>, newSalesperson = false) => {
    let wrapper = mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={newSalesperson ? ['/sales/salesperson/new'] : ['/sales/salesperson/TEST']}>
                <Route path="/sales/salesperson/:salespersonId" component={SalespersonView} />
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

const setupForCrud = (type: 'add' | 'update', wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    store.dispatch({
        type: SET_SALESPERSON_STATE,
        payload: {
            salespersonDetailLoading: false,
            fields: mockedFields,
            sections: ['mock']
        }
    });
    
    const simulateInputChange = () => {
        wrapper.update();
        wrapper.find('input').forEach((node) => {
            const { id, type} = node.props();
            if (id) {
                if (type === 'text' || type === 'password') {
                    if (id.toLowerCase().indexOf('number') > -1) {
                        node.simulate('change', { target: { value: '09999999999' }}).simulate('blur');
                    }
                    else {
                        node.simulate('change', { target: { value: 'Test1234' }});
                    }

                }
                
            }
        });
    }

    store.dispatch({
        type: SET_SALESPERSON_STATE,
        payload: {
            salespersonDetailLoading: false,
            activeSalespersonDetail: {
                id: type === 'add' ? '' : 'TEST',
                contactNumber: {
                    primary: '',
                    secondary: '',
                    other: []
                },
            },
            fields: mockedFields,
            sections: ['mock']
        }
    });
    wrapper.update();
    wrapper.find('#salesperson-add-other-contact-btn').at(0).simulate('click');
    simulateInputChange();
}

describe('Salesperson CRUD', () => {
    let store: ReturnType<typeof createTestStore>;
    let assert: { [name: string]: DynamicSalesSalespersonInput } = {
        firstName: 'Test1234',
        lastName: 'Test1234',
        password: 'Test1234',
        confirmedPassword: 'Test1234',
        contactNumber: {
            primary: '09999999999',
            secondary: '09999999999',
            other: ['09999999999']
        }
    };

    it('Should be able to add a salesperson with validations along with module fields', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForCrud('add', wrapper, store);
        
        const { firstName, lastName, contactNumber, password, confirmedPassword } = store.getState().salesperson.activeSalespersonDetail!;
        const toCompare = JSON.stringify({ firstName, lastName, password, confirmedPassword, contactNumber });
        expect(toCompare).toEqual(JSON.stringify(assert));

        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                activeSalespersonDetail: { ...store.getState().salesperson.activeSalespersonDetail, avatar: { path: 'test.png', type: 'image/png' }}
            }
        });
        wrapper.update();

        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

    it('Should be able to view and update a salesperson with validations along with module fields', () => {
        store = createTestStore();
        const wrapper = setup(store);
        setupForCrud('update', wrapper, store);
        
        const { firstName, lastName, contactNumber } = store.getState().salesperson.activeSalespersonDetail!;
        const toCompare = JSON.stringify({ firstName, lastName, contactNumber });
        delete assert.password;
        delete assert.confirmedPassword;
        expect(toCompare).toEqual(JSON.stringify({ ...assert, contactNumber: { ...assert.contactNumber as typeof contactNumber, other: [] }}));

        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                activeSalespersonDetail: { ...store.getState().salesperson.activeSalespersonDetail, avatar: { path: 'test.png', type: 'image/png' }}
            }
        });
        wrapper.update();

        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

    it ('Should be able to delete a salesperson', () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                salespersonDetailLoading: false
            }
        });
        setupForCrud('update', wrapper, store);

        // click aux button at the right side of the header
        const AuxButton = wrapper.find('#sales-aux-button').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#salesperson-delete-btn").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true);
    })
});