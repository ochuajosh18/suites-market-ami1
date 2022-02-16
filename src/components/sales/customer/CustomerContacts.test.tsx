import React from 'react';
import { mount, shallow } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import customer from '../../../store/customer/reducers';
import system from '../../../store/system/reducers';
import { SET_CUSTOMER_STATE, CustomerContact } from '../../../store/customer/types';
import CustomerContacts from './CustomerContacts';
import { v4 } from 'uuid';

const createTestStore = () => {
    return createStore(
        combineReducers({
            customer,
            system
        }),
        applyMiddleware(thunk)
    );
}


const mockedFields = [
    {
        name: 'name',
        title: 'Name',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'phoneNumber',
        title: 'Number',
        row: 0,
        type: 'Input Number',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'email',
        title: 'Email',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'position',
        title: 'Position',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
];


const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <CustomerContacts />
            </Router>
        </Provider>
    )
    return wrapper;
}
let store: ReturnType<typeof createTestStore>;

describe('Sales Customer Contact List', () => {

    it('Should show the card for an added customer contact', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        // simulate add customer
        const id = v4();
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                activeCustomer: 'test',
                activeContact: undefined,
                customerContacts: [
                    {
                        id, 
                        name: '', 
                        isPrimary: true,
                        email: '',
                        position: '',
                        phoneNumber: ''
                    } as CustomerContact
                ] as Array<CustomerContact>,
                customerContactLoading: false
            }
        });
        expect(wrapper.render().find(`#customer-contact-${id}`)).toHaveLength(1);
    });
    

    it('Should be able to delete a contact from the card list', () => {
        store = createTestStore();
        const wrapper = setup(store);

        const idOne = v4();
        const idTwo = v4();
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                activeCustomer: 'test',
                activeContact: undefined,
                customerContacts: [
                    {
                        id: idOne, 
                        name: '', 
                        isPrimary: false,
                        email: '',
                        position: '',
                        phoneNumber: ''
                    } as CustomerContact,
                    {
                        id: idTwo, 
                        name: '', 
                        isPrimary: true,
                        email: '',
                        position: '',
                        phoneNumber: ''
                    } as CustomerContact
                ] as Array<CustomerContact>,
                customerContactLoading: false
            }
        });
        wrapper.update();

        const AuxButton = wrapper.find(".card-aux").at(1);
        AuxButton.simulate('click');
        wrapper.update();
        const DeleteButton = wrapper.find(`#customer-contact-delete-${idOne}`).at(1);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });
});

describe('Sales Customer Contact View', () => {
    it('Shoule be able to add/update customer contact with module fields', () => {
        store = createTestStore();
        const wrapper = setup(store);

        // simulate add/edit customer
        const id = v4();
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                contactFields: mockedFields,
                contactSections: ['Test Section'],
                activeCustomer: 'test',
                activeContact: {
                    id, 
                    name: '', 
                    isPrimary: true,
                    email: '',
                    position: '',
                    phoneNumber: ''
                } as CustomerContact,
                customerContactLoading: false,
                customerViewActiveTab: 'Contact Information'
            }
        });

        wrapper.update();
        wrapper.find('input').forEach((node) => {
            if (node.props().type === 'text' && !node.props().disabled) {
                node.simulate('change', { target: { value: 'test' } }); // simulate typing to input
            }
            if (node.props().type === 'text' && node.props().id!.toLowerCase().indexOf('number') > -1) {
                node.simulate('change', { target: { value: '00000000' } }); // simulate typing to input
            }
        })
        wrapper.update();

        // expect state to change accordingly
        const comparator = {
            id,
            name: 'test',
            isPrimary: true,
            email: 'test',
            position: 'test',
            phoneNumber: '00000000'
        };

        expect(JSON.stringify(store.getState().customer.activeContact)).toBe(JSON.stringify(comparator));
    });

    it('Should be able to delete customer contact', () => {
        store = createTestStore();
        const wrapper = setup(store);

        // simulate add/edit customer
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                contactFields: mockedFields,
                contactSections: ['Test Section'],
                activeCustomer: { id: 'test' },
                activeContact: {
                    id: 'test',
                    name: '', 
                    isPrimary: false,
                    email: '',
                    position: '',
                    phoneNumber: ''
                } as CustomerContact,
                customerContactLoading: false,
                customerViewActiveTab: 'Contact Information'
            }
        });
        wrapper.update();

        const AuxButton = wrapper.find("#sales-aux-button").at(1);
        AuxButton.simulate('click');
        wrapper.update();
        const DeleteButton = wrapper.find(`#customer-contact-delete-test`).at(1);
        DeleteButton.simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(true);
    });
});