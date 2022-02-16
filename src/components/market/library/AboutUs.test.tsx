import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import libraryReducer from '../../../store/library/reducers';
import systemReducer from '../../../store/system/reducers';
import { SET_LIBRARY_STATE } from '../../../store/library/types';
import AboutUs from './AboutUs';

const createTestStore = () => {
    return createStore(
        combineReducers({
            library: libraryReducer,
            system: systemReducer
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <Router>
                <AboutUs />
            </Router>
        </Provider>
    )
    return wrapper;
}

describe('About Us UI', () => {
    let store: ReturnType<typeof createTestStore>;

    it('It should be able to render about us header', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
    
        expect(Header.render().find(`#aboutus-header-title`)).toHaveLength(1);
    });

    it('It should be able to render save button', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
    
        expect(Header.render().find(`#aboutus-save-btn`)).toHaveLength(1);
    });

    it('It should be able to render sub header', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                aboutUsLoading: false
            }
        })

        expect(wrapper.render().find(`#aboutus-sub-header`)).toHaveLength(1);
    });

    it('It should be able to render image input', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                aboutUsLoading: false
            }
        })

        expect(wrapper.render().find(`#media-add-image`)).toHaveLength(1);
    });

    it('It should be able to render description input', () => {
        store = createTestStore();
        const wrapper = setup(store);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                aboutUsLoading: false
            }
        })

        expect(wrapper.render().find(`.round-border2`)).toHaveLength(1);
    });
});

describe('About Us Update', () => {
    let store: ReturnType<typeof createTestStore>;
    it('It should be able to update about us with proper validations', () => {
        store = createTestStore();
        const wrapper = setup(store);
        const Header = mount(store.getState().system.header as JSX.Element);
        const SaveBtn = Header.find('#aboutus-save-btn').at(0);
        SaveBtn.simulate('click');
        
        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                aboutUsLoading: false
            }
        })

        expect(store.getState().system.systemDialogOpen).toBe(false);

        store.dispatch({
            type: SET_LIBRARY_STATE,
            payload: {
                image: { name: 'Test', size: 0, path: 'Testpath', type: 'image/png'},
                description: '<p>Test Description</p>'
            }
        })

        SaveBtn.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true);
    });
});

