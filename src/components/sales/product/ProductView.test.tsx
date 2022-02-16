import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { SET_BASIC_PRODUCT_STATE, BasicProduct, BasicProductSku } from '../../../store/basicproduct/types';
import basicproduct from '../../../store/basicproduct/reducers';
import system from '../../../store/system/reducers';
import ProductView from './ProductView';

const createTestStore = () => {
    return createStore(
        combineReducers({
            basicproduct,
            system
        }),
        applyMiddleware(thunk)
    );
}

const setup = (store: ReturnType<typeof createTestStore>, existing = false) => {
    let wrapper = mount(
        <Provider store={store}>
            <MemoryRouter initialEntries={existing ? ['/sales/product/PRODUCT::TEST'] : [ '/sales/product/new' ]} >
                <Route path="/sales/product/:productId" component={ProductView} />
            </MemoryRouter>
        </Provider>
    )
    return wrapper;
}

const mockedFields = [
    {
        name: 'test',
        title: 'test',
        row: 0,
        type: 'Input Text',
        section: 'Test Section',
        isRequired: false
    },
    {
        name: 'name',
        title: 'Product Name',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'type',
        title: 'Type',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'brand',
        title: 'Brand',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'color',
        title: 'Color',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    },
    {
        name: 'size',
        title: 'Size',
        row: 0,
        type: 'Input Text',
        isRequired: false,
        section: 'Test Section'
    }
];

const setupForAddingProduct = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {

    store.dispatch({
        type: SET_BASIC_PRODUCT_STATE,
        payload: {
            sections: ['Test Section'],
            fields: mockedFields,
            variantFields: mockedFields,
            variantSections: ['Test Section'],
            activeProductId: 'new',
            productViewLoading: false
        }
    });

    wrapper.update();

    // simulate input for all common information inputs
    wrapper.find('input').forEach((node) => {
        const { id, type, disabled } = node.props();
        if (!disabled) {
            if (id && type === 'text') {
                node.simulate('change', { target: { value: 'testtwo' }});
            }
        }
    });

    store.dispatch({
        type: SET_BASIC_PRODUCT_STATE,
        payload: {
            activeProduct: { 
                ...store.getState().basicproduct.activeProduct, 
                description: '<p>test</p>',
                h1: 'test',
                h2: 'test',
                h3: 'test'
            } as Partial<BasicProduct>
        }
    });

    // add a single variant
    wrapper.find('#product-variants-tab').at(0).simulate('click');
    wrapper.update();
    // simulate input for variant details
    wrapper.find('input').forEach((node) => {
        const { id, type, disabled } = node.props();
        if (!disabled) {
            if (id && type === 'text') {
                if (id.indexOf('price') > -1 || id.toLowerCase().indexOf('stock') > -1) {
                    node.simulate('change', { target: { value: '100' }}).simulate('blur');
                }
                else {
                    node.simulate('change', { target: { value: 'test' }});
                }
            }
        }
    });

    store.dispatch({
        type: SET_BASIC_PRODUCT_STATE,
        payload: {
            activeProductVariant: { 
                ...store.getState().basicproduct.activeProductVariant, 
                skuNumber: 'test',
                size: 'test',
                color: 'test',
                price: '10',
                isActive: true,
                media: [{ path: '/test.png', name: 'test.png', size: 0, type: 'image/png' }]
            } as BasicProductSku
        }
    });
}

const setupForSkuCrud = (wrapper: ReturnType<typeof setup>, store: ReturnType<typeof createTestStore>) => {
    store.dispatch({
        type: SET_BASIC_PRODUCT_STATE,
        payload: {
            activeProduct: { ...store.getState().basicproduct.activeProduct, id: 'PRODUCT::TEST', name: 'testprod' },
            activeProductId: 'PRODUCT::TEST',
            productVariantsLoading: false,
            activeProductVariant: undefined,
            productViewLoading: false,
            productViewActiveTab: 'Variants',
            sections: ['Test Section'],
            fields: mockedFields,
            variantFields: mockedFields,
            variantSections: ['Test Section'],
        }
    });

    // add a single variant
    wrapper.find('#product-variants-tab').at(0).simulate('click');
    wrapper.update();

    store.dispatch({
        type: SET_BASIC_PRODUCT_STATE,
        payload: {
            productVariantsLoading: false,
            productVariants: [{ id: 'test', skuNumber: 'test', size: 'test', price: 10, discountPrice: 20, mainSku: false, media: [] }],
        }
    });
    wrapper.update();
}

describe('Sales Product CRUD', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to add or update a product with proper validation and module fields integration', async () => {
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
            type: SET_BASIC_PRODUCT_STATE,
            payload: {
                products: [{ name: 'testexisting', id: 'testid' }],
                activeProduct: { ...store.getState().basicproduct.activeProduct, name: 'testexisting', id: 'testidtwo' }
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
            type: SET_BASIC_PRODUCT_STATE,
            payload: {
                activeProduct: { ...store.getState().basicproduct.activeProduct, id: 'PRODUCT::TEST' },
                sections: ['Test Section'],
                fields: mockedFields,
                productViewLoading: false
            }
        });
        wrapper.update();
        
        const AuxButton = wrapper.find('#sales-aux-button').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#product-delete-btn").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true); // save dialog is open, therefore delete validations passed
    });

});

describe('Sales Product SKU CRUD', () => {
    let store: ReturnType<typeof createTestStore>;

    it('Should be able to add/update SKU with proper validations and module fields integration', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('input').forEach((node) => {
            const { id, type } = node.props();
            if (id && type === 'text') {
                node.simulate('change', { target: { value: 'testtwo' }});
            } 
        });

        store.dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: {
                activeProductVariant: { 
                    ...store.getState().basicproduct.activeProductVariant, 
                    isActive: true,
                    price: '10.00'
                } as BasicProductSku
            }
        });
        
        const SaveBtn = mount(store.getState().system.headerEndButton as JSX.Element);
        SaveBtn.find('button').at(0).simulate('click');

        expect(store.getState().system.systemDialogOpen).toBe(false); // missing media, do not allow saving

        store.dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: {
                activeProductVariant: { 
                    ...store.getState().basicproduct.activeProductVariant, 
                    marketStock: '1',
                    size: 'test123',
                    color: 'test',
                    skuNumber: 'testtwo123',
                    media: [{ path: '/test.png', name: 'test.png', size: 0, type: 'image/png' }]
                } as BasicProductSku
            }
        });

        
        SaveBtn.find('button').at(0).simulate('click');
        expect(store.getState().system.systemDialogOpen).toBe(true); // with media, do allow saving
    });


    // Incompatible with module fields
    // it('Should be able to delete media for an existing/new SKU', async () => {
    //     store = createTestStore();
    //     const wrapper = setup(store); // your wrapped component by enzyme
    //     setupForSkuCrud(wrapper, store);

    //     wrapper.find('#product-variant-add-btn').at(0).simulate('click');
    //     wrapper.find('input').forEach((node) => {
    //         const { id, type } = node.props();
    //         if (id && id.indexOf('variant') > -1 && type === 'text') {
    //             node.simulate('change', { target: { value: 'test' }});
    //         } 
    //     });

    //     store.dispatch({
    //         type: SET_BASIC_PRODUCT_STATE,
    //         payload: {
    //             activeProductVariant: { 
    //                 ...store.getState().basicproduct.activeProductVariant, 
    //                 skuNumber: 'test123',
    //                 stock: '0',
    //                 isActive: true,
    //                 price: '10',
    //                 media: [
    //                     { path: '/test.png', name: 'test.png', size: 0, type: 'image/png' },
    //                     { path: '/test2.png', name: 'test2.png', size: 0, type: 'image/png' }
    //                 ]
    //             } as BasicProductSku
    //         }
    //     });

    //     wrapper.update();
    //     const MediaDeleteBtn = wrapper.find('#delete-media-_test_png').at(0);
    //     MediaDeleteBtn.simulate('click');
    //     const { activeProductVariant } = store.getState().basicproduct;
    //     expect(activeProductVariant!.media).toHaveLength(1) // expect media to be reduced
    // });

    it('Should be able to delete a product variant', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        store.dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: {
                activeProduct: { ...store.getState().basicproduct.activeProduct, id: 'PRODUCT::TEST' },
                activeProductId: 'PRODUCT::TEST',
                productVariantsLoading: false,
                activeProductVariant: undefined,
                productViewLoading: false,
                productViewActiveTab: 'Variants'
            }
        });
        
        wrapper.find('#product-variants-tab').at(0).simulate('click');

        store.dispatch({
            type: SET_BASIC_PRODUCT_STATE,
            payload: {
                productVariantsLoading: false,
                productVariants: [{ id: 'test', skuNumber: 'test', mainSku: false, media: [] }, { id: 'test2', skuNumber: 'test', mainSku: false, media: [] }],
            }
        });
        wrapper.update();

        const AuxButton = wrapper.find('.variants-aux-btn').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#product-variant-delete-test").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(true); // save dialog is open, therefore delete validations passed
    });

    it('Should not be able to delete the product variant when deleting the last variant', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);

        const AuxButton = wrapper.find('.variants-aux-btn').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DeleteButton = wrapper.find("#aux-popover").at(0).find("#product-variant-delete-test").at(0);
        DeleteButton.simulate('click');
        
        expect(store.getState().system.systemDialogOpen).toBe(false); // save dialog is open, therefore delete validations passed
    });

    it('Should be able to add/update SKU with size only', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('#size-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});

        expect(store.getState().basicproduct.activeProductVariant!.size).toEqual('testsize');
    });

    it('Should be able to add/update SKU with color only', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('#color-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});

        expect(store.getState().basicproduct.activeProductVariant!.color).toEqual('testsize');
    });

    it('Should be able to add/update SKU with both size and color', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);
        wrapper.find('#product-variant-add-btn').at(0).simulate('click');
        wrapper.find('#size-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});
        wrapper.find('#color-input').at(0).find('input').at(0).simulate('change', { target: { value: 'testsize' }});

        expect(store.getState().basicproduct.activeProductVariant!.size).toEqual('testsize');
        expect(store.getState().basicproduct.activeProductVariant!.color).toEqual('testsize');
    });

    it('Should be able to duplicate a variant', () => {
        store = createTestStore();
        const wrapper = setup(store, true);
        setupForSkuCrud(wrapper, store);

        const AuxButton = wrapper.find('.variants-aux-btn').at(0);
        AuxButton.simulate('click');
        
        // click the button with trash icon
        const DuplicateButton = wrapper.find("#aux-popover").at(0).find("#product-variant-duplicate-test").at(0);
        DuplicateButton.simulate('click');
        
        expect(store.getState().basicproduct.isDuplicating).toBe(true); 
    });
})