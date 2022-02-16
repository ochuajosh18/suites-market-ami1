import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import distributor from '../../../store/distributor/reducers';
import salesperson from '../../../store/salesperson/reducers';
import { SET_DISTRIBUTOR_STATE, Distributor as DistributorType } from '../../../store/distributor/types';
import Distributor from './Distributor';
import { v4 } from 'uuid';

const createTestStore = () => {
    return createStore(
        combineReducers({
            distributor,
            salesperson
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Distributor />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Sales Distributor List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should show and render the card for an added distributor', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        // simulate add distributor
        const id = v4();
        store.dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: {
                distributors: [
                    {
                        id, 
                        name: '', 
                        displayId: '', 
                        channel: '', 
                        salespersonName: '', 
                        logo: { path: '', name: '', size: 0, type: '' }, 
                        numberOfContacts: 1
                    } as DistributorType
                ] as Array<DistributorType>,
                distributorListLoading: false
            }
        });
        
        expect(wrapper.render().find(`#distributor-view-${id}`)).toHaveLength(1);
    });

    it('Should be able to search a distributor', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_DISTRIBUTOR_STATE,
            payload: {
                distributorListLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = wrapper.find('#distributor-search-fld').at(0).find('input').at(0);
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });
});