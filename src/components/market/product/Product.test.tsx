import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { SET_MARKET_PRODUCT_STATE } from '../../../store/marketproduct/types';
import marketproduct from '../../../store/marketproduct/reducers';
import login from '../../../store/login/reducers';
import Product from './Product';
import { v4 } from 'uuid';

const createTestStore = () => {
    return createStore(
        combineReducers({
            marketproduct,
            login
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Product />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Market Product List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should show the card for an added product', async () => {
        store = createTestStore();
        const wrapper = setup(store); // your wrapped component by enzyme

        // simulate add product
        const id = v4(); // generate test id
        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                // @ts-ignore
                products: [{
                    id,
                    displayId: 'testdisplayid' as string,
                    varitiesCount: 1,
                    name: 'Test Product',
                    h1: '',
                    h2: '',
                    h3: '',
                }, ],
                activeTab: 'Active',
                productListLoading: false
            }
        });

        expect(wrapper.render().find(`#product-view-${id}`)).toHaveLength(1);
    });

    it('Should be able to change view tabs to active/inactive', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {

                productListLoading: false
            }
        });

        wrapper.update();
        // traverse to tab, and simulate a click
        const Tab = wrapper.find('#product-inactive-tab').at(1);
        Tab.simulate('click');
        
        expect(store.getState().marketproduct.activeTab).toBe('Inactive');
    });

    it('Should be able to search a product', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                productListLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = wrapper.find('#product-search-fld').at(0).find('input').at(0);
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });
});