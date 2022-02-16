import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import ordermanagement from '../../../store/ordermanagement/reducers';
import system from '../../../store/system/reducers';
import { Order as OrderType, SET_ORDER_MANAGEMENT_STATE, } from '../../../store/ordermanagement/types';
import OrderView from './OrderView';

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
                    totalAmount: 1000
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
                    totalAmount: 1000
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

    // it('Should be able to update the status', async () => {
    //     store = createTestStore();
    //     const wrapper = setup(store);

    //     store.dispatch({
    //         type: SET_ORDER_MANAGEMENT_STATE,
    //         payload: {
    //             activeOrder: { 
    //                 id: '0000001',
    //                 orderNumber: '',
    //                 dateCreated: '',
    //                 dateUpdated: '',
    //                 customerEmail: '',
    //                 items: [],
    //                 paymentMethod: '',
    //                 status: 'PENDING',
    //                 vendorId: 'test',
    //                 totalAmount: 1000
    //             } as OrderType,
    //             activeOrderLoading: false
    //         }
    //     });
    //     wrapper.update();
    //     // @ts-ignore
    //     wrapper.find('#order-0000001-status-update-select').at(0).props().onChange!({ target: { value: 'READY_TO_SHIP' }});
    //     expect(store.getState().system.systemDialogOpen).toBe(true);
    // });
});