import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { AppState } from '../../store';
import { SystemState } from '../../store/system/types';
import { LoginState } from '../../store/login/types';
import { setSystemState } from '../../store/system/actions';
import { SYMPHONY_SECONDARY_COLOR_DARK , SYMPHONY_PRIMARY_COLOR } from './Colors';
import Drawer from '@material-ui/core/Drawer';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import HomeIcon from '@material-ui/icons/Home';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import SettingsPhoneIcon from '@material-ui/icons/SettingsPhone';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import withStyles from '@material-ui/styles/withStyles';

// assets import 
import SymphonyLogo from '../../assets/images/logos/symphony-logo-gold-white.png';
import ProductIcon from '../../assets/images/nav/product.png';
import ProductActiveIcon from '../../assets/images/nav/product-active.png';
import UserManagementIcon from '../../assets/images/nav/usermanagement.png';
import UserManagementActiveIcon from '../../assets/images/nav/usermanagement-active.png';
// import CategoryIcon from '../../assets/images/nav/category.png'
// import CategoryActive from '../../assets/images/nav/category-active.png'
import CustomerIcon from '../../assets/images/nav/customer.png';
import CustomerActiveIcon from '../../assets/images/nav/customer-active.png';
import ProfileIcon from '../../assets/images/nav/profile.png';
import ProfileActiveIcon from '../../assets/images/nav/profile-active.png';
// import PromoIcon from '../../assets/images/nav/promo.png';
// import PromoActiveIcon from '../../assets/images/nav/promo-active.png';
import ReportIcon from '../../assets/images/nav/report.png';
import ReportActiveIcon from '../../assets/images/nav/report-active.png';
// import AppSettingsIcon from '../../assets/images/nav/appsettings.png';
// import AppSettingsActiveIcon from '../../assets/images/nav/appsettings-active.png';
import FieldSettingsIcon from '../../assets/images/nav/fieldsettings.png';
import FieldSettingsActiveIcon from '../../assets/images/nav/fieldsettings-active.png';

// market
// import MarketReviewIcon from '../../assets/images/nav/marketreview.png'
// import MarketReviewActiveIcon from '../../assets/images/nav/marketreview-active.png'
import MarketOrderIcon from '../../assets/images/nav/marketorder.png'
import MarketOrderActiveIcon from '../../assets/images/nav/marketorder-active.png'
import MarketPromoIcon from '../../assets/images/nav/promobanner.png'
import MarketPromoActiveIcon from '../../assets/images/nav/promobanner-active.png'
import MarketCategoryIcon from '../../assets/images/nav/marketcategory.png'
import MarketCategoryActiveIcon from '../../assets/images/nav/marketcategory-active.png'
import MarketLibraryIcon from '../../assets/images/nav/library.png'
import MarketLibraryActiveIcon from '../../assets/images/nav/library-active.png'
// import MarketUserIcon from '../../assets/images/nav/marketuser.png'
// import MarketUserActiveIcon from '../../assets/images/nav/marketuser-active.png'
// import ProductIcon from '../../assets/images/nav/product.png'
// import ProductActiveIcon from '../../assets/images/nav/product-active.png'
// util
import find from 'lodash/find';
import routes from './routes.json';

const DRAWER_WIDTH = 300;
const StyledDrawer = withStyles(
    () => ({
        root: {
            flexShrink: 0,
            whiteSpace: 'nowrap',
            '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                backgroundColor: SYMPHONY_SECONDARY_COLOR_DARK,
                color: '#FFF'
            }
        }
    })
)(Drawer);

const StyledListItem = withStyles(
    () => ({
        root: {
            color: '#5E6A7E',
            '& .MuiListItemIcon-root': {
                color: '#5E6A7E',
                minWidth: 40
            }
        }
    })
)(ListItem);

const SelectedIcon = withStyles(
    () => ({
        root: {
            '& .MuiSvgIcon-root': {
                width: '0.5em',
                height: '0.5em'
            },
            width: '0.5em',
            height: '0.5em',
            margin: '0 0.25em',
            color: SYMPHONY_PRIMARY_COLOR
        }
    })
)(FiberManualRecord);

interface SymphonyDrawerInterface {
    setSystemState: typeof setSystemState;
    system: SystemState;
    login: LoginState;
}

class SymphonyDrawer extends React.Component<SymphonyDrawerInterface & RouteComponentProps> {

    componentDidMount = () => {
        const route = find(routes, (r) => this.props.location.pathname.toLowerCase().indexOf(r.path) > -1 );
        if (route) {
            this.props.setSystemState({ 
                route: route.path,
                expandedNavigation: route.expanded,
                headerText: {
                    main: route.name,
                    sub: ''
                }
            });
        }
        
        document.title = this.props.system.userType === 'Marketplace' ? 'Symphony Market AMI' : 'Symphony Sales AMI';
    }
    

    _setNavigation = (to: string, expanded?: string, retainExpanded?: boolean) => {
        const { expandedNavigation, headerText } = this.props.system;
        const route = find(routes,  { path: to });
        this.props.setSystemState({ 
            route: to, 
            expandedNavigation: retainExpanded ? expandedNavigation : expanded,
            headerText: {
                main: route ? route.name : headerText ? headerText.main : '',
                sub: ''
            }
        });
    }

    render () {
        const { route, expandedNavigation, userType } = this.props.system;
        const { userType: user, access } = this.props.login.user;
        return (
            <StyledDrawer
                variant="permanent"
            >
                <div style={{ height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 32px'}}>
                    {/* logo container */}
                    <img src={SymphonyLogo} alt="" style={{ width: '80%', height: 'auto' }} />
                </div>
                <List>
                    <Link id="nav-home" to="/home" style={{ display: 'flex', textDecoration: 'none' }} onClick={() => this._setNavigation('/home')}>
                        <StyledListItem button={true}>
                            <ListItemIcon>
                                <HomeIcon style={{ color: route === '/home' ? '#FFF' : '#5E6A7E'}}/>
                            </ListItemIcon>
                            <ListItemText style={{ color: route === '/home' ? '#FFF' : '#5E6A7E'}}>
                                Home
                            </ListItemText>
                        </StyledListItem>
                    </Link>
                    {userType === 'Basic' ? 
                        <>
                            {access.includes('VIEW::PRODUCT') &&
                                <>
                                    <StyledListItem id="nav-collapse-product" button={true} onClick={this._setNavigation.bind(this, '', 'product-management', false)}>
                                    <ListItemIcon>
                                        <Icon>
                                            <img alt="" className="navicon" src={expandedNavigation === 'product-management' ? ProductActiveIcon : ProductIcon} />
                                        </Icon>
                                    </ListItemIcon>
                                    <ListItemText style={{ color: expandedNavigation === 'product-management' ? '#FFF' : '#5E6A7E'}}>
                                        Product Management
                                    </ListItemText>
                                    {expandedNavigation === 'product-management' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'product-management'}>
                                        <Link 
                                            id="nav-product"
                                            to="/sales/product" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/sales/product', 'product-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/sales/product' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/sales/product' ? '#FFF' : '#5E6A7E'}}>
                                                    Products
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                            {access.includes('VIEW::CUSTOMER') &&
                                <>
                                    <StyledListItem id="nav-collapse-customer" button={true} onClick={this._setNavigation.bind(this, '', 'customer-management', false)}>
                                        <ListItemIcon>
                                            <img alt="" className="navicon" src={expandedNavigation === 'customer-management' ? CustomerActiveIcon : CustomerIcon} />
                                        </ListItemIcon>
                                        <ListItemText style={{ color: expandedNavigation === 'customer-management' ? '#FFF' : '#5E6A7E'}}>
                                            Customer Management
                                        </ListItemText>
                                        {expandedNavigation === 'customer-management' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'customer-management'}>
                                        <Link 
                                            id="nav-sales-customer"
                                            to="/sales/customer" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/sales/customer', 'customer-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/sales/customer' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/sales/customer' ? '#FFF' : '#5E6A7E'}}>
                                                    Customers
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                            {access.includes('VIEW::SALESPERSON') &&
                                <>
                                    <StyledListItem id="nav-collapse-salesperson" button={true} onClick={this._setNavigation.bind(this, '', 'salesperson-management', false)}>
                                        <ListItemIcon>
                                            <img alt="" className="navicon" src={expandedNavigation === 'salesperson-management' ? ProfileActiveIcon : ProfileIcon} />
                                        </ListItemIcon>
                                        <ListItemText style={{ color: expandedNavigation === 'salesperson-management' ? '#FFF' : '#5E6A7E'}}>
                                            Salesperson Management
                                        </ListItemText>
                                        {expandedNavigation === 'salesperson-management' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'salesperson-management'}>
                                        <Link 
                                            id="nav-salesperson"
                                            to="/sales/salesperson" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/sales/salesperson', 'salesperson-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/sales/salesperson' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/sales/salesperson' ? '#FFF' : '#5E6A7E'}}>
                                                    Salespersons
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                            {access.includes('VIEW::DISTRIBUTOR') &&
                                <>
                                    <StyledListItem id="nav-collapse-distributor" button={true} onClick={this._setNavigation.bind(this, '', 'distributor-management', false)}>
                                        <ListItemIcon>
                                            <LocalShippingIcon style={{ color: route === '/sales/distributor' ? '#FFF' : '#5E6A7E'}}/>
                                        </ListItemIcon>
                                        <ListItemText style={{ color: expandedNavigation === 'distributor-management' ? '#FFF' : '#5E6A7E'}}>
                                            Distributor Management
                                        </ListItemText>
                                        {expandedNavigation === 'distributor-management' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'distributor-management'}>
                                        <Link 
                                            id="nav-distributor"
                                            to="/sales/distributor" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/sales/distributor', 'distributor-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/sales/distributor' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/sales/distributor' ? '#FFF' : '#5E6A7E'}}>
                                                    Distributors
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                            {/* <Link 
                                id="nav-calltypesettings"
                                to="/basic/calltypesettings/view" 
                                style={{ display: 'flex', textDecoration: 'none' }} 
                                onClick={() => this._setNavigation('/basic/calltypesettings/view')}
                            >
                                <StyledListItem button={true}>
                                    <ListItemIcon>
                                        <SettingsPhoneIcon  style={{ color: route === '/basic/calltypesettings/view' ? '#FFF' : '#5E6A7E'}} />
                                    </ListItemIcon>
                                    <ListItemText  style={{ color: route === '/basic/calltypesettings/view' ? '#FFF' : '#5E6A7E'}}>
                                        Call Type Settings
                                    </ListItemText>
                                </StyledListItem>
                            </Link> */}
                            {/* <StyledListItem id="nav-collapse-events" button={true} onClick={this._setNavigation.bind(this, '', 'events', false)}>
                                <ListItemIcon>
                                    <img alt="" className="navicon" src={expandedNavigation === 'events' ? PromoActiveIcon : PromoIcon} />
                                </ListItemIcon>
                                <ListItemText  style={{ color: expandedNavigation === 'events' ? '#FFF' : '#5E6A7E'}}>
                                    Events
                                </ListItemText>
                                {expandedNavigation === 'events' ? <ExpandLess /> : <ExpandMore />}
                            </StyledListItem>
                            <Collapse in={expandedNavigation === 'events'}>
                                <Link
                                    id="nav-sales-promotions" 
                                    to="/basic/promotions" 
                                    style={{ display: 'flex', textDecoration: 'none' }} 
                                    onClick={() => this._setNavigation('/basic/promotions', 'events', true)}
                                >
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            {route === '/basic/promotions' ? <SelectedIcon /> : <></>}
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/basic/promotions' ? '#FFF' : '#5E6A7E'}}>
                                            Product Promotion
                                        </ListItemText>
                                    </StyledListItem>
                                </Link>
                                <Link 
                                    id="nav-sales-news"
                                    to="/basic/news" 
                                    style={{ display: 'flex', textDecoration: 'none' }} 
                                    onClick={() => this._setNavigation('/basic/news', 'events', true)
                                }>
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            {route === '/basic/news' ? <SelectedIcon /> : <></>}
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/basic/news' ? '#FFF' : '#5E6A7E'}}>
                                            News
                                        </ListItemText>
                                    </StyledListItem>
                                </Link>
                            </Collapse> */}
                            {access.includes('VIEW::REPORT') &&
                                <>
                                    <Link 
                                        id="nav-sales-report" 
                                        to="/basic/report" 
                                        style={{ display: 'flex', textDecoration: 'none' }} 
                                        onClick={() => this._setNavigation('/basic/report')}
                                    >
                                        <StyledListItem button={true}>
                                            <ListItemIcon>
                                                <img alt="" className="navicon" src={route === '/basic/report' ? ReportActiveIcon : ReportIcon} />
                                            </ListItemIcon>
                                            <ListItemText  style={{ color: route === '/basic/report' ? '#FFF' : '#5E6A7E'}}>
                                                Report
                                            </ListItemText>
                                        </StyledListItem>
                                    </Link>
                                </>
                            }
                            {/* <Link 
                                id="nav-sales-app-settings" 
                                to="/basic/application/settings" 
                                style={{ display: 'flex', textDecoration: 'none' }} 
                                onClick={() => this._setNavigation('/basic/application/settings')}
                            >
                                <StyledListItem button={true}>
                                    <ListItemIcon>
                                        <img alt="" className="navicon" style={{ height: 24, width: 'auto', paddingLeft: '4.1px' }} src={route === '/basic/application/settings' ? AppSettingsActiveIcon : AppSettingsIcon} />
                                    </ListItemIcon>
                                    <ListItemText  style={{ color: route === '/basic/application/settings' ? '#FFF' : '#5E6A7E'}}>
                                        Application Settings
                                    </ListItemText>
                                </StyledListItem>
                            </Link> */}
                            {access.includes('VIEW::MODULE_FIELDS') &&
                                <>
                                    <Link 
                                        id="nav-sales-field-settings"
                                        to="/fields" 
                                        style={{ display: 'flex', textDecoration: 'none' }} 
                                        onClick={() => this._setNavigation('/fields')}
                                    >
                                        <StyledListItem button={true}>
                                            <ListItemIcon>
                                                <img 
                                                    alt="" 
                                                    className="navicon" 
                                                    style={{ height: 24, width: 'auto', position: 'relative', left: -2.5 }} 
                                                    src={route === '/fields' ? FieldSettingsActiveIcon : FieldSettingsIcon} 
                                                />
                                            </ListItemIcon>
                                            <ListItemText  style={{ color: route === '/fields' ? '#FFF' : '#5E6A7E'}}>
                                                Field Settings
                                            </ListItemText>
                                        </StyledListItem>
                                    </Link>
                                </>
                            }
                            {/* <StyledListItem 
                                id="nav-collapse-accessibility" 
                                button={true} 
                                onClick={this._setNavigation.bind(this, '', 'accessibility', false)}
                            >
                                <ListItemIcon>
                                        <img 
                                            alt="" 
                                            className="navicon" 
                                            style={{ height: 24, width: 'auto'}} 
                                            src={expandedNavigation === 'accessibility' ? UserManagementActiveIcon : UserManagementIcon} 
                                        />
                                </ListItemIcon>
                                <ListItemText  style={{ color: expandedNavigation === 'accessibility' ? '#FFF' : '#5E6A7E'}}>
                                    User Management
                                </ListItemText>
                                {expandedNavigation === 'accessibility' ? <ExpandLess /> : <ExpandMore />}
                            </StyledListItem>
                            <Collapse in={expandedNavigation === 'accessibility'}>
                            <Link 
                                id="nav-sales-accessibility"
                                to="/basic/accessibilitysettings" 
                                style={{ display: 'flex', textDecoration: 'none' }} 
                                onClick={() => this._setNavigation('/basic/accessibilitysettings', 'accessibility', true)}
                            >
                                <StyledListItem button={true}>
                                    <ListItemIcon>
                                        {route === '/basic/accessibilitysettings' ? <SelectedIcon /> : <></>}
                                    </ListItemIcon>
                                    <ListItemText style={{ color: route === '/basic/promaccessibilitysettingsotions' ? '#FFF' : '#5E6A7E'}}>
                                        Accessibility Settings
                                    </ListItemText>
                                </StyledListItem>
                            </Link>
                        </Collapse> */}
                        </>
                    :
                        <>
                            { user !== 'ADMIN' && access.includes('VIEW::PRODUCT') &&
                                <>
                                    <StyledListItem id="nav-collapse-product" button={true} onClick={this._setNavigation.bind(this, '', 'product-management', false)}>
                                        <ListItemIcon>
                                            <Icon>
                                                <img alt="" className="navicon" src={expandedNavigation === 'product-management' ? ProductActiveIcon : ProductIcon} />
                                            </Icon>
                                        </ListItemIcon>
                                        <ListItemText style={{ color: expandedNavigation === 'product-management' ? '#FFF' : '#5E6A7E'}}>
                                            Product Management
                                        </ListItemText>
                                        {expandedNavigation === 'product-management' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'product-management'}>
                                        <Link 
                                            id="nav-product"
                                            to="/market/product" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/product', 'product-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/product' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/product' ? '#FFF' : '#5E6A7E'}}>
                                                    Products
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                            {/* <StyledListItem id="nav-collapse-review" button={true} onClick={this._setNavigation.bind(this, '', 'review', false)}>
                                <ListItemIcon>
                                    <Icon>
                                        <img alt="" className="navicon" src={expandedNavigation === 'review' ? MarketReviewActiveIcon : MarketReviewIcon} />
                                    </Icon>
                                </ListItemIcon>
                                <ListItemText style={{ color: expandedNavigation === 'review' ? '#FFF' : '#5E6A7E'}}>
                                    Reviews
                                </ListItemText>
                                {expandedNavigation === 'review' ? <ExpandLess /> : <ExpandMore />}
                            </StyledListItem>
                            <Collapse in={expandedNavigation === 'review'}>
                                <Link 
                                    id="nav-review"
                                    to="/market/review" 
                                    style={{ display: 'flex', textDecoration: 'none' }} 
                                    onClick={() => this._setNavigation('/market/review', 'review', true)}
                                >
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            {route === '/market/review' ? <SelectedIcon /> : <></>}
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/market/review' ? '#FFF' : '#5E6A7E'}}>
                                            Product Reviews
                                        </ListItemText>
                                    </StyledListItem>
                                </Link>
                                <Link 
                                    id="nav-rating"
                                    to="/market/rating" 
                                    style={{ display: 'flex', textDecoration: 'none' }} 
                                    onClick={() => this._setNavigation('/market/rating', 'rating', true)}
                                >
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            {route === '/market/rating' ? <SelectedIcon /> : <></>}
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/market/rating' ? '#FFF' : '#5E6A7E'}}>
                                            Product Ratings
                                        </ListItemText>
                                    </StyledListItem>
                                </Link>
                            </Collapse> */}
                            {user !== 'ADMIN' && access.includes('VIEW::ORDER') &&
                                <>
                                    <StyledListItem id="nav-collapse-order" button={true} onClick={this._setNavigation.bind(this, '', 'order', false)}>
                                        <ListItemIcon>
                                            <Icon>
                                                <img alt="" className="navicon" src={expandedNavigation === 'order' ? MarketOrderActiveIcon : MarketOrderIcon} />
                                            </Icon>
                                        </ListItemIcon>
                                        <ListItemText style={{ color: expandedNavigation === 'order' ? '#FFF' : '#5E6A7E'}}>
                                            Order Management
                                        </ListItemText>
                                        {expandedNavigation === 'order' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'order'}>
                                        <Link 
                                            id="nav-order"
                                            to="/market/order" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/order', 'order', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/order' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/order' ? '#FFF' : '#5E6A7E'}}>
                                                    Manage Order
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                        <Link 
                                            id="nav-orderhistory"
                                            to="/market/orderhistory" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/orderhistory', 'order', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/orderhistory' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/orderhistory' ? '#FFF' : '#5E6A7E'}}>
                                                    Order History
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                            {(access.includes('VIEW::HOME_BANNER') || access.includes('VIEW::VENDOR_BANNER')) &&
                                <Link id="nav-market-promobanner" to="/market/promobanner" style={{ display: 'flex', textDecoration: 'none' }} onClick={() => this._setNavigation('/market/promobanner')}>
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            <Icon>
                                                <img alt="" className="navicon" src={route === '/market/promobanner' ? MarketPromoActiveIcon : MarketPromoIcon} />
                                            </Icon>
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/market/promobanner' ? '#FFF' : '#5E6A7E'}}>
                                            Promo Banner
                                        </ListItemText>
                                    </StyledListItem>
                                </Link>
                            }
                            { access.includes('VIEW::CATEGORY') &&
                                <Link id="nav-market-category" to="/market/category" style={{ display: 'flex', textDecoration: 'none' }} onClick={() => this._setNavigation('/market/category')}>
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            <Icon>
                                                <img alt="" className="navicon" src={route === '/market/category' ? MarketCategoryActiveIcon : MarketCategoryIcon} />
                                            </Icon>
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/market/category' ? '#FFF' : '#5E6A7E'}}>
                                            Category Management
                                        </ListItemText>
                                    </StyledListItem>
                                </Link>
                            }
                            { access.includes('VIEW::LIBRARY') &&
                                <>
                                    <StyledListItem id="nav-collapse-library" button={true} onClick={this._setNavigation.bind(this, '', 'library', false)}>
                                        <ListItemIcon>
                                            <Icon>
                                                <img alt="" className="navicon" src={expandedNavigation === 'library' ? MarketLibraryActiveIcon : MarketLibraryIcon} />
                                            </Icon>
                                        </ListItemIcon>
                                        <ListItemText style={{ color: expandedNavigation === 'library' ? '#FFF' : '#5E6A7E'}}>
                                            Library
                                        </ListItemText>
                                        {expandedNavigation === 'library' ? <ExpandLess /> : <ExpandMore />}
                                    </StyledListItem>
                                    <Collapse in={expandedNavigation === 'library'}>
                                        <Link 
                                            id="nav-aboutus"
                                            to="/market/aboutus" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/aboutus', 'library', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/aboutus' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/aboutus' ? '#FFF' : '#5E6A7E'}}>
                                                    About Us
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                        <Link 
                                            id="nav-faqs"
                                            to="/market/faqs" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/faqs', 'library', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/faqs' ? <SelectedIcon fill={SYMPHONY_PRIMARY_COLOR} /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/faqs' ? '#FFF' : '#5E6A7E'}}>
                                                    FAQs
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                        <Link 
                                            id="nav-helpdesk"
                                            to="/market/helpdesk" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/helpdesk', 'library', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/helpdesk' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/helpdesk' ? '#FFF' : '#5E6A7E'}}>
                                                    Helpdesk
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </Collapse>
                                </>
                            }
                        </>
                    }
                    {(access.includes('VIEW::ROLE') || access.includes('VIEW::USER')) &&
                        <>
                            <StyledListItem id="nav-collapse-user-management" button={true} onClick={this._setNavigation.bind(this, '', 'user-management', false)}>
                                <ListItemIcon>
                                    <Icon>
                                        <img  
                                            style={{ height: 24, width: 'auto', position: 'relative', left: 2 }}
                                            alt="" 
                                            className="navicon" 
                                            src={expandedNavigation === 'user-management' ? UserManagementActiveIcon : UserManagementIcon} 
                                        />
                                    </Icon>
                                </ListItemIcon>
                                <ListItemText style={{ color: expandedNavigation === 'user-management' ? '#FFF' : '#5E6A7E'}}>
                                    User Management
                                </ListItemText>
                                {expandedNavigation === 'user-management' ? <ExpandLess /> : <ExpandMore />}
                            </StyledListItem>
                            <Collapse in={expandedNavigation === 'user-management'}>
                                {access.includes('VIEW::ROLE') &&
                                    <>
                                        <Link 
                                            id="nav-role"
                                            to="/symphony/role" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/symphony/role', 'user-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/symphony/role' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/symphony/role' ? '#FFF' : '#5E6A7E'}}>
                                                    Role & Accessibility
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </>
                                }
                                {/* <Link 
                                    id="nav-accessibility"
                                    to="/symphony/roles" 
                                    style={{ display: 'flex', textDecoration: 'none' }} 
                                    onClick={() => this._setNavigation('/symphony/roles', 'user-management', true)}
                                >
                                    <StyledListItem button={true}>
                                        <ListItemIcon>
                                            {route === '/symphony/roles' ? <SelectedIcon /> : <></>}
                                        </ListItemIcon>
                                        <ListItemText style={{ color: route === '/symphony/roles' ? '#FFF' : '#5E6A7E'}}>
                                            Role and Accessibility
                                        </ListItemText>
                                    </StyledListItem>
                                </Link> */}
                                {access.includes('VIEW::USER') &&
                                    <>
                                        <Link 
                                            id="nav-useraccount"
                                            to="/market/useraccount" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/useraccount', 'user-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/useraccount' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/useraccount' ? '#FFF' : '#5E6A7E'}}>
                                                    User Account
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                        <Link 
                                            id="nav-vendor"
                                            to="/market/vendor" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/vendor', 'user-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/vendor' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/vendor' ? '#FFF' : '#5E6A7E'}}>
                                                    Vendor
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                        <Link 
                                            id="nav-accessibility"
                                            to="/market/customer" 
                                            style={{ display: 'flex', textDecoration: 'none' }} 
                                            onClick={() => this._setNavigation('/market/customer', 'user-management', true)}
                                        >
                                            <StyledListItem button={true}>
                                                <ListItemIcon>
                                                    {route === '/market/customer' ? <SelectedIcon /> : <></>}
                                                </ListItemIcon>
                                                <ListItemText style={{ color: route === '/market/customer' ? '#FFF' : '#5E6A7E'}}>
                                                    Customer
                                                </ListItemText>
                                            </StyledListItem>
                                        </Link>
                                    </>
                                }
                            </Collapse>
                        </>
                    }
                    {userType === 'Basic' && (access.includes('GET::ORDER') || access.includes('VIEW::ORDER')) &&
                        <Link id="nav-sales-order-management" to="/sales/order" style={{ display: 'flex', textDecoration: 'none' }} onClick={() => this._setNavigation('/sales/order')}>
                            <StyledListItem button={true}>
                                <ListItemIcon>
                                    <DescriptionIcon style={{ color: route === '/sales/order' ? '#FFF' : '#5E6A7E'}}/>
                                </ListItemIcon>
                                <ListItemText style={{ color: route === '/sales/order' ? '#FFF' : '#5E6A7E'}}>
                                    Order Management
                                </ListItemText>
                            </StyledListItem>
                        </Link>
                    }
                </List>
            </StyledDrawer>
        )
    }
}
    
const mapStateToProps = (state: AppState) => ({
    system: state.system,
    login: state.login
})
export default withRouter(
    connect(mapStateToProps, {
        setSystemState
    })(SymphonyDrawer)
);