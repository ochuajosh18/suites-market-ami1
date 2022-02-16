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
import SymphonyNewPassword from './SymphonyNewPassword';
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
            <MemoryRouter initialEntries={['/NewPassword/test']}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/newpassword" component={SymphonyNewPassword} />
                </Switch>
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}


jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(() => ({
        user: {
            firstName: 'test',
            lastName: 'test',
            email: 'test@test.com'
        },
        forgotPasswordId: 'test',
    }))
}))

describe('Symphony Forgot Password', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to change password with validations', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234' }});
        
        const { newPassword, confirmPassword, newPasswordStrengthValid } = store.getState().login;
        expect({ newPassword, confirmPassword, newPasswordStrengthValid }).toEqual({ newPassword: 'Pass1234', confirmPassword: 'Pass1234', newPasswordStrengthValid: true });

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(true);
    });

    it('Should not be able to change password with New and Confirm not equal', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass12345' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });

    it('Should not be able to change password with New Password length < 8', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pas1234' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pas1234' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });

    it('Should not be able to change password with New Password length > 36', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass123445677890testuseronetwothreefourfivethirtysix' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass123445677890testuseronetwothreefourfivethirtysix' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });

    it('Should not be able to change password with New Password without a number', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Password' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Password' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });

    it('Should not be able to change password with New Password without an uppercase character', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'password' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'password' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });

    it('Should not be able to change password with New Password without a lowercase character', () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'PASSWORD' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'PASSWORD' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });

    it("Should not be able to change password with a New Password that contains user's first or last name ", () => {
        store = createTestStore();
        const wrapper = setup(store);
        
        wrapper.find('#symphony-newpassword-password-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234test' }});
        wrapper.find('#symphony-newpassword-confirmpassword-input').at(0).find('input').at(0).simulate('change', { target: { value: 'Pass1234test' }});

        wrapper.find('#symphony-newpassword-submit-button').at(0).find('button').at(0).simulate('click');
        expect(store.getState().login.newPasswordLoading).toBe(false);
    });
});