import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { BasicProductState, DynamicBasicProductInput, BasicProductSku } from '../../../store/basicproduct/types';
import { 
    setBasicProductState, 
    getProduct, 
    saveSalesProduct, 
    deleteProduct, 
    saveProductVariant,
    loadCategories
} from '../../../store/basicproduct/actions';
import { SystemState } from '../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { toastWarning } from '../../../modules/Toast';
import { fieldsValid } from '../../../utils/fields';

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
    SymphonyTab, 
    SymphonyTabs, 
    SymphonyTabsContainer
}  from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import BackButton  from '../../symphony/SymphonyBackButton';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// util
import { stringValidator } from '../../../utils/validators';
import find from 'lodash/find';

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
    setBasicProductState: typeof setBasicProductState;
    resetSystemDialog: typeof resetSystemDialog;
    saveSalesProduct: typeof saveSalesProduct;
    product: BasicProductState;
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
} as unknown as DynamicBasicProductInput;

class ProductView extends React.Component<ProductViewProps & RouteParams> {

    componentDidMount = () => {
        const { productId } = this.props.match.params;
        const product = find(this.props.product.products, { id: productId });
        this.props.setSystemState({
            header: (
                <Box display="flex">
                    <BackButton to="/sales/product" />
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

        if (productId !== 'new') {
            this.props.loadCategories();
            this.props.getProduct(productId); // get active product
        }
        else {
            this.props.loadCategories(true);
            this.props.setBasicProductState({ activeProduct: EMPTY_PRODUCT });
        }
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onTabChange = (tab: 'Common Information' | 'Variants') => this.props.setBasicProductState({ productViewActiveTab: tab as string });

    _onActiveProductInput = (field: string, value: DynamicBasicProductInput) => {
        const { activeProduct } = this.props.product    ;
        if (activeProduct) {
            const newProduct = { ...activeProduct, [field]: value };
            this.props.setBasicProductState({ activeProduct: newProduct });
        }
    }

    _onSaveClick = () => {
        const { activeProduct, productViewActiveTab, activeProductVariant, products, fields } = this.props.product;
        if (activeProduct) {
            const { id, name, h1, h2, h3 } = activeProduct;
            if (productViewActiveTab === 'Variants' && !activeProductVariant) {
                // nothing to save
                toastWarning('Select a variant to update'); 
                return; 
            }

            const existing = find(products, (p) => p.name.toLowerCase() === name.toLowerCase());
            if (existing && existing.id !== id) { toastWarning('Product name already exist'); return false; } // existing product name validation
            if (productViewActiveTab === 'Common Information' || typeof id === 'undefined') {
                // dynamic fields validation
                if (!fieldsValid('', fields, activeProduct)) {
                    this.props.setBasicProductState({ productViewActiveTab: 'Common Information'})
                    return;
                }
            
                // common info validation
                // if (!name) { toastWarning('Missing Product Name'); return; }
                // if (!brand) { toastWarning('Missing Brand'); return; }
                // if (!type) { toastWarning('Missing Type'); return; }
                if (!h1) { toastWarning('Missing Level 1 Category'); return; }
                if (!h2) { toastWarning('Missing Level 2 Category'); return; }
                if (!h3) { toastWarning('Missing Level 3 Category'); return; }


                if (typeof id === 'undefined') {
                    if (activeProductVariant) {
                        // validate variant
                        if (!this._validateVariant(activeProductVariant)) {
                            return;
                        }
                    }
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
                    async () => {
                        this.props.saveSalesProduct();
                        this.props.resetSystemDialog();
                        if (typeof id !== 'undefined') {
                            this.props.setSystemState({
                                header: <Box display="flex">
                                    <BackButton to="/sales/product" />
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

    _validateVariant = (activeProductVariant: BasicProductSku) => {
        const { productVariants, variantFields } = this.props.product;
        if (activeProductVariant) {
            const { id, skuNumber, color, size } = activeProductVariant;
            if (!skuNumber) { toastWarning('Missing Variant SKU Number'); return false }
            const existingSku = find(productVariants, (v) => stringValidator(v.skuNumber) === stringValidator(skuNumber) && v.id !== id);
            if (existingSku) { toastWarning('SKU Number already exist'); return false }

            // existing product specific validations
            if (id && id.indexOf('PRODUCT::SKU') === -1 && productVariants.length > 0) {
                if (productVariants[0].size && productVariants[0].color && (!size && !color)) { toastWarning('Size and color are both required'); return false; } 
                if (productVariants[0].size && !productVariants[0].color && (!size)) { toastWarning('Missing Variant Size'); return false; } 
                if (!productVariants[0].size && productVariants[0].color && (!color)) { toastWarning('Missing Variant Color'); return false; } 

                // color and size validation for new products
                const existingSize = find(productVariants, (v) => v.size && stringValidator(v.size) === stringValidator(size)) as BasicProductSku | undefined;
                if (existingSize && existingSize.size.trim() === size.trim() && ((stringValidator(existingSize.color as string) && stringValidator(existingSize.color as string) === stringValidator(color as string)) || !existingSize.color)) { toastWarning('Size already exist'); return false }
                const existingColor = find(productVariants, (v) => v.color && stringValidator(v.color as string) === stringValidator(color as string)) as BasicProductSku | undefined;
                if (existingColor && stringValidator(existingColor.color as string) === stringValidator(color as string) && (existingColor.size && stringValidator(existingColor.size) === stringValidator(size))) { toastWarning('Color already exist'); return false }
            }
            else {  
                if (!size && !color) { toastWarning('Missing Variant Size/Color'); return false; }
                // color and size validation
                const existingSize = find(productVariants, (v) => v.size && stringValidator(v.size) === stringValidator(size) && id !== v.id) as BasicProductSku | undefined;
                if (existingSize && (!existingSize.color || (stringValidator(existingSize.color as string) && stringValidator(existingSize.color as string) === stringValidator(color as string)))) { toastWarning('Size already exist'); return false }
                const existingColor = find(productVariants, (v) => v.color && stringValidator(v.color as string) === stringValidator(color as string) && id !== v.id) as BasicProductSku | undefined;
                if (existingColor && (!existingColor.size || (stringValidator(existingColor.size) === stringValidator(size)))) { toastWarning('Color already exist'); return false }
            }
            return fieldsValid('variant', variantFields, activeProductVariant);
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
        const { activeProduct, productViewActiveTab, productViewLoading, tierOneCategories, tierTwoCategories, tierThreeCategories, fields, sections } = this.props.product;
        return (
            <SymphonyLayout>
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
                                fields={fields}
                                sections={sections}
                            />
                        :
                            <ProductVariants />
                        }
                    </ProductViewContainer>
                }
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    product: state.basicproduct,
    system: state.system
});

export default withRouter(connect(mapStateToProps, {
    getProduct,
    deleteProduct,
    saveProductVariant,
    loadCategories,
    setSystemState,
    setBasicProductState,
    resetSystemDialog,
    saveSalesProduct
})(ProductView));