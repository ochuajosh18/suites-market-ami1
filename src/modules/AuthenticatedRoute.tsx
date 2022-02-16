import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AuthenticatedRoute = ({ userType, isLoggedIn, session, ...props }) => {
    return isLoggedIn && (userType === 'Basic' ? session !== null : true) ? <Route {...props} /> : <Redirect to="/login" />;
};

function mapStateToProps(state) {
    return {
        session: state.system.session,
        isLoggedIn: state.login.isLoggedIn,
        userType: state.system.userType
    };
}

export default connect(mapStateToProps)(AuthenticatedRoute);
