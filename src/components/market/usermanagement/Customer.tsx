import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { UserManagementFilter, UserManagementState } from '../../../store/usermanagement/types';
import { loadCustomerList, setUserManagementState } from '../../../store/usermanagement/actions';
import { SortOrder } from '../../../store/system/types';
import { setSystemState } from '../../../store/system/actions';
import CustomerCardList from './fragments/CustomerCardList';


// Global Components
import { 
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyField,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import Box from '@material-ui/core/Box';
import Search from '@material-ui/icons/Search';

// util
import debounce from 'lodash/debounce';

interface CustomerProps {
    loadCustomerList: typeof loadCustomerList;
    setSystemState: typeof setSystemState;
    setUserManagementState: typeof setUserManagementState;
    usermanagement: UserManagementState;
}

class Customer extends React.PureComponent<CustomerProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        const { activeFilters, activeSort, activeSortOrder } = this.props.usermanagement;
        this.props.loadCustomerList(searchString, { ...activeFilters, order: activeSortOrder, orderBy: activeSort });
    }, 300, { leading: false });

    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" marginBottom="10px">
                    <Box>
                        Customer
                    </Box>
                    <Box>
                        <SymphonyField 
                            id="customer-search-fld"
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
                    </Box>
                </Box>
            )
        })
        this.props.loadCustomerList('');
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onSortClick = (sort: string, order: SortOrder) => {
        let query: Partial<UserManagementFilter> = { ...this.props.usermanagement.activeFilters };
        const activeSort = !order ? '' : sort;
        this.props.setUserManagementState({ activeSort, activeSortOrder: order as string });
        if (activeSort && order) { 
            this.props.loadCustomerList(
                this.props.usermanagement.search, 
                { 
                    ...this.props.usermanagement.activeFilters, 
                    orderBy: sort,
                    order: order as string
                }
            ); // with filter
        }
        else {
            this.props.loadCustomerList(this.props.usermanagement.search, query); // no filter
        }
    }

    render() {
        const { customers, userListLoading, activeSort, activeSortOrder } = this.props.usermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer>
                        <CustomerCardList
                            customers={customers}
                            activeSort={activeSort}
                            activeSortOrder={activeSortOrder}
                            onSortClick={this._onSortClick.bind(this)}
                            loading={userListLoading}
                        />
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    usermanagement: state.usermanagement,
    system: state.system
});

export default connect(mapStateToProps, {
    loadCustomerList,
    setUserManagementState,
    setSystemState
})(Customer);