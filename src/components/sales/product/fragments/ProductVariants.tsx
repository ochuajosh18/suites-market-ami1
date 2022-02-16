import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { BasicProductMedia, BasicProductState, DynamicBasicProductInput } from '../../../../store/basicproduct/types';
import { setBasicProductState, getProductVariants, getProductVariant, saveProductVariant, uploadVariantMedia, deleteProductVariant} from '../../../../store/basicproduct/actions';
import { GenericMedia, SystemState } from '../../../../store/system/types';
import { setSystemState, resetSystemDialog } from '../../../../store/system/actions';
import { toastWarning } from '../../../../modules/Toast';

// local
import {
    ProductLoadingContainer
} from './ProductComponents';
import VariantCards from './VariantCards';
import VariantView from './VariantView';

import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// util
import { v4 } from 'uuid';
import filter from 'lodash/filter';
import map from 'lodash/map';

interface ProductVariantsProps {
    getProductVariants: typeof getProductVariants;
    getProductVariant: typeof getProductVariant;
    saveProductVariant: typeof saveProductVariant;
    deleteProductVariant: typeof deleteProductVariant;
    uploadVariantMedia: typeof uploadVariantMedia;
    setBasicProductState: typeof setBasicProductState;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    product: BasicProductState;
    system: SystemState;
}

const EMPTY_VARIANT =({ 
    id: v4(),
    skuNumber: '',
    isActive: false,
    size: '',
    color: '',
    price: '',
    media: [] as Array<BasicProductMedia>
} as unknown) as DynamicBasicProductInput;

class ProductVariants extends React.Component<ProductVariantsProps> {

    componentDidMount = () => {
        const { activeProductVariant, activeProductId } = this.props.product;
        if (activeProductId && activeProductId !== 'new') {
            this.props.getProductVariants(this.props.product.activeProductId);
        }
        else {
            if (!activeProductVariant) {
                this.props.setBasicProductState({
                    activeProductVariant: EMPTY_VARIANT
                });
            }
        }
        this.props.setBasicProductState({ isDuplicating: false });
    }

    _onVariantInput = (field: string, value: DynamicBasicProductInput) => {
        const { activeProductVariant } = this.props.product;
        if (activeProductVariant) {
            let newVariant = { ...activeProductVariant, [field]: value };

            if (field === 'minPrice' ) {
                if (parseFloat(value as string)) newVariant = { ...newVariant, maxPrice: `${parseFloat(newVariant.price as string) - 1}.00`  }
                else newVariant = { ...newVariant, maxPrice: '0.00', maxSpecialPrice: undefined, minSpecialPrice: undefined  }
            }

            if (field === 'maxPrice' && parseFloat(value as string) < parseFloat(newVariant.price as string) / 2) {
                newVariant = { ...newVariant, minSpecialPrice: '0.00', maxSpecialPrice: '0.00',  }
            }

            if (field === 'minSpecialPrice') {
                if (parseFloat(value as string)) newVariant = { ...newVariant, maxSpecialPrice: `${parseFloat(newVariant.minPrice as string) - 1}.00`  }
                else newVariant = { ...newVariant, maxSpecialPrice: '0.00'  }
            }
            this.props.setBasicProductState({ 
                activeProductVariant: newVariant
            });
        }
    }

    _onVariantClick = (id: string) => {
        this.props.getProductVariant(id)
    }

    _onAddVariantClick = () => {
        const { activeProduct, activeProductFeaturedSku } = this.props.product;
        if (activeProduct) {
            this.props.setBasicProductState({ 
                activeProductVariant: EMPTY_VARIANT,
                activeProduct: { ...activeProduct, featuredSku: activeProductFeaturedSku }
            });
        }
    }

    _onVariantDelete = (id: string) => {
        const { productVariants, activeProductFeaturedSku } = this.props.product;
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
            toastWarning("Cannot delete all product variants");
        }
    }

    _onVariantMediaDelete = (path: string, fileName?: string) => {
        const { activeProductVariant, mediaToDelete } = this.props.product;
        if (activeProductVariant) {
            let deleteM: Array<GenericMedia> | Array<string> = filter(activeProductVariant.media, (m) => m.path === path && typeof m.file === 'undefined');
            deleteM = map(deleteM, (m) => m.path) as Array<string>;
            this.props.setBasicProductState({ 
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
        this.props.setBasicProductState({ activeProductVariant: undefined });
    }

    _onFeaturedSkuClick = (id: string) => {
        const { activeProduct } = this.props.product
        if (activeProduct) {
            this.props.setBasicProductState({
                activeProduct: {
                    ...activeProduct,
                    featuredSku: id
                }
            });
        }
    }

    _onDuplicateVariantClick = (id: string) => {
        this.props.getProductVariant(id, true);
        this.props.setBasicProductState({ isDuplicating: true });
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
        const { productVariantsLoading, productVariants, activeProduct, activeProductVariant, isDuplicating, activeProductVariantLoading, activeProductFeaturedSku, variantFields, variantSections } = this.props.product;
        return (
            <Box>
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
                                    featuredSku={activeProduct ? activeProduct.featuredSku : ''}
                                    variant={activeProductVariant}
                                    activeProduct={activeProduct}
                                    existingVariant={productVariants.length > 0 ? productVariants[0] : undefined}
                                    variantCount={productVariants.length}
                                    fields={variantFields}
                                    sections={variantSections}
                                    onVariantInput={this._onVariantInput.bind(this)}
                                    onDeleteVariantClick={this._onVariantDelete.bind(this)}
                                    onBackClick={this._onBackClick.bind(this)}
                                    onFeaturedSkuClick={this._onFeaturedSkuClick.bind(this)}
                                    onVariantMediaDelete={this._onVariantMediaDelete.bind(this)}
                                    isDuplicating={isDuplicating}
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
                            onDuplicateVariantClick={this._onDuplicateVariantClick.bind(this)}
                        />
                    }
                  </>  
                }
            </Box>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    product: state.basicproduct,
    system: state.system
});

export default connect(mapStateToProps, {
    saveProductVariant,
    getProductVariants,
    getProductVariant,
    setBasicProductState,
    uploadVariantMedia,
    deleteProductVariant,
    setSystemState,
    resetSystemDialog
})(ProductVariants);