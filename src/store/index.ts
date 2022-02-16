import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import expireReducer from 'redux-persist-expire';
import storage from 'redux-persist/lib/storage';
import thunk, { ThunkAction } from 'redux-thunk';
import systemReducer from './system/reducers';
// Marketplace Reducers
import { productReducer } from './product/reducers';
import loginReducer from './login/reducers';
import { homeReducer } from './home/reducers';
import categoryReducer from './category/reducers';
import promoBannerReducer from './promobanner/reducers';
import libraryReducer from './library/reducers';
import reviewReducer from './review/reducers';
import manageReducer from './manage/reducers';
import administrationReducer from './administration/reducers';
import marketProductReducer from './marketproduct/reducers';
import accessibilityReducer from './accessibility/reducers'
import userManagementReducer from './usermanagement/reducers'
import orderManagementReducer from './ordermanagement/reducers'
// Basic Reducers
import salespersonReducer from './salesperson/reducers';
import customerReducer from './customer/reducers';
import basicProductReducer from './basicproduct/reducers';
import fieldsReducer from './fields/reducers';
import callTypeSettingsReducer from './calltypesettings/reducers';
import applicationSettingsReducer from './applicationsettings/reducers';
import promotionReducer from './promotion/reducers';
import newsReducer from './news/reducers';
import salesreportReducer from './salesreport/reducers';
import accessibilitySettingsReducer from './accessibilitysettings/reducers';
import distributorReducer from './distributor/reducers';


const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['session'],
    transforms: [
        // expireReducer('session', {
        //     expireSeconds: 3599,
        //     expiredState: {},
        //     autoExpire: true,
        // }),
    ],
};

const systemPersistConfig = {
    key: 'system',
    storage,
    whitelist: ['session','interceptors', 'userType', 'headerText'],
    transforms: [
        expireReducer('session', {
            expireSeconds: 3599,
            expiredState: { token: '', refreshToken: '' },
            autoExpire: true,
        }),
    ],
};

const promoBannerPersistConfig = {
    key: 'promobanner',
    storage,
    whitelist: ['activePromoBanner', 'banners', 'promoBannerTabs', 'bannerTierOneCategories', 'selectedVendor'],
};

const loginPersistConfig = {
    key: 'login',
    storage,
    whitelist: ['user', 'platform', 'token', 'rememberMe', 'isLoggedIn', 'basicUsername', 'basicRememberMe'],
    blacklist: [
        'email',
        'newPassword',
        'confirmPassword',
        'loginLoading',
        'forgotPasswordLoading',
    ],
    transforms: [
        expireReducer('user', {
            expireSeconds: 3599,
            expiredState: { firstName: '', lastName: '' },
            autoExpire: true,
        }),
        expireReducer('token', {
            expireSeconds: 3599,
            expiredState: undefined,
            autoExpire: true,
        }),
    ],
};

const salesProductsPersistConfig = {
    key: 'product',
    storage,
    whitelist: ['products'],
};

const salesSalespersonsPersistConfig = {
    key: 'salesperson',
    storage,
    whitelist: ['salespersons'],
};

const salesCustomersPersistConfig = {
    key: 'customer',
    storage,
    whitelist: ['customerList'],
};

const marketProductsPersistConfig = {
    key: 'marketproduct',
    storage,
    whitelist: ['products'],
};

const userManagementPersistConfig = {
    key: 'userManagement',
    storage,
    whitelist: ['vendors','customers'],
};

const distributorPersistConfig = {
    key: 'distributor',
    storage,
    whitelist: ['distributors'],
};

const rootReducer = combineReducers({
    system: persistReducer(systemPersistConfig, systemReducer),
    login: persistReducer(loginPersistConfig, loginReducer),
    home: homeReducer,
    product: productReducer,
    category: categoryReducer,
    promobanner: persistReducer(promoBannerPersistConfig,promoBannerReducer),
    library: libraryReducer,
    salesperson: persistReducer(salesSalespersonsPersistConfig, salespersonReducer),
    customer: persistReducer(salesCustomersPersistConfig, customerReducer),
    review: reviewReducer,
    basicproduct: persistReducer(salesProductsPersistConfig, basicProductReducer),
    fields: fieldsReducer,
    calltypesettings: callTypeSettingsReducer,
    applicationsettings: applicationSettingsReducer,
    manage: manageReducer,
    administration: administrationReducer,
    promotion: promotionReducer,
    news: newsReducer,
    accessibilitysettings: accessibilitySettingsReducer,
    salesreport: salesreportReducer,
    marketproduct: persistReducer(marketProductsPersistConfig, marketProductReducer),
    accessibility: accessibilityReducer,
    usermanagement: persistReducer(userManagementPersistConfig, userManagementReducer),
    ordermanagement: orderManagementReducer,
    distributor: persistReducer(distributorPersistConfig, distributorReducer)
});

const middleware = [thunk];
const middlewareEnhancer = applyMiddleware(...middleware);
export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
export const store =
    process.env.NODE_ENV === 'development'
        ? createStore(persistedReducer, composeWithDevTools(middlewareEnhancer))
        : createStore(persistedReducer, middlewareEnhancer);

export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<
    void | any,
    AppState,
    null,
    AnyAction
>

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`REACT_APP_ENV: ${process.env.REACT_APP_ENV}`);

export const persistor = persistStore(store);
