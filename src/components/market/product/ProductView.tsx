import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { MarketProductState, DynamicMarketProductInput, MarketProductSku } from '../../../store/marketproduct/types';
import { 
    setMarketProductState, 
    getProduct, 
    saveMarketProduct, 
    deleteProduct, 
    saveProductVariant,
    loadCategories
} from '../../../store/marketproduct/actions';
import { SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { toastWarning } from '../../../modules/Toast';

// local components
import {
    ProductViewContainer,
    ProductHeaderButton,
    ProductLoadingContainer
} from './fragments/ProductComponents';
import CommonInformation from './fragments/CommonInformation';
import ProductVariants from './fragments/ProductVariants';

// common components
import {
    SymphonyTabs,
    SymphonyTab,
    SymphonyTabsContainer
}  from '../../symphony/SymphonyCommonComponents';
import BackButton  from '../../symphony/SymphonyBackButton';
import SalesLayout from '../../Basic/Common/BasicLayout';

// material
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// util
import { stringValidator } from '../../../utils/validators';
import find from 'lodash/find';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

interface MatchParams {
    params: { productId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface ProductViewProps {
    getProduct: typeof getProduct;
    deleteProduct: typeof deleteProduct;
    saveProductVariant: typeof saveProductVariant;
    loadCategories: typeof loadCategories;
    setSystemState: typeof setSystemState;
    setMarketProductState: typeof setMarketProductState;
    resetSystemDialog: typeof resetSystemDialog;
    saveMarketProduct: typeof saveMarketProduct;
    product: MarketProductState;
    system: SystemState;
}

const EMPTY_PRODUCT = {
    name: '',
    brand: '',
    material: '',
    type: '',
    description: '',
    h1: '',
    h2: '',
    h3: ''
} as unknown as DynamicMarketProductInput;

class ProductView extends React.Component<ProductViewProps & RouteParams> {

    componentDidMount = () => {
        const { productId } = this.props.match.params;
        const product = find(this.props.product.products, { id: productId });
        this.props.setSystemState({
            header: (
                <Box display="flex">
                    <BackButton to="/market/product" />
                    <Box fontSize="36px">
                        {product ?
                            <>{product.name}{product.isActive}</>
                        :
                            <>{productId !== 'new' ? 'Loading Product...' : 'New Product'}</>
                        }
                    </Box>
                </Box>
            ),
            headerEndButton: <Box>
                <ProductHeaderButton onClick={this._onSaveClick.bind(this)}>
                    Save
                </ProductHeaderButton>
            </Box>,
            shallRedirect: false,
            redirectTo: ''
        });

        this.props.loadCategories();
        
        if (productId !== 'new') {
            this.props.getProduct(productId); // get active product
        }
        else {
            this.props.setMarketProductState({ activeProduct: EMPTY_PRODUCT, productViewActiveTab: 'Common Information' });
        }
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onTabChange = (tab: 'Common Information' | 'Variants') => this.props.setMarketProductState({ productViewActiveTab: tab as string });

    _onActiveProductInput = (field: string, value: string | number | boolean) => {
        const { activeProduct } = this.props.product    ;
        if (activeProduct) {
            let newProduct = { ...activeProduct, [field]: value };
            if (field === 'h1') newProduct = { ...newProduct, h2: '', h3: '' };
            if (field === 'h2') newProduct = { ...newProduct, h3: '' };
            this.props.setMarketProductState({ activeProduct: newProduct });
        }
    }

    _onSaveClick = () => {
        const { activeProduct, productViewActiveTab, activeProductVariant, products } = this.props.product;
        if (activeProduct) {
            const { id, name, description, brand, type, h1, material } = activeProduct;
            if (productViewActiveTab === 'Variants' && !activeProductVariant) {
                // nothing to save
                toastWarning('Select a variant to update'); 
                return; 
            }

            if (productViewActiveTab === 'Common Information' || typeof id === 'undefined') {  
                const existing = find(products, (p) => stringValidator(p.name) === stringValidator(name));
                if (existing && existing.id !== id) { toastWarning('Product name already exist'); return false; } // existing product name validation
                // common info validation

                if (!name) { toastWarning('Missing Product Name'); return; }
                if (!brand) { toastWarning('Missing Brand'); return; }
                if (!material) { toastWarning('Missing Material'); return; }
                if (!type) { toastWarning('Missing Type'); return; }
                if (!description) { toastWarning('Missing Description'); return; }
                if (!h1) { toastWarning('Missing Level 1 Category'); return; }

                if (typeof id === 'undefined') {
                    if (activeProductVariant) {
                        // validate variant
                        if (!this._validateVariant(activeProductVariant)) {
                            return;
                        }
                    }
                    else { toastWarning('Missing Product Variant'); return; }
                }
            }
            else {
                if (activeProductVariant) {
                    // validate variant
                    if (!this._validateVariant(activeProductVariant)) {
                        return;
                    }
                }
            }

            // if existing product and updating SKU, trigger SKU update immediately
            if (typeof id !== 'undefined' && id.indexOf('PRODUCT') > -1 && productViewActiveTab === 'Variants' && activeProductVariant) {
                // sku upsert only
                this._triggerDialog(
                    'Confirm Save',
                    'Please note that any changes are permanent. To continue, please click the save button.',
                    () => {
                        this.props.saveProductVariant();
                        this.props.resetSystemDialog();
                    }
                )
            }
            else {
                // product based update
                this._triggerDialog(
                    'Confirm Save', 
                    'Please note that any changes are permanent. To continue, please click the save button.',
                    () => {
                        this.props.saveMarketProduct();
                        this.props.resetSystemDialog();
                        if (typeof id !== 'undefined') {
                            this.props.setSystemState({
                                header: <Box display="flex">
                                    <BackButton to="/market/product" />
                                    <Box fontSize="36px">
                                        {activeProduct.name}
                                    </Box>
                                </Box>
                            });
                        }
                    }
                );
            }
        }
    }

    _validateVariant = (activeProductVariant: MarketProductSku) => {
        const { productVariants } = this.props.product;
        if (activeProductVariant) {
            const { id, skuNumber, size, unit, color, price, media, marketStock, discountPrice, minBargainPrice, maxBargainPrice, minSpecialPrice, maxSpecialPrice } = activeProductVariant;
            if (!skuNumber) { toastWarning('Missing Variant SKU Number'); return false }
            const existingSku = find(productVariants, (v) => stringValidator(v.skuNumber) === stringValidator(skuNumber));
            if (existingSku && existingSku.id !== id) { toastWarning('SKU Number already exist'); return false }
            if (!unit) { toastWarning('Missing Variant Unit'); return false; }

            // existing product specific validations
            if (id && id.indexOf('PRODUCT::SKU') === -1 && productVariants.length > 0) {
                if (productVariants[0].size && productVariants[0].color && (!size && !color)) { toastWarning('Size and color are both required'); return false; } 
                if (productVariants[0].size && !productVariants[0].color && (!size)) { toastWarning('Missing Variant Size'); return false; } 
                if (!productVariants[0].size && productVariants[0].color && (!color)) { toastWarning('Missing Variant Color'); return false; } 

                // color and size validation for new products
                const existingSize = find(productVariants, (v) => v.size && stringValidator(v.size) === stringValidator(size)) as MarketProductSku | undefined;
                if (existingSize && existingSize.size.trim() === size.trim() && ((stringValidator(existingSize.color as string) && stringValidator(existingSize.color as string) === stringValidator(color as string)) || !existingSize.color)) { toastWarning('Size already exist'); return false }
                const existingColor = find(productVariants, (v) => v.color && stringValidator(v.color as string) === stringValidator(color as string)) as MarketProductSku | undefined;
                if (existingColor && stringValidator(existingColor.color as string) === stringValidator(color as string) && (existingColor.size && stringValidator(existingColor.size) === stringValidator(size))) { toastWarning('Color already exist'); return false }
            }
            else {  
                if (!size && !color) { toastWarning('Missing Variant Size/Color'); return false; }
                // color and size validation
                const existingSize = find(productVariants, (v) => v.size && stringValidator(v.size) === stringValidator(size) && id !== v.id) as MarketProductSku | undefined;
                if (existingSize && (!existingSize.color || (stringValidator(existingSize.color as string) && stringValidator(existingSize.color as string) === stringValidator(color as string)))) { toastWarning('Size already exist'); return false }
                const existingColor = find(productVariants, (v) => v.color && stringValidator(v.color as string) === stringValidator(color as string) && id !== v.id) as MarketProductSku | undefined;
                if (existingColor && (!existingColor.size || (stringValidator(existingColor.size) === stringValidator(size)))) { toastWarning('Color already exist'); return false }
            }


            if (!marketStock) { toastWarning('Missing Variant Stock'); return false; }

            const p = parseFloat(price as string);
            const dp = parseFloat(discountPrice as string);
            const minbp = parseFloat(minBargainPrice as string);
            const maxbp = parseFloat(maxBargainPrice as string);
            const minsp = parseFloat(minSpecialPrice as string);
            const maxsp = parseFloat(maxSpecialPrice as string);

            if (!p) { toastWarning('Missing/Invalid Display Price'); return false; }
            if (dp && dp >= p) { toastWarning('Discount price must be less than display price'); return false; }
            if (minbp && minbp < (p / 2)) { toastWarning('Please check the minimum bargain price'); return false; }
            // if ((minbp && !maxbp) || (maxbp && maxbp > p)) { toastWarning('Please check the maximum bargain price'); return false; }
            // if (maxbp && maxbp > (p - 1)) { toastWarning('Please check the maximum bargain price'); return false; }
            if (minbp > maxbp) { toastWarning('Minimum bargain price should be less than the maximum special price'); return false; }
            if (minsp && (minsp >= maxsp || minsp < (p / 2))) { toastWarning('Please check the minimum special price'); return false; }
            // if ((minsp && !maxsp) || (maxsp && maxsp > p)) { toastWarning('Please check the maximum special price'); return false; }
            // if (maxsp && maxsp !== (p - 1)) { toastWarning('Please check the maximum special price'); return false; }
            if (minsp > maxsp) { toastWarning('Minimum special price should be less than the maximum special price'); return false; }

            let mediaValid = false;
            for (const m of media) {
                if (m.type.indexOf('image') > -1) {
                    mediaValid = true;
                    break;
                }
            }
            if (!mediaValid) { toastWarning('Missing Variant Image'); return false; }
            let mediaUploaded = true;
            for (const m of media) {
                if (typeof m.loading !== 'undefined' && m.loading) {
                    mediaUploaded = false;
                }
            }
            
            if (!mediaUploaded) { toastWarning('Media is still uploading'); return false; }
        }
        return true;
    }

    _onDeleteClick = (id: string) => {
        this._triggerDialog(
            'Confirm Delete', 
            'Deleting this product is permanent. Please click confirm to continue',
            () => {
                this.props.deleteProduct(id);
                this.props.resetSystemDialog();
            },
            'Confirm'
        );
    }

    _triggerDialog = (title: string, content: string, action: () => void, overrideTitle?: string) => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: title,
            systemOverrideTitle: overrideTitle,
            systemDialogContent: content,
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: action
        })
    }

    render() {
        const { activeProduct, productViewActiveTab, productViewLoading, tierOneCategories, tierTwoCategories, tierThreeCategories } = this.props.product;
        return (
            <SalesLayout>
                 <SymphonyTabsContainer>
                    <SymphonyTabs 
                        value={productViewActiveTab}
                        TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                    >
                        <SymphonyTab 
                            id="product-commoninfo-tab"
                            label="Common Information" 
                            value="Common Information" 
                            onClick={this._onTabChange.bind(this, 'Common Information')}
                        />
                        <SymphonyTab 
                            id="product-variants-tab"
                            label="Variants" 
                            value="Variants"
                            onClick={this._onTabChange.bind(this, 'Variants')}
                        />
                    </SymphonyTabs>
                </SymphonyTabsContainer>
                {productViewLoading ? 
                    <ProductLoadingContainer>
                        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }}/>
                    </ProductLoadingContainer>
                : 
                    <ProductViewContainer>
                        {productViewActiveTab === 'Common Information' && activeProduct ?
                            <CommonInformation 
                                product={activeProduct}
                                onCommonInformationInput={this._onActiveProductInput.bind(this)}
                                tierOneCategories={tierOneCategories}
                                tierTwoCategories={tierTwoCategories}
                                tierThreeCategories={tierThreeCategories}
                                onDeleteClick={this._onDeleteClick.bind(this)}
                            />
                        :
                            <ProductVariants />
                        }
                    </ProductViewContainer>
                }
            </SalesLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    product: state.marketproduct,
    system: state.system
});

export default withRouter(connect(mapStateToProps, {
    getProduct,
    deleteProduct,
    saveProductVariant,
    loadCategories,
    setSystemState,
    setMarketProductState,
    resetSystemDialog,
    saveMarketProduct
})(ProductView));