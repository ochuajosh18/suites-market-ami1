import React from 'react';
import thunk from 'redux-thunk'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import promobanner from '../../../store/promobanner/reducers';
import login from '../../../store/login/reducers';

import { SET_PROMO_BANNER_STATE } from '../../../store/promobanner/types';
import { SET_LOGIN_STATE } from '../../../store/login/types';

import PromoBanner from './PromoBanner';

const createTestStore = () => {
    return createStore(
        combineReducers({
            promobanner,
            login
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <PromoBanner />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('UI Skeleton Frame Promo Banner', () => {
    let store: ReturnType<typeof createTestStore>;
    it('It should change active tab to vendor page / home page', async () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Tab = wrapper.find(`#promobanner-vendorpage-tab`).at(1);
        Tab.simulate('click');

        expect(store.getState().promobanner.promoBannerTabs).toBe('Vendor Page');
    });

    it('It should render banner cards', async () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_PROMO_BANNER_STATE,
            payload: {
                banners: [
                    {
                        "bannerNumber": 1,
                        "category": [
                            {
                                "h1": "Gaming",
                                "h2": "Console gaming",
                                "h3": "Consoles"
                            },
                            {
                                "h1": "Gaming",
                                "h2": "Console gaming",
                                "h3": "Games"
                            }
                        ],
                        "endDate": "2021-03-16",
                        "image": "https://suitesmedia.eu-central-1.linodeobjects.com/Xbox-One.jpg",
                        "isActive": false,
                        "name": "XBOX ONE $",
                        "startDate": "2021-03-16"
                    }
                ],
                promoBannerLoading: false
            }
        });

        expect(wrapper.render().find(`#promobanner-bannercard-1`)).toHaveLength(1);
    });

    it('It should render banners cards on vendor search', async () => {
        store = createTestStore();
        const wrapper = setup(store);

        // Set UserType to admin to access the search input
        store.dispatch({
            type: SET_LOGIN_STATE,
            payload: {
                user: { 
                    ...store.getState().login.user,
                    userType: 'ADMIN'
                }
            }
        })

        // Set Dummy Vendors
        store.dispatch({
            type: SET_PROMO_BANNER_STATE,
            payload: {
                vendors: [
                    {
                        companyName: 'Test Company Name',
                        dateCreated: '04-26-2021',
                        email: 'test@yopmail.com',
                        firstName: 'Test First Name',
                        id: 'TEST::ID',
                        lastName: 'Test Last Name',
                        mobileNumber: '12345678',
                        role: 'VENDOR',
                        status: 'APPROVED',
                    }
                ],
                promoBannerLoading: false
            }
        })

        const VendorPageTab = wrapper.find(`#promobanner-vendorpage-tab`).at(1);
        VendorPageTab.simulate('click');

        const VendorSearchInput = wrapper.find('#promobanner-vendor-search-input').at(0).find('input').at(0);
        VendorSearchInput.simulate('change', { target: { value: 'Test Company Name' } }); // Simulate on change
        const VendorSearchInputValue = 'Test Company Name'; // manual update since this is an uncontrolled component

        wrapper.update();
        expect(store.getState().promobanner.vendors[0].companyName).toBe('Test Company Name');
    });
})
