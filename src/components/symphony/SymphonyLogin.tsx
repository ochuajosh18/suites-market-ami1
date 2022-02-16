import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { setSystemState } from '../../store/system/actions';
import { LoginState } from '../../store/login/types';
import { setLoginState, authenticate,resetLoginState, basicLogin } from '../../store/login/actions';
import { toastWarning } from '../../modules/Toast';
import { ToastContainer } from 'react-toastify';

// local
import {
    SymphonyLoginContainer,
    SymphonyLoginLogoContainer,
    SymphonyLoginFormContainer,
    SymphonyLoginFormInputContainer,
    SymphonyLoginWelcomeText,
    SymphonyLoginButton,
    SymphonyLoginTextContainer,
    SymphonyForgotPasswordButton
} from './SymphonyLoginComponents';

// symphony
import SymphonyInput from './SymphonyInput';

// material
import CircularProgress from '@material-ui/core/CircularProgress';

// asset
import Logo from '../../assets/images/logos/symphony-logo-gold.png';

interface SymphonyLoginProps {
    authenticate: typeof authenticate;
    basicLogin: typeof basicLogin;
    resetLoginState: typeof resetLoginState;
    setLoginState: typeof setLoginState;
    setSystemState: typeof setSystemState;
    login: LoginState;
    system: SystemState;
}

class SymphonyLogin extends React.Component<SymphonyLoginProps> {

    componentDidMount = () => {
        this.props.setSystemState({ shallRedirect: false, redirectTo: '' });
        if (!this.props.login.isLoggedIn) {
            this.props.resetLoginState()
        }
    }

    _onLoginInput = (field: string, payload: string) => {
        this.props.setLoginState({ [field]: payload });
    }

    _onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this._onLoginClick();
        }
    }

    _onLoginClick = () => {
        const { email, password, platform } = this.props.login;
        if (email && password && this._validate()) {
            // login
            switch (platform) {
                case 'Symphony Market': return this.props.authenticate(email, password, false);
                case 'Symphony Sales': return this.props.basicLogin(email, password, false);
                default:
            }
        }
    }

    _validate = (): boolean => {
        const { email, password } = this.props.login;
        //eslint-disable-next-line
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email) { toastWarning('Missing email address'); return false }
        if (email && !emailRegex.test(email)) { toastWarning('Invalid credentials'); return false }
        if (!password) { toastWarning('Missing password'); return false }
        if (password && password.length < 8) { toastWarning('Invalid password'); return false }
        return true;
    }

    _onForgotPasswordClick = () => {
        this.props.setSystemState({ shallRedirect: true, redirectTo: '/forgotpassword' });
    }

    render() {
        const { platform, email, password, loginLoading, isLoggedIn } = this.props.login;
        return (
            <SymphonyLoginContainer>
                {isLoggedIn ? <Redirect to="/home" />  :
                    <>
                        <SymphonyLoginLogoContainer>
                            <img alt="" src={Logo}/>
                        </SymphonyLoginLogoContainer>
                        <SymphonyLoginFormContainer>
                            <SymphonyLoginFormInputContainer>
                                <SymphonyLoginWelcomeText>
                                    Welcome Back
                                </SymphonyLoginWelcomeText>
                                <SymphonyInput
                                    id="symphony-login-platform-select"
                                    key="symphony-login-platform-select"
                                    type="select"
                                    label="Platform"
                                    value={platform}
                                    selectOptions={[
                                        { label: 'Symphony Sales', value: 'Symphony Sales' }, 
                                        { label: 'Symphony Market', value: 'Symphony Market' }, 
                                    ]}
                                    selectOnchange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                        this._onLoginInput('platform', e.target.value as string)
                                    }}
                                />
                                <SymphonyInput
                                    id="symphony-login-email-input"
                                    key="symphony-login-email-input"
                                    type="text"
                                    label="Email Address"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        this._onLoginInput('email', e.target.value);
                                    }}
                                    onKeyDown={this._onEnterPress.bind(this)}
                                />
                                <SymphonyInput
                                    id="symphony-login-password-input"
                                    key="symphony-login-password-input"
                                    type="password"
                                    label="Password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        this._onLoginInput('password', e.target.value);
                                    }}
                                    onKeyDown={this._onEnterPress.bind(this)}
                                />
                            </SymphonyLoginFormInputContainer>
                            <SymphonyLoginButton
                                id="symphony-login-button"
                                disabled={!email || !password}
                                onClick={this._onLoginClick.bind(this)}
                            >
                                {!loginLoading ? 'Login': 
                                    <CircularProgress size={20} style={{ color: '#FFF' }} />
                                }
                            </SymphonyLoginButton>
                            <SymphonyLoginTextContainer>
                                Forgot your password? 
                                <SymphonyForgotPasswordButton
                                    id="symphony-forgetpassword-button"
                                    disableRipple={true}
                                    onClick={this._onForgotPasswordClick.bind(this)}
                                >
                                    Reset Password
                                </SymphonyForgotPasswordButton>
                            </SymphonyLoginTextContainer>
                        </SymphonyLoginFormContainer>
                        <ToastContainer />
                    </>
                }
            </SymphonyLoginContainer>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    login: state.login,
    system: state.system
});

export default connect(mapStateToProps, {
    authenticate,
    basicLogin,
    resetLoginState,
    setLoginState,
    setSystemState
})(SymphonyLogin);