import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { setPromoBannerState, getAllCategories, addBanner, deleteBanner, updateBanner } from '../../../store/promobanner/actions';
import { BannerSelectedCategoryType, PromoBannerState } from '../../../store/promobanner/types';
import { GenericMedia } from '../../../store/system/types';
import { LoginState } from '../../../store/login/types';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// LocalComponents
import PromoBannerInformation from './fragments/PromoBannerInformation';
import PromoBannerCategoryModal from './fragments/PromoBannerCategoryModal';
import DeleteModal from './fragments/DeleteModal';
import { PromoBannerSaveLoading } from './fragments/PromoBannerCommonComponents';

// Global Components
import { 
    SymphonyContainer,
    SymphonyContentContainer,
    SymphonyHeaderButton
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import BackButton  from '../../symphony/SymphonyBackButton';

// Utils
import moment from 'moment';
import find from 'lodash/find';
import { toastError } from '../../../modules/Toast';

interface MatchParams {
    params: { bannerNumber: string };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface PromoBannerViewProps {
    setSystemState: typeof setSystemState;
    setPromoBannerState: typeof setPromoBannerState;
    getAllCategories: typeof getAllCategories;
    addBanner: typeof addBanner;
    deleteBanner: typeof deleteBanner;
    updateBanner: typeof updateBanner;
    resetSystemDialog: typeof resetSystemDialog;
    promobanner: PromoBannerState;
    login: LoginState;
}

class PromoBannerView extends React.PureComponent<PromoBannerViewProps & RouteParams> {
    componentDidMount = () => {
        // Fetch All Categories
        this.props.getAllCategories();
        
        // Set activePromoBanner to default values if new else set the activePromoBanner with the banner details
        const { bannerNumber } = this.props.match.params;
        if(bannerNumber !== 'new') {
            const banner = find(this.props.promobanner.banners, (b) => b.bannerNumber === parseInt(bannerNumber));

            if (banner) {
                const start = moment(banner.startDate, 'YYYY-MM-DD');
                const end = moment(banner.endDate, 'YYYY-MM-DD');
                const currentDate = moment().format('YYYY-MM-DD');

                const bannerType = !banner.startDate && !banner.endDate ? 'Published' : moment(start).isAfter(currentDate) ? 'Scheduled' : moment().isBetween(start, end) ? 'Published' : moment(start).isSame(currentDate) ? 'Published' : 'Expired';

                this.props.setPromoBannerState({
                    activePromoBanner: {
                        bannerName: banner.name,
                        bannerType,
                        bannerStatus: banner.isActive,
                        bannerStartDate: banner.startDate,
                        bannerEndDate: banner.endDate,
                        bannerIsNoExpiration: !banner.startDate && !banner.endDate ? true : false,
                        bannerTitle: banner.name,
                        bannerImage: { name: '', type: '', size: 0, path: banner.image },
                        bannerSelectedCategory: banner.category,
                        bannerDateUpdated: banner.dateUpdated
                    }
                })

                this.props.setSystemState({
                    header: (
                        <Box display="flex" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box display="flex" style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                <BackButton to="/market/promobanner" />
                                <Box style={{ flexWrap: 'nowrap' }}>
                                    <Typography noWrap style={{ fontSize: 36 }}>
                                        {banner?.name}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box style={{
                                backgroundColor: bannerType === 'Published' ? '#C1F7DF' : bannerType === 'Scheduled' ? '#DEE9FF'  : '#f58c8c', 
                                height: 25, 
                                paddingRight: 15, 
                                paddingLeft: 15,
                                borderRadius: 12,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Typography style={{ fontSize: 10, color: bannerType === 'Published' ? '#00AD4C' : bannerType === 'Scheduled' ? '#4C89F5'  : '#f52f2f', fontWeight: 'bold' }}>{bannerType.toUpperCase()}</Typography>
                            </Box>
                        </Box>
                    ),
                    headerEndButton: <Box height="54px">
                        <SymphonyHeaderButton 
                            id="add-customer-btn"
                            onClick={this._onClickUpdateBannerSaveButton.bind(this)}
                        >
                            Save
                        </SymphonyHeaderButton>
                    </Box>,
                    shallRedirect: false,
                    redirectTo: ''
                });
            }
        } else {
            this.props.setSystemState({
                header: (
                    <Box display="flex" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Box display="flex" style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <BackButton to="/market/promobanner" />
                            <Box style={{ flexWrap: 'nowrap' }}>
                                <Typography noWrap style={{ width: 300, fontSize: 30 }}>
                                    New Promo Banner
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ),
                headerEndButton: <Box>
                    <SymphonyHeaderButton 
                        id="add-customer-btn"
                        onClick={this._onClickNewBannerSaveButton.bind(this)}
                        disabled={this.props.promobanner.bannerSaveLoading}
                    >
                        {
                            this.props.promobanner.bannerSaveLoading ? <PromoBannerSaveLoading size="small" /> : <>Save</>
                        }
                    </SymphonyHeaderButton>
                </Box>,
                shallRedirect: false,
                redirectTo: ''
            });
        }
    }

    componentWillUnmount = () => {
        this.props.setPromoBannerState({
            activePromoBanner: undefined
        });
        this.props.setSystemState({ header: undefined, headerEndButton: undefined });
    }

    _onClickUpdateBannerSaveButton = () => {
        const { activePromoBanner } = this.props.promobanner;
        
        if (activePromoBanner) {
            if (!activePromoBanner.bannerName) {
                toastError('Missing banner name');
                return true;
            }
            if (activePromoBanner.bannerSelectedCategory.length <= 0) {
                toastError('Atleast one category is required');
                return true;
            }
    
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Confirm Save',
                systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemDialogConfirmAction: () => { 
                    this.props.updateBanner(this.props.match.params.bannerNumber);
                    this.props.resetSystemDialog();
                }
            });
        }
    }

    _onClickNewBannerSaveButton = () => {
        const { activePromoBanner } = this.props.promobanner;

        if (activePromoBanner) {
            if (!activePromoBanner.bannerName) {
                toastError('Missing banner name');
                return true;
            }
            if (activePromoBanner.bannerSelectedCategory.length <= 0) {
                toastError('Atleast one category is required');
                return true;
            }
            if (typeof activePromoBanner.bannerImage.file === 'undefined') {
                toastError('Missing banner image');
                return true;
            }
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Confirm Save',
                systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemDialogConfirmAction: () => { 
                    this.props.addBanner();
                    this.props.resetSystemDialog();
                }
            });
        }
    }

    _onChangePromoBannerInput = (field: string, value: string | number | boolean | GenericMedia) => {
        if (field === 'deleteModalIsOpen') {
            this.props.setPromoBannerState({ [field] : value });
            return true;
        }
        const { activePromoBanner } = this.props.promobanner;
        if (activePromoBanner && (field === 'startDate' || field === 'endDate')) { // For Promobanner date range
            value = moment(value as string, 'DD/MM/YYYY').format('YYYY-MM-DD');
            if (field === 'startDate') {
                const currentDate = moment().format('YYYY-MM-DD');

                let newActivePromoBanner = {
                    ...activePromoBanner
                }

                if (moment(value).isAfter(currentDate)) {
                    newActivePromoBanner = { ...newActivePromoBanner, bannerStatus: false }
                } else if (moment(value).isSame(currentDate)) {
                    newActivePromoBanner = { ...newActivePromoBanner, bannerStatus: true }
                }

                this.props.setPromoBannerState({ activePromoBanner : { ...newActivePromoBanner, bannerStartDate: value } });
                return;
            } 
            this.props.setPromoBannerState({ activePromoBanner: { ...activePromoBanner, bannerEndDate: value } });
            return;
        } 

        if (activePromoBanner) {
            if (field === 'bannerIsNoExpiration') {
                if (!value) {
                    const currentDate = moment().format('YYYY-MM-DD');
                    this.props.setPromoBannerState({ activePromoBanner: { ...activePromoBanner, [field] : value as boolean, bannerStartDate: currentDate, bannerEndDate: currentDate } });
                    return;
                }
                this.props.setPromoBannerState({ activePromoBanner: { ...activePromoBanner, [field] : value as boolean, bannerStartDate: '', bannerEndDate: '', bannerStatus: true } });
                return;
            } 
            this.props.setPromoBannerState({ activePromoBanner: { ...activePromoBanner, [field] : value } });
            return true;
        }
    }

    _addToSelectedCategory = (selectedCategory: Array<BannerSelectedCategoryType>) => {
        if (this.props.promobanner.activePromoBanner) {
            this.props.setPromoBannerState({
                activePromoBanner: {
                    ...this.props.promobanner.activePromoBanner,
                    bannerSelectedCategory: [
                        ...selectedCategory
                    ]
                }
            })
        }
    }

    _onPressCategoryInput = () => {
        this.props.setPromoBannerState({
            bannerSelectCategoryModalIsOpen: true
        })
    }

    _onDeleteBanner = () => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Confirm Save',
            systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemDialogConfirmAction: () => { 
                this.props.deleteBanner(this.props.match.params.bannerNumber);
                this.props.resetSystemDialog();
            }
        });
    }

    render() {
        const { 
            activePromoBanner,
            bannerTierOneCategories,
            bannerSelectCategoryModalIsOpen
        } = this.props.promobanner;

        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer>
                        <PromoBannerInformation 
                            activePromoBanner={activePromoBanner}
                            promoBannerTabs={this.props.promobanner.promoBannerTabs}
                            userType={this.props.login.user.userType}
                            vendorName={this.props.promobanner.selectedVendor ? this.props.promobanner.selectedVendor.companyName : ''} 
                            onPromoBannerInput={this._onChangePromoBannerInput.bind(this)}
                            onPressCategoryInput={this._onPressCategoryInput.bind(this)}
                            onPressDeleteIcon={this._onDeleteBanner.bind(this)}
                        />
                    </SymphonyContentContainer>
                    { activePromoBanner &&
                        <PromoBannerCategoryModal 
                            open={bannerSelectCategoryModalIsOpen}
                            tierOneCategories={bannerTierOneCategories}
                            selectedCategory={activePromoBanner.bannerSelectedCategory}
                            addToSelectedCategory={this._addToSelectedCategory.bind(this)}
                            onPressCloseModal={() => this.props.setPromoBannerState({ bannerSelectCategoryModalIsOpen : false })}
                        />
                    }
                    <DeleteModal 
                        modalDeleteIsOpen={this.props.promobanner.deleteModalIsOpen}
                        onPressCancelButton={() => this.props.setPromoBannerState({ deleteModalIsOpen: false }) }
                        onPressDeleteButton={this._onDeleteBanner.bind(this)}
                        loading={this.props.promobanner.deleteModalIsLoading}
                    />
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        promobanner: state.promobanner,
        login: state.login
    }
}

export default connect(mapStateToProps, {
    setSystemState,
    getAllCategories,
    setPromoBannerState,
    addBanner,
    deleteBanner,
    updateBanner,
    resetSystemDialog
})(PromoBannerView);