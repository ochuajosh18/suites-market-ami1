import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { setSystemState } from '../../store/system/actions';
import { LoginState } from '../../store/login/types';
import { setLoginState, newPassword, getForgotPasswordId } from '../../store/login/actions';
import { toastError, toastWarning } from '../../modules/Toast';
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
    SymphonyLoginAdornedInputContainer,
    SymphonyLoginAdornmentContainer
} from './SymphonyLoginComponents';

// symphony
import SymphonyInput from './SymphonyInput';

// material
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// asset
import Logo from '../../assets/images/logos/symphony-logo-gold.png';

// util
import jwt from 'jsonwebtoken';

interface SymphonyNewPasswordProps {
    newPassword: typeof newPassword;
    getForgotPasswordId: typeof getForgotPasswordId;
    setLoginState: typeof setLoginState;
    setSystemState: typeof setSystemState;
    login: LoginState;
    system: SystemState;
}

const passRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
class SymphonyNewPassword extends React.Component<SymphonyNewPasswordProps> {

    componentDidMount = () => {
        this.props.setSystemState({ shallRedirect: false, redirectTo: '' });
        this._setToken();
    }

    _onLoginInput = (field: string, payload: string) => {
        this.props.setLoginState({ [field]: payload });
        if (field === 'newPassword') {
            this.props.setLoginState({ newPasswordStrengthValid: passRegex.test(payload) });
        }
    }

    _onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            this._onNewPasswordClick();
        }
    }

    _onNewPasswordClick = () => {
        const { newPassword, confirmPassword } = this.props.login;
        if (newPassword && confirmPassword && this._validate()) {
            // forgot pass
            this._verifyToken();
        }
    }

    _validate = (): boolean => {
        const { newPassword, confirmPassword, user } = this.props.login;
        if (newPassword.length < 8) { toastWarning('Password is too short'); return false }
        if (newPassword.length > 36) { toastWarning('Password is too long'); return false }
        if (user && (newPassword.toLowerCase().indexOf(user.firstName.toLowerCase()) > -1 || newPassword.toLowerCase().indexOf(user.lastName.toLowerCase()) > -1)) { 
            toastWarning('You cannot use your first name and/or last name as password'); return false 
        }
        if (newPassword !== confirmPassword) { toastWarning('Your password and the confirmed password do not match'); return false }
        if (!passRegex.test(newPassword)) { toastWarning('Invalid password. Please use a password with one lowercase, one uppercase, and one number'); return false }
        return true;
    }

    _onGoBack = () => {
        this.props.setSystemState({ shallRedirect: true, redirectTo: '/login' });
    }

    _verifyToken = () => {
        let secretKey = process.env.REACT_APP_NEW_PASSWORD_KEY;
        let url = window.location.href;
        let token = url.substring(url.lastIndexOf('/') + 1);
        const { newPassword, confirmPassword } = this.props.login;
        try {
            let decoded = jwt.verify(token, secretKey);
            const { user } = decoded;
            if (decoded.name === 'JsonWebTokenError') {
                toastError('JSON Web Token Error')
            } else {
                this.props.newPassword(
                    user.id,
                    newPassword,
                    confirmPassword,
                    token,
                );
            }
        } catch (e) {
            if (e.message === 'jwt expired') {
                toastError('Token Expired. Request for a new reset password');
            }
        }
    };

    _setToken = () => {
        let secretKey = process.env.REACT_APP_NEW_PASSWORD_KEY;
        let url = window.location.href;
        let token = url.substring(url.lastIndexOf('/') + 1);
        if (token === 'NewPassword') {
            token = '';
        }
        try {
            const decoded = jwt.verify(token, secretKey);
            const { user } = decoded;
            this.props.setLoginState({ user });
            this.props.getForgotPasswordId(user.id, token);
        } catch (e) {
            if (e.message === 'jwt must be provided') {
                this.props.setSystemState({ shallRedirect: true, redirectTo: '/login' });
                toastWarning('JWT must be provided')
            } else if (e.message === 'jwt malformed') {
                this.props.setSystemState({ shallRedirect: true, redirectTo: '/login' });
                toastError('JWT is malformed. Please contact your administrator')
            }
            else {
                this.props.setSystemState({ shallRedirect: true, redirectTo: '/login' });
                toastError('Invalid token receieved. Redirecting to login page')
            }
        }
    };

    render() {
        const { newPassword, confirmPassword, newPasswordSuccess, newPasswordLoading, newPasswordStrengthValid } = this.props.login;
        return (
            <SymphonyLoginContainer>
                <SymphonyLoginLogoContainer>
                    <img alt="" src={Logo}/>
                </SymphonyLoginLogoContainer>
                <SymphonyLoginFormContainer>
                    {newPasswordSuccess ? 
                        <>
                            <SymphonyLoginWelcomeText style={{ marginBottom: 8 }} >
                                Your Password Has Been Changed
                            </SymphonyLoginWelcomeText>
                            <SymphonyLoginTextContainer textAlign="center" style={{ marginTop: 8, marginBottom: 32 }}>
                                You can now login with your new password
                            </SymphonyLoginTextContainer>
                            <SymphonyLoginButton
                                onClick={this._onGoBack.bind(this)}
                                style={{ marginTop: 20 }}
                            >
                                Back to Login
                            </SymphonyLoginButton>
                        </>
                    :
                        <>
                            <SymphonyLoginFormInputContainer>
                                <SymphonyLoginWelcomeText>
                                    Reset Password
                                </SymphonyLoginWelcomeText>
                                <SymphonyLoginAdornedInputContainer>
                                    <SymphonyInput
                                        id="symphony-newpassword-password-input"
                                        key="symphony-newpassword-password-input"
                                        type="password"
                                        label="New Password"
                                        value={newPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            this._onLoginInput('newPassword', e.target.value);
                                        }}
                                        onKeyDown={this._onEnterPress.bind(this)}
                                    />
                                    {newPasswordStrengthValid &&
                                        <SymphonyLoginAdornmentContainer>
                                            <CheckCircleIcon htmlColor="#4BB543" />
                                        </SymphonyLoginAdornmentContainer>
                                    }
                                </SymphonyLoginAdornedInputContainer>
                                <SymphonyInput
                                    id="symphony-newpassword-confirmpassword-input"
                                    key="symphony-newpassword-confirmpassword-input"
                                    type="password"
                                    label="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        this._onLoginInput('confirmPassword', e.target.value);
                                    }}
                                    onKeyDown={this._onEnterPress.bind(this)}
                                />
                            </SymphonyLoginFormInputContainer>
                            <SymphonyLoginButton
                                id="symphony-newpassword-submit-button"
                                disabled={!newPassword || !confirmPassword}
                                onClick={this._onNewPasswordClick.bind(this)}
                            >
                                {!newPasswordLoading ? 'Submit': 
                                    <CircularProgress size={20} style={{ color: '#FFF' }} />
                                }
                            </SymphonyLoginButton>
                            <SymphonyLoginTextContainer textAlign="center" style={{ marginTop: 32, flexDirection: 'column' }}>
                                Password must contain the following:
                                <ul>
                                    <li>Minimum of 8 characters</li>
                                    <li>Maximum of 36 characters</li>
                                    <li>At least one uppercase and lowercase</li>
                                    <li>At least one number</li>
                                    <li>Must not contain user's first or last name</li>
                                </ul>
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
    newPassword,
    getForgotPasswordId,
    setLoginState,
    setSystemState
})(SymphonyNewPassword);