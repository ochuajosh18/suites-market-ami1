import React from 'react';
import jwt from 'jsonwebtoken';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { LoginState } from '../../store/login/types';
import { SystemState } from '../../store/system/types';
import { authenticate } from '../../store/login/actions';
import { setSystemState } from '../../store/system/actions';

import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

import { toastWarning, toastError } from '../../modules/Toast';

interface SymphonyTokenLoginProps {
    login: LoginState;
    system: SystemState;
    authenticate: typeof authenticate;
    setSystemState: typeof setSystemState;
}

class SymphonyTokenLogin extends React.Component<SymphonyTokenLoginProps> {
    componentDidMount = () => {
        const url = window.location.href;
        const token = url.substring(url.lastIndexOf('/') + 1);
        this._verifyToken(token);
    }

    _verifyToken = (token: string) => {
        try {
            const AUTOMATIC_LOGIN_TOKEN = process.env.REACT_APP_MARKET_WEB_AUTOMATIC_LOGIN_TOKEN ? process.env.REACT_APP_MARKET_WEB_AUTOMATIC_LOGIN_TOKEN : '';
            const decoded = jwt.verify(token, AUTOMATIC_LOGIN_TOKEN);
            if (decoded) {
                const { username, password } = decoded;
                this.props.authenticate(username, password, false);
            }
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
    }

    render () {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" width="100%">
                <CircularProgress size={50} style={{ color: '#000' }} />
            </Box>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        login: state.login,
        system: state.system
    }
}

export default connect(mapStateToProps, {
    authenticate,
    setSystemState
})(SymphonyTokenLogin)