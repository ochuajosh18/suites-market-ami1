import React from 'react';
import { mount } from 'enzyme';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import salesreport from '../../../store/salesreport/reducers';
import Report from './Report';

const createTestStore = () => {
    return createStore(
        combineReducers({
            salesreport
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Report />
        </Provider>
    )
    return wrapper;
}


describe('Sales Report', () => {
    let store: ReturnType<typeof createTestStore>;
    
    it('renders the router and the report snapshot', () => {
        store = createTestStore();
        const wrapper = setup(store);
        expect(wrapper.render().html()).toMatchSnapshot()
    });

    it('renders the canvas for the reports', () => {
        store = createTestStore();
        const wrapper = setup(store);

        expect(wrapper.find('#call-visit-summary-report-container')).not.toHaveLength(0);
        expect(wrapper.find('#top-selling-products-report-container')).not.toHaveLength(0);
        expect(wrapper.find('#total-sales-report-container')).not.toHaveLength(0);
        expect(wrapper.find('#call-visit-per-salesperson-report-container')).not.toHaveLength(0);
    });
});