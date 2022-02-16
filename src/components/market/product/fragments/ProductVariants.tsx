import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { MarketProductMedia, MarketProductState, DynamicMarketProductInput } from '../../../../store/marketproduct/types';
import { setMarketProductState, getProductVariants, getProductVariant, saveProductVariant, uploadVariantMedia, deleteProductVariant, deleteProduct } from '../../../../store/marketproduct/actions';
import { GenericMedia, SystemState } from '../../../../store/system/types';
import { LoginState } from '../../../../store/login/types';
import { setSystemState, resetSystemDialog } from '../../../../store/system/actions';
import { toastWarning } from '../../../../modules/Toast';

// local
import {
    ProductLoadingContainer
} from './ProductComponents';
import VariantCards from './VariantCards';
import VariantView from './VariantView';

// material
import CircularProgress from '@material-ui/core/CircularProgress';

// util
import { v4 } from 'uuid';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

interface ProductVariantsProps {
    getProductVariants: typeof getProductVariants;
    getProductVariant: typeof getProductVariant;
    saveProductVariant: typeof saveProductVariant;
    deleteProductVariant: typeof deleteProductVariant;
    deleteProduct: typeof deleteProduct;
    uploadVariantMedia: typeof uploadVariantMedia;
    setMarketProductState: typeof setMarketProductState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    product: MarketProductState;
    system: SystemState;
    login: LoginState;
}

const EMPTY_VARIANT =({ 
    id: v4(),
    skuNumber: '',
    isActive: false,
    size: '',
    color: '',
    price: '0.00',
    discountPrice: '0.00',
    minBargainPrice: '0.00',
    maxBargainPrice: '0.00',
    minSpecialPrice: '0.00',
    maxSpecialPrice: '0.00',
    media: [] as Array<MarketProductMedia>,
} as unknown) as DynamicMarketProductInput;

class ProductVariants extends React.Component<ProductVariantsProps> {

    componentDidMount = () => {
        const { activeProduct, activeProductVariant, activeProductId } = this.props.product;

        if (activeProduct && activeProductId && activeProductId !== 'new') {
            this.props.getProductVariants(this.props.product.activeProductId);
        }
        else {
            if (!activeProductVariant) {
                this.props.setMarketProductState({
                    activeProductVariant: EMPTY_VARIANT
                });
            }
        }
    }

    _onVariantInput = (field: string, value: string | boolean | Array<GenericMedia>) => {
        const { activeProductVariant } = this.props.product;
        if (activeProductVariant) {

            let newVariant = { ...activeProductVariant, [field]: value };
            if (field === 'discountPrice') {
                newVariant = { ...newVariant, minBargainPrice: '0.00', maxBargainPrice: '0.00', minSpecialPrice: '0.00', maxSpecialPrice: '0.00' }
            }

            if (field === 'minBargainPrice' ) {
                if (parseFloat(value as string)) newVariant = { ...newVariant, maxBargainPrice: `${parseFloat(newVariant.price as string) - 1}.00`  }
                else newVariant = { ...newVariant, maxBargainPrice: '0.00'  }
            }

            if (field === 'minBargainPrice' && parseFloat(value as string) < parseFloat(newVariant.price as string) / 2) {
                newVariant = { ...newVariant, minSpecialPrice: '0.00', maxSpecialPrice: '0.00',  }
            }

            if (field === 'minSpecialPrice') {
                if (parseFloat(value as string)) newVariant = { ...newVariant, maxSpecialPrice: `${parseFloat(newVariant.minBargainPrice as string) - 1}.00`  }
                else newVariant = { ...newVariant, maxSpecialPrice: '0.00'  }
            }

            this.props.setMarketProductState({ 
                activeProductVariant: newVariant
            });
        }
    }

    _onVariantClick = (id: string) => {
        this.props.getProductVariant(id);
    }

    _onAddVariantClick = () => {
        const { activeProduct, activeProductFeaturedSku } = this.props.product;
        if (activeProduct) {
            this.props.setMarketProductState({ 
                activeProductVariant: EMPTY_VARIANT,
                activeProduct: { ...activeProduct, featuredSku: activeProductFeaturedSku }
            });
        }
    }

    _onVariantDelete = (id: string) => {
        const { activeProductId, productVariants, activeProductFeaturedSku } = this.props.product;
        if (productVariants.length !== 1) {
            if (id !== activeProductFeaturedSku) {
                this._triggerDialog(
                    'Confirm Delete', 
                    'Deleting this variant/SKU is permanent. Please click confirm to continue',
                    () => {
                        this.props.deleteProductVariant(id);
                        this.props.resetSystemDialog();
                    },
                    'Confirm'
                );
            }
            else {
                toastWarning("Cannot delete featured variant");
            }
        }
        else {
            this._triggerDialog(
                'Confirm Delete', 
                'Deleting all SKU will also delete the product. Please click confirm to continue',
                () => {
                    this.props.deleteProduct(activeProductId);
                    this.props.resetSystemDialog();
                },
                'Confirm'
            );
        }
    }

    _onVariantMediaDelete = (path: string, fileName?: string) => {
        const { activeProductVariant, mediaToDelete } = this.props.product;
        if (activeProductVariant) {
            let deleteM: Array<GenericMedia> | Array<string> = filter(activeProductVariant.media, (m) => m.path === path);
            deleteM = map(deleteM, (m) => m.path) as Array<string>;
            this.props.setMarketProductState({ 
                activeProductVariant: {
                    ...activeProductVariant,
                    media: filter(activeProductVariant.media, (m) => { 
                        if (m.file && fileName) {
                            return m.file.name !== fileName;
                        }
                        return m.path !== path;
                    })
                },
                mediaToDelete: [...mediaToDelete, ...deleteM]
            });
        }
    }

    _onBackClick = () => {
        const { activeProduct } = this.props.product;
        if (activeProduct) {
            this.props.setMarketProductState({ activeProductVariant: undefined, activeProductFeaturedSku: activeProduct.featuredSku });
        }
    }

    _onFeaturedSkuClick = (id: string) => {
        const { activeProduct } = this.props.product
        if (activeProduct) {
            this.props.setMarketProductState({
                activeProduct: {
                    ...activeProduct
                },
                activeProductFeaturedSku: id === activeProduct.featuredSku && id.indexOf('PRODUCT::SKU') === -1 ? '' : id
            });
        }
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
        const { productVariantsLoading, productVariants, activeProduct, activeProductVariant, activeProductVariantLoading, activeProductFeaturedSku } = this.props.product;
        console.log(this.props.login.user)
        return (
            <>
                {/* Cards Loading */}
                {productVariantsLoading ? 
                    <ProductLoadingContainer>
                        <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }}/>
                    </ProductLoadingContainer>
                : 
                  <>
                    {/* View or List */}
                    {activeProductVariant ?
                        <>
                            {activeProductVariantLoading ?
                                <ProductLoadingContainer>
                                    <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }}/>
                                </ProductLoadingContainer>
                            :
                                <VariantView
                                    featuredSku={activeProductFeaturedSku}
                                    variant={activeProductVariant}
                                    existingVariant={productVariants.length > 0 ? productVariants[0] : undefined}
                                    activeProduct={activeProduct}
                                    onVariantInput={this._onVariantInput.bind(this)}
                                    onDeleteVariantClick={this._onVariantDelete.bind(this)}
                                    onBackClick={this._onBackClick.bind(this)}
                                    onFeaturedSkuClick={this._onFeaturedSkuClick.bind(this)}
                                    onVariantMediaDelete={this._onVariantMediaDelete.bind(this)}
                                    currency={this.props.login.user.currencySign as string}
                                />
                            }
                        </>
                    :
                        <VariantCards
                            productVariants={productVariants}
                            activeProduct={activeProduct}
                            featuredSku={activeProductFeaturedSku}
                            onVariantClick={this._onVariantClick.bind(this)}
                            onAddVariantClick={this._onAddVariantClick.bind(this)}
                            onDeleteVariantClick={this._onVariantDelete.bind(this)}
                        />
                    }
                  </>  
                }
            </>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    product: state.marketproduct,
    system: state.system,
    login: state.login
});

export default connect(mapStateToProps, {
    saveProductVariant,
    getProductVariants,
    getProductVariant,
    setMarketProductState,
    uploadVariantMedia,
    deleteProduct,
    deleteProductVariant,
    setSystemState,
    resetSystemDialog
})(ProductVariants);