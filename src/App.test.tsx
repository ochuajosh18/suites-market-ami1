import React from 'react';
import { mount } from 'enzyme';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import system from './store/system/reducers';
import login from './store/login/reducers';
import App from './App';

const createTestStore = () => {
    return createStore(
        combineReducers({
            login,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>) => {
    let wrapper = mount(
        <Provider store={store}>
            <App />
        </Provider>
    )
    return wrapper;
}

jest.mock('fg-loadcss', () => ({
    loadCSS: jest.fn()
}));

jest.mock('@react-google-maps/api', () => ({
    LoadScript: (props) => <div>{props.children}</div>,
}));

describe('App', () => {
    let store: ReturnType<typeof createTestStore>;
    
    it('Renders the router and the app snapshot', () => {
        store = createTestStore();
        const wrapper = setup(store);
        expect(wrapper.render().html()).toMatchSnapshot()
    });
});