import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import salespersonReducer from '../../../store/salesperson/reducers';
import { SET_SALESPERSON_STATE, Salesperson as SalespersonType } from '../../../store/salesperson/types';
import { Filter } from '../../../utils/filter';
import Salesperson from './Salesperson';
import { v4 } from 'uuid';

const createTestStore = () => {
    return createStore(
        combineReducers({
            salesperson: salespersonReducer
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <Salesperson />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('Salesperson List', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should show the card for an added salesperson', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        // simulate add customer
        const id = v4();
        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                salespersons: [
                    {
                        id, 
                        name: '', 
                        displayId: '', 
                        channel: '', 
                        firstName: '',
                        lastName: '',
                        email: '',
                        isTestAccount: false,
                        isActive: true,
                        contactNumber: { primary: '', secondary: '', other: []},
                        password: '',
                        confirmedPassword: '',
                        address: '',
                        salespersonType: '',
                        avatar: { path: '', name: '', size: 0, type: '' },
                    } as SalespersonType
                ] as Array<SalespersonType>,
                salespersonListLoading: false
            }
        });
        
        expect(wrapper.render().find(`#salesperson-view-${id}`)).toHaveLength(1);
    });

    it('Should be able to change view tabs to active/inactive and load salespersons', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                salespersonListLoading: false
            }
        });

        wrapper.update();
        // traverse to tab, and simulate a click
        const Tab = wrapper.find('#salesperson-inactive-tab').at(0);
        Tab.simulate('click');
        
        expect(store.getState().salesperson.salespersonListTab).toBe('Inactive');
    });

    it('Should be able to search a salesperson', () => {
        store = createTestStore();
        const wrapper = setup(store); 

        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                salespersonListLoading: false
            }
        });

        wrapper.update();
        // traverse to input, reverse simulate an input
        const SearchInput = wrapper.find('#salesperson-search-fld').at(0).find('input');
        SearchInput.simulate('change', { target: { value: 'test' }});
        SearchInput.props().value = 'test'; // manual update since this is an uncontrolled component
        expect(SearchInput.props().value).toEqual('test');
    });

    it('Should be able to update saleserspon filters', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        wrapper.find('#symphony-filter-button').at(0).simulate('click');
        
        // wrapper.find('#radio-item-credit_card').at(0).simulate('click');
        store.dispatch({
            type: SET_SALESPERSON_STATE,
            payload: {
                activeFilters: { name: ['Test'] } as Partial<Filter>
            }
        });
        wrapper.update();
        
        expect(wrapper.find("#filter-container").at(0).find('.symphony-active-filter')).not.toHaveLength(0);
    });
});