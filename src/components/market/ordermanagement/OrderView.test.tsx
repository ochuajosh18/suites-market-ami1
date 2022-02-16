import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import ordermanagement from '../../../store/ordermanagement/reducers';
import system from '../../../store/system/reducers';
import login from '../../../store/system/reducers';
import { Order as OrderType, SET_ORDER_MANAGEMENT_STATE, } from '../../../store/ordermanagement/types';
import OrderView from './OrderView';

console.warn = jest.fn();

const createTestStore = () => {
    return createStore(
        combineReducers({
            ordermanagement,
            system,
            login
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router initialEntries={['/market/order/0000001']}>
                <Switch>
                    <Route exact={true} path="/market/order/:orderId" component={OrderView} />
                </Switch>
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Market Order View', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should show the view only inputs for order', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                activeOrder: { 
                    id: '0000001',
                    orderNumber: '',
                    dateCreated: '',
                    dateUpdated: '',
                    customerEmail: '',
                    items: [],
                    paymentMethod: '',
                    status: 'CANCELLED',
                    vendorId: 'test',
                    totalAmount: 1000,
                    history: [
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order created by market customer."
                        },
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order is unpaid. Order will be automatically cancelled after 5 minutes when not paid."
                        },
                        {
                          "date": "2021-06-24 01:47:12.141+00:00",
                          "status": "PAID",
                          "update": "Order is paid with Credit Card."
                        },
                        {
                          "date": "2021-07-07 08:10:26.193+00:00",
                          "status": "PENDING",
                          "update": "Order is pending for preparation for shipment."
                        },
                        {
                          "date": "2021-07-07 08:46:22.577+00:00",
                          "status": "CANCELLED",
                          "update": "Order is cancelled by John Mobishi. The stocks are now available for another order."
                        }
                      ]
                } as OrderType,
                activeOrderLoading: false
            }
        });
        wrapper.update();
        let dInput = 0;
        wrapper.find('input').forEach((n) => {
            const { disabled } = n.props();
            if (disabled) {
                dInput += 1;
            }
        })
        expect(dInput).toBeGreaterThan(0);
    });

    it('Should render the item list', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                activeOrder: { 
                    id: '0000001',
                    orderNumber: '',
                    dateCreated: '',
                    dateUpdated: '',
                    customerEmail: '',
                    items: [],
                    paymentMethod: '',
                    status: 'CANCELLED',
                    vendorId: 'test',
                    totalAmount: 1000,
                    history: [
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order created by market customer."
                        },
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order is unpaid. Order will be automatically cancelled after 5 minutes when not paid."
                        },
                        {
                          "date": "2021-06-24 01:47:12.141+00:00",
                          "status": "PAID",
                          "update": "Order is paid with Credit Card."
                        },
                        {
                          "date": "2021-07-07 08:10:26.193+00:00",
                          "status": "PENDING",
                          "update": "Order is pending for preparation for shipment."
                        },
                        {
                          "date": "2021-07-07 08:46:22.577+00:00",
                          "status": "CANCELLED",
                          "update": "Order is cancelled by John Mobishi. The stocks are now available for another order."
                        }
                      ]
                } as OrderType,
                activeOrderLoading: false
            }
        });
        wrapper.update();
        let dInput = 0;
        wrapper.find('input').forEach((n) => {
            const { disabled } = n.props();
            if (disabled) {
                dInput += 1;
            }
        })
        expect(dInput).toBeGreaterThan(0);
    });

    it('Should be able to update the status', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                activeOrder: { 
                    id: '0000001',
                    orderNumber: '',
                    dateCreated: '',
                    dateUpdated: '',
                    customerEmail: '',
                    items: [],
                    paymentMethod: '',
                    status: 'PENDING',
                    vendorId: 'test',
                    totalAmount: 1000,
                    history: [
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order created by market customer."
                        },
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order is unpaid. Order will be automatically cancelled after 5 minutes when not paid."
                        },
                        {
                          "date": "2021-06-24 01:47:12.141+00:00",
                          "status": "PAID",
                          "update": "Order is paid with Credit Card."
                        },
                        {
                          "date": "2021-07-07 08:10:26.193+00:00",
                          "status": "PENDING",
                          "update": "Order is pending for preparation for shipment."
                        }
                      ]
                } as OrderType,
                activeOrderLoading: false
            }
        });
        wrapper.update();
        // @ts-ignore
        wrapper.find('#order-0000001-status-update-select').at(0).props().onChange!({ target: { value: 'READY_TO_SHIP' }});
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });

    it('Should be able to display history', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_ORDER_MANAGEMENT_STATE,
            payload: {
                activeOrder: { 
                    id: '0000001',
                    orderNumber: '',
                    dateCreated: '',
                    dateUpdated: '',
                    customerEmail: '',
                    items: [],
                    paymentMethod: '',
                    status: 'PENDING',
                    vendorId: 'test',
                    totalAmount: 1000,
                    history: [
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order created by market customer."
                        },
                        {
                          "date": "2021-06-24 01:46:39.256+00:00",
                          "status": "UNPAID",
                          "update": "Order is unpaid. Order will be automatically cancelled after 5 minutes when not paid."
                        },
                        {
                          "date": "2021-06-24 01:47:12.141+00:00",
                          "status": "PAID",
                          "update": "Order is paid with Credit Card."
                        },
                        {
                          "date": "2021-07-07 08:10:26.193+00:00",
                          "status": "PENDING",
                          "update": "Order is pending for preparation for shipment."
                        }
                      ]
                } as OrderType,
                activeOrderLoading: false
            }
        });
        wrapper.update();
        // @ts-ignore
       
        expect(wrapper.find('.order-update-item')).not.toHaveLength(0);
    });
});