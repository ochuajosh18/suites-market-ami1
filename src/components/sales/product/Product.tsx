import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/';
import { BasicProductState, DynamicBasicProductInput } from '../../../store/basicproduct/types';
import { setBasicProductState, getProducts } from '../../../store/basicproduct/actions';
import { setSystemState } from '../../../store/system/actions';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import ProductCardList from './fragments/ProductCardList';
// local components
import {
    ProductsContainer,
    ProductsContentContainer,
    ProductsTabsContainer,
    ProductLoadingContainer,
    AddProductButton
} from './fragments/ProductComponents';
// common components
import {
    SalesField,
    SalesTabs,
    SalesTab
} from '../../Basic/Common/BasicCommonComponents';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material components
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import Search from '@material-ui/icons/Search';

// util
import debounce from 'lodash/debounce';

interface ProductProps {
    setSystemState: typeof setSystemState;
    setBasicProductState: typeof setBasicProductState;
    getProducts: typeof getProducts;
    product: BasicProductState;
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

class Product extends React.Component<ProductProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.getProducts('list', searchString, this.props.product.activeTab === 'Active');
    }, 300, { leading: false });

    componentDidMount = () => {
        // set button
        this.props.setSystemState({
            headerEndButton: () => (
                <div>
                    <AddProductButton 
                        id="add-product-btn"
                        startIcon={<AddIcon />}
                        onClick={this._onAddClick.bind(this)}
                    >
                        Add New
                    </AddProductButton>
                </div>
            ),
            shallRedirect: false,
            redirectTo: ''
        });
        this.props.getProducts('list', '', this.props.product.activeTab === 'Active');
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onTabChange = (tab: 'Active' | 'Inactive') => {
        const { current } = this.searchRef;
        this.props.setBasicProductState({ activeTab: tab as string });
        this.props.getProducts('list', '', tab === 'Active');
        
        // reset search value when changing tabs
        if (current) {
            current.value = '';
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this._search(e.target.value)
    }

    _onAddClick = () => {
        this.props.setBasicProductState({
            activeProductId: 'new',
            activeProduct: EMPTY_PRODUCT,
            productVariants: []
        });

        this.props.setSystemState({
            shallRedirect: true,
            redirectTo: '/sales/product/new'
        });
    }

    render() {
        const { activeTab, products, productListLoading } = this.props.product;
        return (
            <SymphonyLayout>
                <ProductsContainer>
                    <ProductsTabsContainer>
                        <SalesTabs 
                            value={activeTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SalesTab 
                                id="product-active-tab"
                                label="Active" 
                                value="Active" 
                                onClick={this._onTabChange.bind(this, 'Active')} 
                            />
                            <SalesTab 
                                id="product-inactive-tab"
                                label="Inactive" 
                                value="Inactive" 
                                onClick={this._onTabChange.bind(this, 'Inactive')} 
                            />
                        </SalesTabs>
                        <SalesField 
                            id="product-search-fld"
                            style={{ marginBottom: 8, width: 300 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                </InputAdornment>
                            }}
                            inputProps={{ ref: this.searchRef }}
                            onChange={this._onSearch.bind(this)}
                            placeholder="Search"
                        />
                    </ProductsTabsContainer>
                    <ProductsContentContainer>
                        {!productListLoading ?
                            <>
                                {products.length > 0 ?
                                    <ProductCardList
                                        products={products}
                                    />
                                :
                                    <ProductLoadingContainer>No Product Found</ProductLoadingContainer>
                                }
                            </>
                            :
                            <ProductLoadingContainer>
                                <CircularProgress style={{ color: SYMPHONY_PRIMARY_COLOR }}/>
                            </ProductLoadingContainer>
                        }
                    </ProductsContentContainer>
                </ProductsContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    product: state.basicproduct
});

export default connect(mapStateToProps, {
    setBasicProductState,
    setSystemState,
    getProducts
})(Product);