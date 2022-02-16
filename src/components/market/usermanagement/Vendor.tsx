import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { UserManagementFilter, UserManagementState } from '../../../store/usermanagement/types';
import { loadVendor, loadVendorList, setUserManagementState, updateVendorStatus } from '../../../store/usermanagement/actions';
import { setSystemState } from '../../../store/system/actions';
import VendorCardList from './fragments/VendorCardList';
import VendorApprovalDialog from './fragments/VendorApprovalDialog';


// Global Components
import { 
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyTabsContainer,
    SymphonyTabs,
    SymphonyTab,
    SymphonyField,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import { toastError } from '../../../modules/Toast';

// material
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

// util
import debounce from 'lodash/debounce';
import { SortOrder } from '../../../store/system/types';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';

interface VendorProps {
    loadVendorList: typeof loadVendorList;
    setSystemState: typeof setSystemState;
    setUserManagementState: typeof setUserManagementState;
    updateVendorStatus: typeof updateVendorStatus;
    loadVendor: typeof loadVendor;
    usermanagement: UserManagementState;
}

class Vendor extends React.PureComponent<VendorProps> {
    searchRef = React.createRef<HTMLInputElement>();
    _search = debounce((searchString: string) => {
        const { vendorTab, activeSortOrder, activeSort, activeFilters } = this.props.usermanagement
        this.props.loadVendorList(
            searchString, 
            vendorTab, 
            {
                ...activeFilters, 
                orderBy: activeSort,
                order: activeSortOrder
            }
        );
    }, 300, { leading: false });

    componentDidMount = () => {
        this.props.loadVendorList('', this.props.usermanagement.vendorTab);
    }

    _onTabChange = (tab: 'Approved' | 'Pending' | 'Rejected') => {
        const { current } = this.searchRef;
        this.props.setUserManagementState({ vendorTab: tab as string });
        this.props.loadVendorList('', tab);
        // reset search value when changing tabs
        if (current) {
            current.value = '';
        }
    }

    _setVendorStatusUpdate = (status: string, vendorId: string) => {
        this.props.loadVendor(vendorId)
        this._onToggleModal(true)
        this.props.setUserManagementState({ vendorStatusUpdate: status as string })
    }

    _onToggleModal = (open: boolean) => {
        this.props.setUserManagementState({ modalVisible: open as boolean, vendorRemarksUpdate: '' })
    };

    _onChangeStatusField = (remarks: string) => {
        this.props.setUserManagementState({ vendorRemarksUpdate: remarks as string})
    }

    _onStatusUpdateSave = async () => {
        const { vendorStatusUpdate, vendorRemarksUpdate, vendorDetails } = this.props.usermanagement;
        if(!vendorRemarksUpdate || vendorStatusUpdate === "") {
            toastError('Remarks is required')
        }
        else {
            if(vendorDetails) {
                this._onToggleModal(false);
                await this.props.updateVendorStatus(vendorStatusUpdate, vendorRemarksUpdate, vendorDetails);
                this.props.loadVendorList('', 'Pending');
            }
        }
    }

    _onSearch = (e: React.ChangeEvent<HTMLInputElement>) => this._search(e.target.value);

    _onSortClick = (sort: string, order: SortOrder) => {
        let query: Partial<UserManagementFilter> = { ...this.props.usermanagement.activeFilters };
        const activeSort = !order ? '' : sort;
        this.props.setUserManagementState({ activeSort, activeSortOrder: order as string });
        if (activeSort && order) { 
            this.props.loadVendorList(
                this.props.usermanagement.search, 
                this.props.usermanagement.vendorTab,
                { 
                    ...this.props.usermanagement.activeFilters, 
                    orderBy: sort,
                    order: order as string
                }
            ); // with filter
        }
        else {
            this.props.loadVendorList(this.props.usermanagement.search,  this.props.usermanagement.vendorTab, query); // no filter
        }
    }

    render() {
        const { vendors, vendorTab, userListLoading, activeSort, activeSortOrder, vendorDetails, modalVisible, vendorStatusUpdate, vendorRemarksUpdate, statusLoading } = this.props.usermanagement;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={vendorTab}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            <SymphonyTab
                                id="vendor-pending-tab"
                                label="Pending"
                                value="Pending"
                                onClick={this._onTabChange.bind(this, 'Pending')}
                            />
                            <SymphonyTab
                                id="vendor-approved-tab"
                                label="Approved"
                                value="Approved"
                                onClick={this._onTabChange.bind(this, 'Approved')}
                            />
                            <SymphonyTab
                                id="vendor-disapproved-tab"
                                label="Rejected"
                                value="Rejected"
                                onClick={this._onTabChange.bind(this, 'Rejected')}
                            />
                        </SymphonyTabs>
                        <SymphonyField 
                            id="vendor-search-fld"
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
                    <SymphonyContentContainer>
                        <VendorCardList
                            vendors={vendors}
                            tab={vendorTab}
                            setVendorStatusUpdate={this._setVendorStatusUpdate.bind(this)}
                            activeSort={activeSort}
                            activeSortOrder={activeSortOrder}
                            onSortClick={this._onSortClick.bind(this)}
                            loading={userListLoading}
                        />
                    </SymphonyContentContainer>
                    {
                        vendorDetails &&
                            <VendorApprovalDialog
                                open={modalVisible}
                                vendor={vendorDetails}
                                onClose={this._onToggleModal.bind(this, false)}
                                statusUpdate={vendorStatusUpdate}
                                vendorRemarksUpdate={vendorRemarksUpdate}
                                onChangeStatusField={this._onChangeStatusField.bind(this)}
                                statusUpdateSave={this._onStatusUpdateSave.bind(this)}
                                statusLoading={statusLoading}
                            />
                    }
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
    loadVendorList,
    setUserManagementState,
    setSystemState,
    updateVendorStatus,
    loadVendor
})(Vendor);