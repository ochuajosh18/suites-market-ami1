import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/';
import { SymphonyEntityListTab, SystemState } from '../../../store/system/types';
import { DistributorState } from '../../../store/distributor/types';
import { setDistributorState, getDistributors } from '../../../store/distributor/actions';
import { setSystemState } from '../../../store/system/actions';

// // local
import DistributorCardList from './fragments/DistributorCardList';
// import DistributorFilters from './fragments/DistributorFilters';

// symphony components
import {
    SymphonyHeaderButton,
    SymphonyHeaderAuxButton,
    SymphonyContainer,
    SymphonyTabsContainer,
    SymphonyContentContainer,
    SymphonyTabs,
    SymphonyTab,
    SymphonyField,
    SymphonyContentLoadingContainer
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';
// import SymphonyFilter from '../../symphony/SymphonyFilter';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

// util
import debounce from 'lodash/debounce';
// import lFilter from 'lodash/filter';
// import map from 'lodash/map';

interface DistributorProps {
    getDistributors: typeof getDistributors;
    setDistributorState: typeof setDistributorState;
    setSystemState: typeof setSystemState;
    distributor: DistributorState;
    system: SystemState;
}

class Distributor extends React.Component<DistributorProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        this.props.getDistributors(undefined, {
            ...this.props.distributor.activeFilters,
            isActive: this.props.distributor.activeTab === 'Active',
            search: searchString
        });
        this.props.setDistributorState({ search: searchString });
    }, 300, { leading: false });

    _headerEndButton = () => (
        <Box display="flex" justifyContent="center">
            <SymphonyHeaderAuxButton 
                endIcon={<Icon className="fas fa-file-import" />}
                // onClick={this._onResetClick.bind(this)}
            >
                Import
            </SymphonyHeaderAuxButton>
            <SymphonyHeaderButton 
                id="add-distributor-btn"
                startIcon={<AddIcon />}
                onClick={this._onAddClick.bind(this)}
            >
                Add New
            </SymphonyHeaderButton>
        </Box>
    )

    componentDidMount = () => {
        // set header
        this.props.setSystemState({
            headerEndButton: this._headerEndButton,
            shallRedirect: false,
            redirectTo: ''
        });

        this.props.getDistributors(undefined, {
            ...this.props.distributor.activeFilters,
            isActive: true
        });
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onTabChange = (tab: SymphonyEntityListTab) => {
        const { current } = this.searchRef;
        this.props.setDistributorState({ activeTab: tab });
        this.props.getDistributors(undefined, {
            ...this.props.distributor.activeFilters,
            isActive: tab === 'Active'
        });
        
        // reset search value when changing tabs
        if (current) {
            current.value = '';
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onAddClick = () => this.props.setSystemState({
        shallRedirect: true,
        redirectTo: '/sales/distributor/new'
    });

    render () {
        const { activeTab, distributorListLoading, distributors } = this.props.distributor;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={activeTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab 
                                id="distributor-active-tab"
                                label="Active" 
                                value="Active" 
                                onClick={this._onTabChange.bind(this, 'Active')} 
                            />
                            <SymphonyTab 
                                id="distributor-inactive-tab"
                                label="Inactive" 
                                value="Inactive" 
                                onClick={this._onTabChange.bind(this, 'Inactive')} 
                            />
                        </SymphonyTabs>
                        <SymphonyField 
                            id="distributor-search-fld"
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
                    </SymphonyTabsContainer>
                    <SymphonyContentContainer flexDirection="column">
                        {distributorListLoading ? <SymphonyContentLoading /> :
                            <>
                                {distributors.length > 0 ?
                                    <>
                                       <DistributorCardList
                                            distributors={distributors}
                                       />
                                    </>
                                :
                                    <SymphonyContentLoadingContainer>No Distributor Found</SymphonyContentLoadingContainer>
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
    distributor: state.distributor,
    system: state.system
});

export default connect(mapStateToProps, {
    getDistributors,
    setDistributorState,
    setSystemState
})(Distributor);