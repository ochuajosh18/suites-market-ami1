import React from 'react';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import promobanner from '../../../store/promobanner/reducers';
import login from '../../../store/login/reducers';
import system from '../../../store/system/reducers';
import { SET_PROMO_BANNER_STATE } from '../../../store/promobanner/types';

import PromoBannerView from './PromoBannerView';

const createTestStore = () => {
    return createStore(
        combineReducers({
            promobanner,
            login,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>, isNew = false) => {
    let wrapper = mount(
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <Provider store={store}>
                <MemoryRouter initialEntries={[`/market/promobanner/${isNew ? 'new' : '1'}`]}>
                    <Switch>
                        <Route path="/market/promobanner/:bannerNumber" component={PromoBannerView} />
                    </Switch>
                </MemoryRouter>
            </Provider>
        </MuiPickersUtilsProvider>
    )
    return wrapper;
}

describe('Promo Banner CRUD', () => {
    let store: ReturnType<typeof createTestStore>;
    it('It should be able to render promo banner fields', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_PROMO_BANNER_STATE,
            payload: {
                activePromoBanner: {
                    bannerName: 'Testing Name',
                    bannerType: 'Scheduled',
                    bannerStatus: true,
                    bannerStartDate: '10-27-1998',
                    bannerEndDate: '10-27-2001',
                    bannerIsNoExpiration: false,
                    bannerTitle: 'Testing Name',
                    bannerImage: { name: '', type: '', size: 0, path: '' },
                    bannerSelectedCategory: []
                }
            }
        })
        expect(wrapper.render().find(`#promobanner-crud-status-select`)).toHaveLength(1);
        expect(wrapper.render().find(`#promobanner-crud-startdate-datepicker`)).toHaveLength(1);
        expect(wrapper.render().find(`#promobanner-crud-enddate-datepicker`)).toHaveLength(1);
        expect(wrapper.render().find(`#promobanner-crud-noexpiration-checkbox`)).toHaveLength(1);
        expect(wrapper.render().find(`#promobanner-crud-title-input`)).toHaveLength(1); 
        expect(wrapper.render().find(`#promobanner-crud-selectedrow-btn`)).toHaveLength(1);  
        expect(wrapper.render().find(`#promobanner-changebanner-btn`)).toHaveLength(1);    
    })

    it('It should render the details of the banner', () => {
        store = createTestStore();
        const wrapper = setup(store);

        const activePromoBanner = {
            bannerName: 'Testing Name',
            bannerType: 'Scheduled',
            bannerStatus: true,
            bannerStartDate: '10-27-1998',
            bannerEndDate: '10-27-2001',
            bannerIsNoExpiration: false,
            bannerTitle: 'Testing Name',
            bannerImage: { name: '', type: '', size: 0, path: '' },
            bannerSelectedCategory: []
        }

        store.dispatch({
            type: SET_PROMO_BANNER_STATE,
            payload: {
                activePromoBanner
            }
        })

        expect(store.getState().promobanner.activePromoBanner).toEqual(activePromoBanner);
    })

    it('It should be able to add/update banners with proper validations', () => {
        store = createTestStore();
        const wrapper = setup(store, true);

        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(false); // Missing banner name, selected category and media do not allow saving

        const activePromoBanner = {
            bannerName: 'Testing Name',
            bannerType: 'Scheduled',
            bannerStatus: true,
            bannerStartDate: '10-27-1998',
            bannerEndDate: '10-27-2001',
            bannerIsNoExpiration: false,
            bannerTitle: 'Testing Name',
            bannerImage: { name: 'test.png', type: 'image/png', size: 0, path: '/test.png', file: 'test' },
            bannerSelectedCategory: [
                {
                    h1: 'test'
                }
            ]
        }

        store.dispatch({
            type: SET_PROMO_BANNER_STATE,
            payload: {
                activePromoBanner
            }
        })

        SaveBtn.find('button').at(0).simulate('click');
        expect(store.getState().system.systemDialogOpen).toBe(true); 
    })    

    it('Should be able to delete a banner', () => {
        store = createTestStore();
        const wrapper = setup(store);

        const activePromoBanner = {
            bannerName: 'Testing Name',
            bannerType: 'Scheduled',
            bannerStatus: true,
            bannerStartDate: '10-27-1998',
            bannerEndDate: '10-27-2001',
            bannerIsNoExpiration: false,
            bannerTitle: 'Testing Name',
            bannerImage: { name: 'test.png', type: 'image/png', size: 0, path: '/test.png', file: 'test' },
            bannerSelectedCategory: [
                {
                    h1: 'test'
                }
            ]
        }

        store.dispatch({
            type: SET_PROMO_BANNER_STATE,
            payload: {
                activePromoBanner,
                promoBannerLoading: false
            }
        })

        wrapper.update();

        const AuxButton = wrapper.find('#market-aux-button').at(0);
        AuxButton.simulate('click');
        wrapper.update();
        
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#promobanner-delete-btn").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true); 
    });
})