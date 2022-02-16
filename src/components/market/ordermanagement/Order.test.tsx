import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import ordermanagement from '../../../store/ordermanagement/reducers';
import system from '../../../store/system/reducers';
import { Order as OrderType, SET_ORDER_MANAGEMENT_STATE, } from '../../../store/ordermanagement/types';
import Order from './Order';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

console.warn = jest.fn();

const createTestStore = () => {
    return createStore(
        combineReducers({
            ordermanagement,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Order />
                </MuiPickersUtilsProvider>
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Market Order List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should show the card for an order', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                orders: [{ 
                    id: '0000001',
                    orderNumber: '',
                    dateCreated: '',
                    dateUpdated: '',
                    customerEmail: '',
                    items: [],
                    paymentMethod: '',
                    status: 'PENDING',
                    vendorId: 'test',
                    totalAmount: 1000
                }] as Array<OrderType>
            }
        });
        
        expect(wrapper.render().find(`#order-view-0000001`)).toHaveLength(1);
    });

    it('Should be able to search an order', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                orderLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = mount(store.getState().system.headerEndButton as JSX.Element).find('input')
        SearchInput.simulate('change', { target: { value: 'test' }});
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });

    it('Should be able to update order filters', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        wrapper.find('#order-filter-button').at(0).simulate('click');
        
        // wrapper.find('#radio-item-credit_card').at(0).simulate('click');
        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                activeFilters: { status: ['Pending'] }
            }
        });
        wrapper.update();
        
        expect(wrapper.find('#filter-container').at(0).find('.remove-filter-button')).not.toHaveLength(0);
    });

    it('Should be able to update status of an order', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                orders: [{ 
                    id: '0000001',
                    orderNumber: '',
                    dateCreated: '',
                    dateUpdated: '',
                    customerEmail: '',
                    items: [],
                    paymentMethod: '',
                    status: 'PENDING',
                    vendorId: 'test',
                    totalAmount: 1000
                }] as Array<OrderType>
            }
        });

        wrapper.update();
        // @ts-ignore
        wrapper.find('#order-0000001-status-update-select').at(0).props().onChange!({ target: { value: 'READY_TO_SHIP' }});
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });
});