import React from 'react';
import { connect } from 'react-redux';
import { loadCSS } from 'fg-loadcss';
import Box from '@material-ui/core/Box';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';

import './App.css';

import { AppState } from './store';
import { refreshToken, resetLoginState, setLoginState } from './store/login/actions';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { LoadScript } from '@react-google-maps/api';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

import AuthenticatedRoute from './modules/AuthenticatedRoute';
import Home from './components/Home/Home';
// import OrderView from './components/Order/OrderView';
import ProductReview from './components/Review/ProductReview';
import ProductRating from './components/Review/ProductRating';
import UserManagement from './components/Administration/Administration';
import { setHeaderText } from './store/system/actions';
import SymphonyDrawer from './components/symphony/SymphonyDrawer';
import SymphonyHeader from './components/symphony/SymphonyHeader';

// Basic Components
import CallTypeSettings from './components/Basic/CallTypeSettings/CallTypeSettings';
import Promotion from './components/Basic/Promotion/Promotion';
import News from './components/Basic/News/News';
import Report from './components/sales/report/Report';
import AccessibilitySettings from './components/Basic/AccessibilitySettings/AccessibilitySettings';
import ApplicationSettings from './components/Basic/ApplicationSettings/ApplicationSettings';

// revamped
import SymphonyLogin from './components/symphony/SymphonyLogin';
import SymphonyForgotPassword from './components/symphony/SymphonyForgotPassword';
import SymphonyNewPassword from './components/symphony/SymphonyNewPassword';
import Role from './components/symphony/accessibility/Role';
import Fields from './components/symphony/fields/Fields';

// revamped market
import MarketProduct from './components/market/product/Product';
import MarketProductView from './components/market/product/ProductView';
import Category from './components/market/category/Category';
import PromoBanner from './components/market/promobanner/PromoBanner';
import PromoBannerView from './components/market/promobanner/PromoBannerView';
import Accessibility from './components/symphony/accessibility/Accessibility';
import Vendor from './components/market/usermanagement/Vendor';
import VendorView from './components/market/usermanagement/VendorView';
import Customer from './components/market/usermanagement/Customer';
import CustomerView from './components/market/usermanagement/CustomerView';
import AboutUs from './components/market/library/AboutUs';
import HelpDesk from './components/market/library/HelpDesk';
import Faqs from './components/market/library/Faq';
import UserAccount from './components/market/usermanagement/UserAccount';
import Order from './components/market/ordermanagement/Order';
import OrderView from './components/market/ordermanagement/OrderView';
import OrderHistory from './components/market/ordermanagement/OrderHistory';
// import Role from './components/market/usermanagement/Role';

// revamped sales
import SalesProduct from './components/sales/product/Product';
import SalesProductView from './components/sales/product/ProductView';
import SalesCustomer from './components/sales/customer/Customer';
import SalesCustomerView from './components/sales/customer/CustomerView';
import SalesSalesperson from './components/sales/salesperson/Salesperson';
import SalesSalespersonView from './components/sales/salesperson/SalespersonView';
import SalesOrder from './components/sales/ordermanagement/Order';
import SalesOrderView from './components/sales/ordermanagement/OrderView';
import Distributor from './components/sales/distributor/Distributor';
import DistributorView from './components/sales/distributor/DistributorView';

// Common Components
import SymphonySystemDialog from './components/symphony/SymphonySystemDialog';
// reducers and types
import { SystemState } from './store/system/types';
import { setSystemState, resetAxiosInterceptors } from './store/system/actions';

import { LoginState } from './store/login/types';
import SymphonyTokenLogin from './components/symphony/SymphonyTokenLogin';

import Geocode from 'react-geocode';
// constants
const GOOGLE_LIBRARIES = ['places'] as Libraries;
Geocode.setApiKey('AIzaSyB51sSAHDR8d73izjtJNCFMmZ6Zplqeqvw');
Geocode.setLanguage("en");
Geocode.setLocationType("ROOFTOP");

interface AppProps {
    setSystemState: typeof setSystemState;
    resetLoginState: typeof resetLoginState;
    setLoginState: typeof setLoginState;
    resetAxiosInterceptors: typeof resetAxiosInterceptors;
    login: LoginState;
    system: SystemState;
}

class App extends React.Component<AppProps> {
    node: Node = Object.create(HTMLElement.prototype, {})
    componentDidMount = () => {
        // Load Font Awesome
        this.node = loadCSS(
            'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
            document.querySelector('#font-awesome-css'),
        );
        const { user } = this.props.login;
        const missingUser = typeof user.firstName === 'undefined' && typeof user.lastName === 'undefined';
        if (typeof this.props.login.token.token === 'undefined' || missingUser) {
            this.props.resetLoginState()
        } 
        if (!missingUser && typeof this.props.login.token.token !== 'undefined' ) {
            this.props.resetAxiosInterceptors();
        }
    }

    componentWillUnmount = () => {
        this.node.parentNode!.removeChild(this.node);
    }

    _onHideSystemDialog = () => {
        this.props.setSystemState({ 
            systemDialogOpen: false
        });
    }

    render () {
        const { shallRedirect, redirectTo } = this.props.system;
        const { isLoggedIn } = this.props.login;
        return (
            <Box className="App" width={1}>
                <LoadScript
                    googleMapsApiKey="AIzaSyBdyauj-IAvCaOQSwlGF4LEoNVhCGZD_Rs"
                    libraries={GOOGLE_LIBRARIES}
                >
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Router>
                            {isLoggedIn && <SymphonyDrawer />}
                            {isLoggedIn && <SymphonyHeader />}
                            {shallRedirect && redirectTo && <Redirect to={redirectTo} />}
                            <Switch>
                                <Route path="/login" exact={true} component={SymphonyLogin} />
                                <Route path="/login/:token" component={SymphonyTokenLogin} />
                                {/* <Route path="/basic/login" component={BasicLogin} /> */}
                                <Route path="/forgotpassword" component={SymphonyForgotPassword} />
                                <Route path="/newpassword" component={SymphonyNewPassword} />
                                {/* Revamped Symphony */}
                                <AuthenticatedRoute path="/home" component={Home} />
                                <AuthenticatedRoute path="/fields" component={Fields} />
                                <AuthenticatedRoute exact={true} path="/symphony/roles" component={Role} />
                                <AuthenticatedRoute path="/symphony/roles/:roleId" component={Accessibility} />
                                {/* Revamped Market */}
                                <AuthenticatedRoute exact={true} path="/market/product" component={MarketProduct} />
                                <AuthenticatedRoute path="/market/product/:productId" component={MarketProductView} />
                                <AuthenticatedRoute path="/market/review" component={ProductReview} />
                                <AuthenticatedRoute path="/market/rating" component={ProductRating} />
                                <AuthenticatedRoute exact={true} path="/market/promobanner" component={PromoBanner} />
                                <AuthenticatedRoute path="/market/promobanner/:bannerNumber" component={PromoBannerView}/>
                                <AuthenticatedRoute exact={true} path="/market/order" component={Order} />
                                <AuthenticatedRoute path="/market/order/:orderId" component={OrderView} />
                                <AuthenticatedRoute key="orderhistory" path="/market/orderhistory" component={OrderHistory} />
                                <AuthenticatedRoute path="/market/category" component={Category} />
                                <AuthenticatedRoute path="/market/aboutus" component={AboutUs} />
                                <AuthenticatedRoute path="/market/faqs" component={Faqs} />
                                <AuthenticatedRoute path="/market/helpdesk" component={HelpDesk} />
                                <AuthenticatedRoute exact={true} path="/market/vendor" component={Vendor} />
                                <AuthenticatedRoute exact={true} path="/market/useraccount" component={UserAccount} />
                                <AuthenticatedRoute path="/market/vendor/:vendorId" component={VendorView} />
                                <AuthenticatedRoute exact={true} path="/market/customer" component={Customer} />
                                <AuthenticatedRoute exact={true} path="/market/customer/:customerId" component={CustomerView} />
                                <AuthenticatedRoute exact={true} path="/symphony/role" component={Role} />
                                {/* Revamped Sales */}
                                <AuthenticatedRoute exact={true} path="/sales/salesperson" component={SalesSalesperson} />
                                <AuthenticatedRoute path="/sales/salesperson/:salespersonId" component={SalesSalespersonView} />
                                <AuthenticatedRoute exact={true} path="/sales/order" component={SalesOrder} />
                                <AuthenticatedRoute path="/sales/order/:orderId" component={SalesOrderView} />
                                <AuthenticatedRoute exact={true} path="/sales/distributor" component={Distributor} />
                                <AuthenticatedRoute path="/sales/distributor/:distributorId" component={DistributorView} />
                                <AuthenticatedRoute
                                    key="user-management"
                                    path="/Administration/Administration"
                                    component={UserManagement}
                                />
                                {/* Basic Routes */}
                                <AuthenticatedRoute
                                    key="calltypesettings"
                                    path="/Basic/CallTypeSettings/view"
                                    component={CallTypeSettings}
                                />
                                <AuthenticatedRoute
                                    key="applicationsettings"
                                    path="/basic/application/settings"
                                    component={ApplicationSettings}
                                />
                                <AuthenticatedRoute
                                    key="basicpromotions"
                                    path="/basic/promotions"
                                    component={Promotion}
                                />
                                <AuthenticatedRoute
                                    key="basicnews"
                                    path="/basic/news"
                                    component={News}
                                />
                                <AuthenticatedRoute
                                    key="accessibilitysettings"
                                    path="/basic/accessibilitysettings"
                                    component={AccessibilitySettings}
                                />
                                <AuthenticatedRoute
                                    key="basicnews"
                                    path="/basic/report"
                                    component={Report}
                                />
                                <AuthenticatedRoute
                                    exact={true}
                                    key="salesproduct"
                                    path="/sales/product"
                                    component={SalesProduct}
                                />
                                <AuthenticatedRoute
                                    key="salesproductview"
                                    path="/sales/product/:productId"
                                    component={SalesProductView}
                                />
                                <AuthenticatedRoute
                                    exact={true}
                                    key="salescustomer"
                                    path="/sales/customer"
                                    component={SalesCustomer}
                                />
                                <AuthenticatedRoute
                                    key="salescustomerview"
                                    path="/sales/customer/:customerId"
                                    component={SalesCustomerView}
                                />
                                <Route path="/">
                                    <Redirect to="/login" />
                                </Route>
                            </Switch>
                        </Router>
                        <SymphonySystemDialog
                            visible={this.props.system.systemDialogOpen}
                            onCloseAction={this._onHideSystemDialog.bind(this)}
                            maxWidth={this.props.system.systemDialogMaxWidth}
                            simpleDialog={this.props.system.systemDialogSimple}
                            content={this.props.system.systemDialogContent}
                            title={this.props.system.systemDialogTitle}
                            action={this.props.system.systemDialogActions}
                            simpleConfirm={this.props.system.systemDialogSimple}
                            onConfirmAction={this.props.system.systemDialogConfirmAction}
                            overrideTitle={this.props.system.systemOverrideTitle}
                            confirmOnly={this.props.system.systemConfirmOnly}
                        />
                    </MuiPickersUtilsProvider>
                </LoadScript>
            </Box>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    login: state.login,
    system: state.system
})

const mapDispatchToProps = { refreshToken, setHeaderText, resetLoginState, setLoginState, setSystemState, resetAxiosInterceptors };

export default connect(mapStateToProps, mapDispatchToProps)(App);
