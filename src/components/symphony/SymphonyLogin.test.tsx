import React from 'react';
import { mount } from 'enzyme';
import { config } from 'react-transition-group';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import login from '../../store/login/reducers';
import system from '../../store/system/reducers';
import Login from './SymphonyLogin';
import ForgotPassword from './SymphonyForgotPassword';
config.disabled = true;

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
            <MemoryRouter initialEntries={['/login']}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/forgotpassword" component={ForgotPassword} />
                </Switch>
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

describe('Symphony Login', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to login', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-login-email-input').at(0).find('input').at(0).simulate('change', { target: { value: 'johndoe@gmail.com' }});
        wrapper.find('#symphony-login-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234' }});
        
        const { email, password } = store.getState().login;
        expect({ email, password}).toEqual({ email: 'johndoe@gmail.com', password: 'Pass1234' });

        wrapper.find('#symphony-login-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.loginLoading).toBe(true);
    });

    it('Should be able to login using enter', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-login-email-input').at(0).find('input').at(0).simulate('change', { target: { value: 'johndoe@gmail.com' }});
        wrapper.find('#symphony-login-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234' }});
        
        const { email, password } = store.getState().login;
        expect({ email, password}).toEqual({ email: 'johndoe@gmail.com', password: 'Pass1234' });

        
        // simulate enter
        wrapper.find('#symphony-login-email-input').at(0).find('input').at(0).simulate('focus').simulate('keydown', { key: 'Enter' });
        expect(store.getState().login.loginLoading).toBe(true);
    });

    it('Should be able to catch missing username/password', () => {
        store = createTestStore();
        const wrapper = setup(store);

        wrapper.find('#symphony-login-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.loginLoading).toBe(false);
    });

    it('Should be able to catch invalid email', () => {
        store = createTestStore();
        const wrapper = setup(store);

        wrapper.find('#symphony-login-email-input').at(0).find('input').at(0).simulate('change', { target: { value: 'johndoe' }});
        wrapper.find('#symphony-login-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234' }});

        wrapper.find('#symphony-login-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.loginLoading).toBe(false);
    });

    it('Should be able to catch invalid password', () => {
        store = createTestStore();
        const wrapper = setup(store);

        wrapper.find('#symphony-login-email-input').at(0).find('input').at(0).simulate('change', { target: { value: 'johndoe@gmail.com' }});
        wrapper.find('#symphony-login-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass123' }});

        wrapper.find('#symphony-login-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.loginLoading).toBe(false);
    });

    it('Should be able to redirect to forget password page', () => {
        store = createTestStore();
        const wrapper = setup(store);

        wrapper.find('#symphony-forgetpassword-button').at(0).find('button').at(0).simulate('click');

        expect(store.getState().system.redirectTo).toBe('/forgotpassword');
    });
});