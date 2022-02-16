import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { DynamicSalesSalespersonInput, SalespersonFilter, SalespersonState } from '../../../store/salesperson/types';
import { setSalespersonState, loadSalespersonList } from '../../../store/salesperson/actions';
import { AutocompleteKeyPair } from '../../../store/system/types';
import { setSystemState } from '../../../store/system/actions';
import SalespersonCardList from './fragments/SalespersonCardList';
import SalespersonFilters from './fragments/SalespersonFilters';

// symphony components
import {
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyTabsContainer,
    SymphonyTabs,
    SymphonyTab,
    SymphonyField,
    SymphonyHeaderButton,
    SymphonyContentLoadingContainer
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import SymphonyFilter from '../../symphony/SymphonyFilter';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

// util
import debounce from 'lodash/debounce';
import map from 'lodash/map';
import lFilter from 'lodash/filter';

interface SalespersonProps {
    loadSalespersonList: typeof loadSalespersonList;
    setSalespersonState: typeof setSalespersonState;
    setSystemState: typeof setSystemState;
    salesperson: SalespersonState;
}

class Salesperson extends React.Component<SalespersonProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.loadSalespersonList(
            {
                ...this.props.salesperson.activeFilters,
                search: searchString
            }, 
            'list', 
            this.props.salesperson.salespersonListTab === 'Active'
        );
        this.props.setSalespersonState({ salespersonSearch: searchString });
    }, 300, { leading: false });

    componentDidMount = () => {
        this.props.setSystemState({
            headerEndButton: () => (
                <div>
                    <SymphonyHeaderButton 
                        id="add-salesperson-btn"
                        startIcon={<AddIcon />}
                        onClick={this._onAddClick.bind(this)}
                    >
                        Add New
                    </SymphonyHeaderButton>
                </div>
            ),
            shallRedirect: false,
            redirectTo: ''
        });
        this.props.loadSalespersonList();
        this.props.setSalespersonState({ activeFilters: {}, filters: {} });
    }

    componentWillUnmount = () => {
        this.props.setSystemState({ header: undefined, headerEndButton: undefined });
        this.props.setSalespersonState({ activeFilters: {}, filters: {} });
    }

    _onAddClick = () => this.props.setSystemState({
        shallRedirect: true,
        redirectTo: '/sales/salesperson/new'
    });

    _onTabChange = (tab: 'Active' | 'Inactive') => {
        const { current } = this.searchRef;
        this.props.setSalespersonState({ salespersonListTab: tab as string });
        this.props.loadSalespersonList(
            {
                ...this.props.salesperson.activeFilters,
                search: this.props.salesperson.salespersonSearch
            }, 
            'list', 
            this.props.salesperson.salespersonListTab !== 'Active'
        );
        
        // reset search value when changing tabs
        if (current) {
            current.value = '';
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onFilterInput = (key: string, value: DynamicSalesSalespersonInput) => {
        this.props.setSalespersonState({
            filters: { ...this.props.salesperson.filters, [key]: value } as Partial<SalespersonFilter>
        });
    }

    _onFilterApply = () => {
        const { filters, salespersonSearch } = this.props.salesperson;
        this.props.setSalespersonState({ activeFilters: filters });
        this.props.loadSalespersonList(
            {
                ...filters,
                search: salespersonSearch
            }, 
            'list', 
            this.props.salesperson.salespersonListTab === 'Active'
        );
    }

    _onFilterRemove = (key: string, filter: string | Array<string> | number | AutocompleteKeyPair | undefined) => {
        const { activeFilters, salespersonSearch } = this.props.salesperson;
        if (Array.isArray(activeFilters[key])) {
            let newFilter: typeof activeFilters = { };
            if (activeFilters[key] && typeof activeFilters[key]![0] === 'object') {
                // keypair
                newFilter = { ...activeFilters, [key]: lFilter(activeFilters[key] as Array<AutocompleteKeyPair>, (f) => f.value !== (filter as AutocompleteKeyPair).value) }
            }
            else {
                newFilter = { ...activeFilters, [key]: lFilter(activeFilters[key] as Array<string>, (f: string) => f !== filter) }
            }
            this.props.setSalespersonState({ activeFilters: newFilter, filters: newFilter });
            this.props.loadSalespersonList(
                {
                    ...newFilter,
                    search: salespersonSearch
                }, 
                'list', 
                this.props.salesperson.salespersonListTab === 'Active'
            );
        }
        else {
            let dF = activeFilters;
            delete dF[key];
            this.props.setSalespersonState({ activeFilters: dF, filters: dF });
            this.props.loadSalespersonList(
                {
                    ...dF,
                    search: salespersonSearch
                }, 
                'list', 
                this.props.salesperson.salespersonListTab === 'Active'
            );
        }
    }

    _onFilterReset = () => {
        this.props.setSalespersonState({ activeFilters: {}, filters: {} });
        this.props.loadSalespersonList(
            {
                search: this.props.salesperson.salespersonSearch
            }, 
            'list', 
            this.props.salesperson.salespersonListTab === 'Active'
        );
    }

    render() {
        const { salespersons, salespersonListTab, salespersonListLoading, activeFilters, filters } = this.props.salesperson;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={salespersonListTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab
                                id="salesperson-active-tab"
                                label="Active"
                                value="Active"
                                onClick={this._onTabChange.bind(this, 'Active')}
                            />
                            <SymphonyTab
                                id="salesperson-inactive-tab"
                                label="Inactive"
                                value="Inactive"
                                onClick={this._onTabChange.bind(this, 'Inactive')}
                            />
                        </SymphonyTabs>
                        <SymphonyField 
                            id="salesperson-search-fld"
                            style={{ marginBottom: 8, width: 300 }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                    <Search htmlColor="#4D89F5" />
                                </InputAdornment>
                            }}
                            inputProps={{ ref: this.searchRef }}
                            onChange={this._onSearch.bind(this)}
                            placeholder="Search"
                        />
                    </SymphonyTabsContainer>
                    <SymphonyContentContainer flexDirection="column">
                         <SymphonyFilter
                            filters={filters}
                            activeFilters={activeFilters}
                            dataLength={salespersons.length}
                            onFilterApply={this._onFilterApply.bind(this)}
                            onRemoveFilter={this._onFilterRemove.bind(this)}
                            onReset={this._onFilterReset.bind(this)}
                        >
                            <SalespersonFilters 
                                filter={filters}
                                onFilterInput={this._onFilterInput.bind(this)}
                                salespersons={map(this.props.salesperson.salespersons, (s) => ({ label: s.name as string, value: s.name as string }))}
                            />
                        </SymphonyFilter>
                        {salespersonListLoading ? <SymphonyContentLoading /> :
                            <>
                                {salespersons.length > 0 ? 
                                    <SalespersonCardList
                                        salespersons={salespersons}
                                    />
                                :
                                    <SymphonyContentLoadingContainer>No Salesperson Found</SymphonyContentLoadingContainer>
                                }
                            </>
                        }
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    salesperson: state.salesperson,
    system: state.system
});

export default connect(mapStateToProps, {
    loadSalespersonList,
    setSalespersonState,
    setSystemState
})(Salesperson);