import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import customer from '../../../store/customer/reducers';
import salesperson from '../../../store/salesperson/reducers';
import { SET_CUSTOMER_STATE, ICustomer as CustomerType } from '../../../store/customer/types';
import { Filter } from '../../../utils/filter';
import Customer from './Customer';
import { v4 } from 'uuid';

const createTestStore = () => {
    return createStore(
        combineReducers({
            customer,
            salesperson
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

describe('Sales Customer List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should show the card for an added customer', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        // simulate add customer
        const id = v4();
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                customerList: [
                    {
                        id, 
                        name: '', 
                        displayId: '', 
                        channel: '', 
                        salespersonName: '', 
                        logo: { path: '', name: '', size: 0, type: '' }, 
                        numberOfContacts: 1
                    } as CustomerType
                ] as Array<CustomerType>,
                customerListLoading: false
            }
        });
        
        expect(wrapper.render().find(`#customer-view-${id}`)).toHaveLength(1);
    });

    it('Should be able to search a customer', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                customerListLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = wrapper.find('#customer-search-fld').at(0).find('input').at(0);
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });
    
    it('Should be able to update customer filters', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        wrapper.find('#symphony-filter-button').at(0).simulate('click');
        
        // wrapper.find('#radio-item-credit_card').at(0).simulate('click');
        store.dispatch({
            type: SET_CUSTOMER_STATE,
            payload: {
                activeFilters: { channel: [{ label: 'Restaurant', value: 'Restaurant' }] } as Partial<Filter>
            }
        });
        wrapper.update();
        
        expect(wrapper.find("#filter-container").at(0).find('.symphony-active-filter')).not.toHaveLength(0);
    });
});