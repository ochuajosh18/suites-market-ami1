import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Logo from '../../assets/images/Suites-Logo.png';

import { AppBar, Toolbar, Box, Typography } from '@material-ui/core';

import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { LoginState } from '../../store/login/types';
import { resetLoginState, refreshToken } from '../../store/login/actions';
import { setInterceptor } from '../../store/system/actions';
import './Header.css';

interface HeaderProps {
    setInterceptor: typeof setInterceptor
    resetLoginState: typeof resetLoginState;
    refreshToken: typeof refreshToken;
    system: SystemState;
    login: LoginState;
    location: any;
    history: any;
}

class Header extends Component<HeaderProps> {

    _onClickLogout = () => {
        this.props.resetLoginState();
    };

    componentDidMount() {
        if (this.props.login.user && this.props.login.isLoggedIn) {
            // @ts-ignore
            const { handlers } = axios.interceptors.request;
            if (handlers.length === 0) {
                this.props.setInterceptor();
            }
        }

        // store expired
    }

    render() {
        const { headerText } = this.props.system;
        return (
            <Box>
                <AppBar position="sticky" className="header-appbar">
                <Toolbar style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <Box className="header-logo-container">
                            <img
                                src={Logo}
                                className="logo"
                                alt=""
                            />
                        </Box>
                        <Box className="header-right-container">
                            {(() => {
                                if (this.props.location.pathname === '/Home') {
                                    const fontSize = 25;
                                    return (
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="flex-end">
                                            <Box fontSize={fontSize}>
                                                Welcome
                                            </Box>
                                            <Box
                                                mx={1}
                                                fontSize={fontSize}
                                                fontWeight="bold">
                                                {`${this.props.login.user.firstName || ''} ${this.props.login.user.lastName || ''}`}
                                            </Box>
                                        </Box>
                                    );
                                } else {
                                    return (
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            alignItems="flex-end">
                                            <Typography
                                                className="mainText"
                                                variant="h4"
                                                color="textSecondary">
                                                {
                                                    headerText ? headerText.main : ''
                                                }
                                            </Typography>
                                            <Box mx={2}>
                                                <Typography variant="h6">
                                                    {
                                                        headerText ? headerText.sub : ''
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                }
                            })()}
                            {/* <Button
                                size="small"
                                className={`logoutText ${this.props.system.headerEndButton ? 'small-text' : ''}`}
                                onClick={this.props.system.headerEndButton as? this.props.system.headerEndButton.action.bind(this) : this._onClickLogout.bind(this)}>
                                {this.props.system.headerEndButton ?this.props.system.headerEndButton.title  : 'Logout'}
                            </Button> */}
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    system: state.system,
    login: state.login,
});

export default withRouter(
    connect(mapStateToProps, { resetLoginState, refreshToken, setInterceptor })(Header),
);
