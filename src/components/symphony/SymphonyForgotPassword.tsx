import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { setSystemState } from '../../store/system/actions';
import { LoginState } from '../../store/login/types';
import { setLoginState, forgotPassword } from '../../store/login/actions';
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

interface SymphonyForgotPasswordProps {
    forgotPassword: typeof forgotPassword;
    setLoginState: typeof setLoginState;
    setSystemState: typeof setSystemState;
    login: LoginState;
    system: SystemState;
}

class SymphonyForgotPassword extends React.Component<SymphonyForgotPasswordProps> {

    componentDidMount = () => {
        this.props.setSystemState({ shallRedirect: false, redirectTo: '' });
    }

    _onLoginInput = (field: string, payload: string) => {
        this.props.setLoginState({ [field]: payload });
    }

    _onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this._onForgotPasswordClick();
        }
    }

    _onForgotPasswordClick = () => {
        const { email } = this.props.login;
        if (email && this._validate()) {
            // forgot pass
            this.props.forgotPassword(email);
        }
    }

    _validate = (): boolean => {
        const { email } = this.props.login;
        //eslint-disable-next-line
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email && !emailRegex.test(email)) { toastWarning('Please input a valid email address'); return false }
        return true;
    }

    _onRememberPassword = () => {
        this.props.setSystemState({ shallRedirect: true, redirectTo: '/login' });
    }

    render() {
        const { email, forgotPasswordLoading, forgotPasswordSuccess } = this.props.login;
        return (
            <SymphonyLoginContainer>
                <SymphonyLoginLogoContainer>
                    <img alt="" src={Logo}/>
                </SymphonyLoginLogoContainer>
                <SymphonyLoginFormContainer>
                    {forgotPasswordSuccess ? 
                        <>
                            <SymphonyLoginWelcomeText style={{ marginBottom: 8 }} >
                                Check Your Email
                            </SymphonyLoginWelcomeText>
                            <SymphonyLoginTextContainer textAlign="center" style={{ marginTop: 8, marginBottom: 32 }}>
                                We have sent a password recover instructions to your email.
                            </SymphonyLoginTextContainer>
                            <SymphonyLoginButton
                                onClick={this._onRememberPassword.bind(this)}
                                style={{ marginTop: 20 }}
                            >
                                Back to Login
                            </SymphonyLoginButton>
                        </>
                    :
                        <>
                            <SymphonyLoginFormInputContainer>
                                <SymphonyLoginWelcomeText>
                                    Forgot Password?
                                </SymphonyLoginWelcomeText>
                                <SymphonyInput
                                    id="symphony-forgotpassword-email-input"
                                    key="symphony-forgotpassword-email-input"
                                    type="text"
                                    label="Email Address"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        this._onLoginInput('email', e.target.value);
                                    }}
                                    onKeyDown={this._onEnterPress.bind(this)}
                                />
                            </SymphonyLoginFormInputContainer>
                            <SymphonyLoginButton
                                id="symphony-forgotpassword-submit-button"
                                disabled={!email}
                                onClick={this._onForgotPasswordClick.bind(this)}
                            >
                                {!forgotPasswordLoading ? 'Submit': 
                                    <CircularProgress size={20} style={{ color: '#FFF' }} />
                                }
                            </SymphonyLoginButton>
                            <SymphonyLoginTextContainer>
                                Remember your password? 
                                <SymphonyForgotPasswordButton
                                    id="symphony-rememberedpass-button"
                                    disableRipple={true}
                                    onClick={this._onRememberPassword.bind(this)}
                                >
                                    Back To Login
                                </SymphonyForgotPasswordButton>
                            </SymphonyLoginTextContainer>
                        </>
                    }
                </SymphonyLoginFormContainer>
                <ToastContainer />
            </SymphonyLoginContainer>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    login: state.login,
    system: state.system
});

export default connect(mapStateToProps, {
    forgotPassword,
    setLoginState,
    setSystemState
})(SymphonyForgotPassword);