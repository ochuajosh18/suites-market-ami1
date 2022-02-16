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
            <MemoryRouter initialEntries={['/forgotpassword']}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/forgotpassword" component={ForgotPassword} />
                </Switch>
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

describe('Symphony Forgot Password', () => {
    let store: ReturnType<typeof createTestStore>;
    
    it('Should be able to send email', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-forgotpassword-email-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testaccount@gmail.com' }});
        
        const { email } = store.getState().login;
        expect({ email }).toEqual({ email: 'testaccount@gmail.com' });

        wrapper.find('#symphony-forgotpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.forgotPasswordLoading).toBe(true);
    });

    it('Should be able to catch invalid email', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-forgotpassword-email-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testaccount' }});
        
        const { email } = store.getState().login;
        expect({ email }).toEqual({ email: 'testaccount' });

        wrapper.find('#symphony-forgotpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.forgotPasswordLoading).toBe(false);
    });
});