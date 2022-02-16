import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { SET_MARKET_PRODUCT_STATE, MarketProduct, MarketProductSku } from '../../../store/marketproduct/types';
import marketproduct from '../../../store/marketproduct/reducers';
import system from '../../../store/system/reducers';
import ProductView from './ProductView';

const flushPromises = () => new Promise(setImmediate);
const createTestStore = () => {
    return createStore(
        combineReducers({
            marketproduct,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>, existing = false) => {
    let wrapper = mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={existing ? ['/market/product/PRODUCT::TEST'] : [ '/market/product/new' ]} >
                <Route path="/market/product/:productId" component={ProductView} />
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

const setupForAddingProduct = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
     // simulate input for all common information inputs
     wrapper.find('input').forEach((node) => {
        const { id, type, disabled } = node.props();
        if (!disabled) {
            if (id && id.indexOf('product') > -1 && type === 'text') {
                node.simulate('change', { target: { value: 'test' }});
            }
        }
    });

    store.dispatch({
        type: SET_MARKET_PRODUCT_STATE,
        payload: {
            activeProduct: { 
                ...store.getState().marketproduct.activeProduct, 
                description: '<p>test</p>',
                h1: 'test',
                h2: 'test',
                h3: 'test'
            } as MarketProduct
        }
    });

    // add a single variant
    wrapper.find('#product-variants-tab').at(0).simulate('click');
    wrapper.update();
    // simulate input for variant details
    wrapper.find('input').forEach((node) => {
        const { id, type, disabled } = node.props();
        if (!disabled) {
            if (id && id.indexOf('variant') > -1 && type === 'text') {
                if (id.indexOf('-price') > -1 || id.toLowerCase().indexOf('stock') > -1) {
                    node.simulate('change', { target: { value: '100' }}).simulate('blur');
                }
                else {
                    node.simulate('change', { target: { value: 'test' }});
                }
            }
        }
    });

    store.dispatch({
        type: SET_MARKET_PRODUCT_STATE,
        payload: {
            activeProductVariant: { 
                ...store.getState().marketproduct.activeProductVariant, 
                isActive: true,
                media: [{ path: '/test.png', name: 'test.png', size: 0, type: 'image/png' }]
            } as MarketProductSku
        }
    });
}

const setupForSkuCrud = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    store.dispatch({
        type: SET_MARKET_PRODUCT_STATE,
        payload: {
            activeProduct: { ...store.getState().marketproduct.activeProduct, id: 'PRODUCT::TEST' },
            activeProductId: 'PRODUCT::TEST',
            productVariantsLoading: false,
            activeProductVariant: undefined,
            productViewLoading: false,
            productViewActiveTab: 'Variants'
        }
    });

    // add a single variant
    wrapper.find('#product-variants-tab').at(0).simulate('click');
    wrapper.update();

    store.dispatch({
        type: SET_MARKET_PRODUCT_STATE,
        payload: {
            productVariantsLoading: false,
            productVariants: [{ id: 'test', skuNumber: 'test', size: 'test', price: 10, discountPrice: 20, mainSku: false, media: [] }],
        }
    });
    wrapper.update();
}

describe('Market Product CRUD', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to add or update a product with proper validation', async () => {
        store = createTestStore();
        const wrapper = setup(store); // your wrapped component by enzyme
        setupForAddingProduct(wrapper, store);

        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true); // save dialog is open, therefore validations passed
    });

    it('Should not be able to add an existing product name', () => {
        store = createTestStore();
        const wrapper = setup(store); 
        setupForAddingProduct(wrapper, store);
        wrapper.find('#product-commoninfo-tab').at(0).simulate('click');

        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                products: [{ name: 'testexisting', id: 'testid' }],
                activeProduct: { ...store.getState().marketproduct.activeProduct, name: 'testexisting', id: 'testidtwo' }
            }
        });

        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(false); // save dialog is not open due to validation of existing product
    });

    it('Should be able to delete a product', () => {
        store = createTestStore();
        const wrapper = setup(store);
        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                activeProduct: { ...store.getState().marketproduct.activeProduct, id: 'PRODUCT::TEST' }
            }
        });
        wrapper.update();
        
        const AuxButton = wrapper.find('#market-aux-button').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#product-delete-btn").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true); // save dialog is open, therefore delete validations passed
    });

});

describe('Market Product SKU CRUD', () => {
    let store: ReturnType<typeof createTestStore>;

    // validation for size-color/size/color only
    it('Should be able to add/update SKU with proper validations', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('input').forEach((node) => {
            const { id, type } = node.props();
            if (id && id.indexOf('variant') > -1 && type === 'text') {
                node.simulate('change', { target: { value: 'test2' }});
            } 
        });

        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                activeProductVariant: { 
                    ...store.getState().marketproduct.activeProductVariant, 
                    isActive: true,
                    price: '10.00'
                } as MarketProductSku
            }
        });
        
        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(false); // missing media, do not allow saving

        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                activeProductVariant: { 
                    ...store.getState().marketproduct.activeProductVariant, 
                    marketStock: '1',
                    media: [{ path: '/test.png', name: 'test.png', size: 0, type: 'image/png' }]
                } as MarketProductSku
            }
        });
        
        SaveBtn.find('button').at(0).simulate('click');
        expect(store.getState().system.systemDialogOpen).toBe(true); // with media, do allow saving
    });

    // validation for size-color/size/color only
    it('Should be able to add/update SKU with size only', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('#variant-size-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});

        expect(store.getState().marketproduct.activeProductVariant!.size).toEqual('testsize');
    });

    it('Should be able to add/update SKU with color only', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('#variant-color-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});

        expect(store.getState().marketproduct.activeProductVariant!.color).toEqual('testsize');
    });

    it('Should be able to add/update SKU with both size and color', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('#variant-size-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});
        wrapper.find('#variant-color-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});

        expect(store.getState().marketproduct.activeProductVariant!.size).toEqual('testsize');
        expect(store.getState().marketproduct.activeProductVariant!.color).toEqual('testsize');
    });

    it('Should be able to set price validations', async () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        
        // add a discount price to disable bargain and special price
        wrapper.find('#variant-discountedprice-input').at(0).find('input').at(0).simulate('change', { target: { value: '100' }});

        const BargainPrice = wrapper.find('#variant-bargainprice-min-input').at(0).find('input').at(0);
        const SpecialPrice = wrapper.find('#variant-specialprice-min-input').at(0).find('input').at(0);
        
        expect(BargainPrice.props().disabled).toBeTruthy();
        expect(SpecialPrice.props().disabled).toBeTruthy();
    });

    it('Should be able to delete a product SKU', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                activeProduct: { ...store.getState().marketproduct.activeProduct, id: 'PRODUCT::TEST' },
                activeProductId: 'PRODUCT::TEST',
                productVariantsLoading: false,
                activeProductVariant: undefined,
                productViewLoading: false,
                productViewActiveTab: 'Variants'
            }
        });
        
        wrapper.find('#product-variants-tab').at(0).simulate('click');

        store.dispatch({
            type: SET_MARKET_PRODUCT_STATE,
            payload: {
                productVariantsLoading: false,
                productVariants: [{ id: 'test', skuNumber: 'test', mainSku: false, media: [] }, { id: 'test2', skuNumber: 'test', mainSku: false, media: [] }],
            }
        });
        wrapper.update();

        const AuxButton = wrapper.find('.variant-aux-btn').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#product-variant-delete-test").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true); // save dialog is open, therefore delete validations passed
    });

    it('Should be able to delete the product when deleting the last SKU', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);

        const AuxButton = wrapper.find('.variant-aux-btn').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#product-variant-delete-test").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogContent).toContain('Deleting all SKU will also delete the product'); 
    });

    it('Should be able to catch duplicate SKU Number when creating SKUs', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);

        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('input').forEach((node) => {
            const { id, type } = node.props();
            if (id && id.indexOf('variant') > -1 && type === 'text') {
                node.simulate('change', { target: { value: 'test' }});
            } 
        });
        
        expect(store.getState().system.systemDialogOpen).toBe(false); // save dialog is open, therefore delete validations passed
    });

    it('Should be able to catch duplicate SKU Number/Size/Color when creating SKUs', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);

        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('input').forEach((node) => {
            const { id, type } = node.props();
            if (id && id.indexOf('variant') > -1 && type === 'text') {
                node.simulate('change', { target: { value: 'test' }});
            } 
        });

        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(false); // save dialog is open, therefore delete validations passed
    });

})