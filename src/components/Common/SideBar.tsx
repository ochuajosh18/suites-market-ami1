import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Tabs,
    Tab
} from '@material-ui/core';
import _ from 'lodash';

import './SideBar.css';

import { AppState } from '../../store';
// import { SelectSidebarTab } from '../../store/home/actions';
import { setHeaderText, selectSidebarTab } from '../../store/system/actions';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100%'
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        marginTop: '64px',
        border: 0,
        backgroundColor: theme.palette.primary.main,
        // custom scrollbar
        '&::-webkit-scrollbar': {
            width: '0.5em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2B2B2B',
            outline: '1px solid slategrey'
        }
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        width: '100%',
        height: '100%',
        // padding: theme.spacing(3),
    },
    list: {
        color: theme.palette.secondary.main,
        padding: '1rem 0 1rem 1rem',
    },
    mainItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
        padding: '0.5 1rem'
    },
    subItem: {
        // marginLeft: '2rem',
        width: '100%',
    },
    tabs: {
        width: '100%'
    }
}));

const MyTab = withStyles((theme) => ({
    root: {
        // borderRight: '2px solid lightgray',
        // textAlign: 'right',
        textTransform: 'none',
        width: '100%'
    },
    selected: {
        // color: '#4ABDAC',
        // borderRight: '3px solid #4ABDAC',
        // textAlign: 'right',
    },
    label: {
        // fontSize: 20,
        // textTransform: 'initial',
    },
    wrapper: {
        alignItems: 'flex-start',
    },
}))(Tab);

function PermanentDrawerLeft(props) {
    const classes = useStyles();
    const history = useHistory();

    const urlList = [
        { url: '/Home', mainText: 'HOME', subText: '' },
        {
            url: '/Product',
            mainText: 'PRODUCT MANAGEMENT',
            subText: 'PRODUCTS',
        },
        { url: '/Order', mainText: 'ORDER MANAGEMENT', subText: 'ORDERS' },
        {
            url: '/Order/History',
            mainText: 'ORDER MANAGEMENT',
            subText: 'ORDER HISTORY',
        },
        {
            url: '/Category',
            mainText: 'CATEGORY MANAGEMENT',
            subText: '',
        },
        {
            url: '/PromoBanner',
            mainText: 'PROMO BANNER',
            subText: ''
        },
        {
            url: '/Library/aboutus',
            mainText: 'LIBRARY',
            subText: 'About us',
        },
        {
            url: '/Library/faq',
            mainText: 'LIBRARY',
            subText: 'FAQs',
        },
        {
            url: '/Library/helpdesk',
            mainText: 'LIBRARY',
            subText: 'Helpdesk',
        },
        {
            url: '/Review/ProductReview',
            mainText: 'REVIEW',
            subText: 'PRODUCT REVIEW',
        },
        {
            url: '/Review/ProductRating',
            mainText: 'REVIEW',
            subText: 'PRODUCT RATING',
        },
        {
            url: '/manage/customer',
            mainText: 'USER MANAGEMENT',
            subText: 'Customer',
        },
        {
            url: '/manage/vendor',
            mainText: 'USER MANAGEMENT',
            subText: 'Vendor',
        },
        {
            url: '/Administration/Administration',
            mainText: 'ADMINISTRATION',
            subText: 'User Management',
        },
    ];

    const basicUrlList = [
        {
            url: '/basic/customer/view',
            mainText: 'CUSTOMER MANAGEMENT',
            subText: '',
        },
        {
            url: '/basic/salesperson/view',
            mainText: 'SALESPERSON MANAGEMENT',
            subText: '',
        },
        {
            url: '/basic/customer/fields',
            mainText: 'CUSTOMER MANAGEMENT',
            subText: 'Field Settings',
        },
        {
            url: '/basic/product',
            mainText: 'PRODUCT MANAGEMENT',
            subText: '',
        },
        {
            url: '/basic/product/fields',
            mainText: 'PRODUCT MANAGEMENT',
            subText: 'Field Settings',
        },
        {
            url: '/basic/calltypesettings/view',
            mainText: 'CALL TYPE SETTINGS',
            subText: '',
        },
        {
            url: '/basic/application/settings',
            mainText: 'APPLICATION SETTINGS',
            subText: '',
        },
        {
            url: '/basic/salesperson/fields',
            mainText: 'SALESPERSON MANAGEMENT',
            subText: 'Field Settings',
        },
        {
            url: '/basic/promotions',
            mainText: 'EVENTS',
            subText: 'Product Promotion',
        },
        {
            url: '/basic/news',
            mainText: 'EVENTS',
            subText: 'News',
        },
        {
            url: '/basic/report',
            mainText: 'REPORT',
            subText: '',
        },
        {
            url: '/basic/accessibilitysettings',
            mainText: 'ACCESSIBILITY SETTINGS',
            subText: '',
        },
    ]

    useEffect(
        () => {
            let urlItem = _.find(urlList, { url: history.location.pathname });
            urlItem = !urlItem ? _.find(basicUrlList, { url: history.location.pathname }) : urlItem;
            props.setHeaderText(urlItem?.mainText, urlItem?.subText);
            if (!props.system.sidebarTabValue) {
                props.selectSidebarTab(urlItem ? urlItem.url : '');
            }
        },
        // eslint-disable-next-line
        []
    ); //componentDidMount

    function goToURL(url: string) {
        props.selectSidebarTab('');
        history.push(url);
    }

    const _onChange_Tabs = (event: React.ChangeEvent<{}>, newValue: string) => {
        let urlItem = _.find(urlList, { url: newValue });
        urlItem = !urlItem ? _.find(basicUrlList, { url: history.location.pathname }) : urlItem;
        props.setHeaderText(urlItem?.mainText, urlItem?.subText);
        props.selectSidebarTab(newValue);
        history.push(newValue.toString());
    };

    const { userType } = props.login.user;
    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="left">
                <List className={classes.list}>
                    <ListItem
                        button
                        onClick={() => {
                            goToURL(urlList[0].url);
                        }}>
                        <ListItemText primary={'HOME'} className={'mainText'} />
                    </ListItem>
                    {props.system.userType === 'Basic' ?
                        <ListItem 
                            button
                            onClick={() => {
                                goToURL(basicUrlList[3].url);
                            }}
                            className={classes.mainItem}
                        >
                            <ListItemText
                                primary={'PRODUCT MANAGEMENT'}
                                className={'mainText'}
                            />
                        </ListItem>
                    :   (userType === 'VENDOR' || userType === 'ADMIN') && 
                        <>
                            <ListItem className={classes.mainItem}>
                                <ListItemText
                                    primary={'PRODUCT MANAGEMENT'}
                                    className={'mainText'}
                                />

                                <Tabs
                                    orientation="vertical"
                                    variant="fullWidth"
                                    value={props.system.sidebarTabValue}
                                    className={classes.tabs}
                                    onChange={_onChange_Tabs}
                                >
                                    <MyTab label="Products" value={urlList[1].url} />
                                </Tabs>
                            </ListItem>
                            <ListItem className={classes.mainItem}>
                                <ListItemText
                                    primary={'REVIEW'}
                                    className={'mainText'}
                                />

                                <Tabs
                                    orientation="vertical"
                                    variant="fullWidth"
                                    value={props.system.sidebarTabValue}
                                    className={classes.tabs}
                                    onChange={_onChange_Tabs}>
                                    <MyTab
                                        label="Product Review"
                                        value={urlList[9].url}
                                    />
                                    <MyTab
                                        label="Product Rating"
                                        value={urlList[10].url}
                                    />
                                </Tabs>
                            </ListItem>
                        </>
                    }
                    {
                        userType === 'VENDOR' && 
                        <>
                            <ListItem className={classes.mainItem}>
                                <ListItemText
                                    primary={'ORDER MANAGEMENT'}
                                    className={'mainText'}
                                />

                                <Tabs
                                    orientation="vertical"
                                    variant="fullWidth"
                                    value={props.system.sidebarTabValue}
                                    className={classes.tabs}
                                    onChange={_onChange_Tabs}>
                                    <MyTab
                                        label="Manage Orders"
                                        value={urlList[2].url}
                                    />
                                    <MyTab
                                        label="Order History"
                                        value={urlList[3].url}
                                    />
                                </Tabs>
                            </ListItem>
                        </>
                    }
                    {
                        (userType === 'VENDOR' ||  userType === 'ADMIN') &&
                        <>
                            <ListItem
                                button
                                onClick={() => {
                                    goToURL(urlList[5].url);
                                }}>
                                <ListItemText
                                    primary={'PROMO BANNER'}
                                    className={'mainText'}
                                />
                            </ListItem>
                        </>
                    }
                    {
                        userType === 'ADMIN' && 
                        <>
                            <ListItem className={classes.mainItem}>
                                <ListItemText
                                    primary={'USER MANAGEMENT'}
                                    className={'mainText'}
                                />

                                <Tabs
                                    orientation="vertical"
                                    variant="fullWidth"
                                    value={props.system.sidebarTabValue}
                                    className={classes.tabs}
                                    onChange={_onChange_Tabs}>
                                    <MyTab
                                        label="Customer"
                                        value={urlList[11].url}
                                    />
                                    <MyTab
                                        label="Vendor"
                                        value={urlList[12].url}
                                    />
                                    <MyTab
                                        label="User Account"
                                        value={urlList[13].url}
                                    />
                                </Tabs>
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => {
                                    goToURL(urlList[4].url);
                                }}>
                                <ListItemText
                                    primary={'CATEGORY MANAGEMENT'}
                                    className={'mainText'}
                                />
                            </ListItem>
                        </>
                    }
                    {props.system.userType === 'Basic' &&
                        <>
                            <ListItem 
                                button
                                onClick={() => {
                                    goToURL(basicUrlList[0].url);
                                }}
                                className={classes.mainItem}
                            >
                                <ListItemText
                                    primary={'CUSTOMER MANAGEMENT'}
                                    className={'mainText'}
                                />
                            </ListItem>
                            <ListItem 
                                button
                                onClick={() => {
                                    goToURL(basicUrlList[1].url);
                                }}
                                className={classes.mainItem}
                            >
                                <ListItemText
                                    primary={'SALESPERSON MANAGEMENT'}
                                    className={'mainText'}
                                />
                            </ListItem>
                            <ListItem 
                                button
                                onClick={() => {
                                    goToURL(basicUrlList[5].url);
                                }}
                                className={classes.mainItem}
                            >
                                <ListItemText
                                    primary={'CALL TYPE SETTINGS'}
                                    className={'mainText'}
                                />
                            </ListItem>
                            <ListItem className={classes.mainItem}>
                                <ListItemText
                                    primary={'EVENTS'}
                                    className={'mainText'}
                                />

                                <Tabs
                                    orientation="vertical"
                                    variant="fullWidth"
                                    value={props.system.sidebarTabValue}
                                    className={classes.tabs}
                                    onChange={_onChange_Tabs}>
                                    <MyTab
                                        label="Product Promotion"
                                        value={basicUrlList[8].url}
                                    />
                                    <MyTab
                                        label="News"
                                        value={basicUrlList[9].url}
                                    />
                                </Tabs>
                            </ListItem>
                        </>
                    }
                    {
                        userType === 'ADMIN' && 
                        <ListItem className={classes.mainItem}>
                            <ListItemText
                                primary={'LIBRARY'}
                                className={'mainText'}
                            />

                            <Tabs
                                orientation="vertical"
                                variant="fullWidth"
                                value={props.system.sidebarTabValue}
                                className={classes.tabs}
                                onChange={_onChange_Tabs}>
                                <MyTab
                                    label="About Us"
                                    value={urlList[6].url}
                                />
                                <MyTab
                                    label="FAQs"
                                    value={urlList[7].url}
                                />
                                <MyTab
                                    label="Helpdesk"
                                    value={urlList[8].url}
                                />
                            </Tabs>
                        </ListItem>
                    }
                    {props.system.userType === 'Basic' &&
                        <>
                            <ListItem 
                                button
                                onClick={() => {
                                    goToURL(basicUrlList[10].url);
                                }}
                                className={classes.mainItem}
                            >
                                <ListItemText
                                    primary="REPORT"
                                    className="mainText"
                                />
                            </ListItem>
                            <ListItem 
                                button
                                onClick={() => {
                                    goToURL(basicUrlList[6].url);
                                }}
                                className={classes.mainItem}
                            >
                                <ListItemText
                                    primary={'APPLICATION SETTINGS'}
                                    className="mainText"
                                />
                            </ListItem>
                             <ListItem className={classes.mainItem}>
                                <ListItemText
                                    primary={'USER MANAGEMENT'}
                                    className={'mainText'}
                                />
                                    <Tabs
                                        orientation="vertical"
                                        variant="fullWidth"
                                        value={props.system.sidebarTabValue}
                                        className={classes.tabs}
                                        onChange={_onChange_Tabs}>
                                        <MyTab
                                            label="Accessibility"
                                            value={basicUrlList[11].url}
                                        />
                                    </Tabs>
                                </ListItem>
                        </>
                    }
                </List>
            </Drawer>
            <main className={classes.content}>{props.children}</main>
        </div>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
        ...state,
    };
};

const mapDispatchToProps = { selectSidebarTab, setHeaderText };

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PermanentDrawerLeft);
