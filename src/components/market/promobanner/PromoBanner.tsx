import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppState } from '../../../store';
import { setSystemState } from '../../../store/system/actions';
import { PromoBannerState } from '../../../store/promobanner/types';
import { getHomePageBanners, getAllVendors, getVendorBanners } from '../../../store/promobanner/actions';
import { setPromoBannerState } from '../../../store/promobanner/actions';
import { AutocompleteKeyPair } from '../../../store/accessibility/types';
import { GenericMedia } from '../../../store/system/types';
import { LoginState } from '../../../store/login/types';

// material
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';

// Local Components
import PromoBannerPage from './fragments/PromoBannerPage';

// Global Components
import { 
    SymphonyTab,
    SymphonyTabs,
    SymphonyContainer, 
    SymphonyHeaderButton,
    SymphonyTabsContainer, 
    SymphonyContentContainer,
} from '../../symphony/SymphonyCommonComponents';
import { SYMPHONY_PRIMARY_COLOR } from '../../symphony/Colors';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';

// Utils
import find from 'lodash/find';
import { toastError } from '../../../modules/Toast';

interface PromoBannerProps {
    promobanner: PromoBannerState;
    login: LoginState;
    setSystemState: typeof setSystemState;
    getAllVendors: typeof getAllVendors;
    getVendorBanners: typeof getVendorBanners;
    getHomePageBanners: typeof getHomePageBanners;
    setPromoBannerState: typeof setPromoBannerState;
}

class PromoBanner extends React.PureComponent<PromoBannerProps> {
    searchRef = React.createRef<HTMLInputElement>();    

    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box display="flex">
                    <Box fontSize="36px">
                        Promo Banner
                    </Box>
                </Box>
            ),
            headerEndButton: () => (
                <Link id="nav-home" to="/market/promobanner/new" style={{ display: 'flex', textDecoration: 'none' }} onClick={this._onAddClick.bind(this)}>
                    <div>
                        <SymphonyHeaderButton 
                            id="add-promobanner-btn"
                            startIcon={<AddIcon />}
                            // onClick={this._onAddClick.bind(this)}
                        >
                            Add New
                        </SymphonyHeaderButton>
                    </div>
                </Link>
            ),
        });

        if (this.props.login.user?.userType === 'ADMIN') {
            const { promoBannerTabs, selectedVendor } = this.props.promobanner;
            this.props.getAllVendors();
            if (promoBannerTabs === 'Home Page') this.props.getHomePageBanners();
            if (promoBannerTabs === 'Vendor Page' && selectedVendor) {
                this.props.getVendorBanners(selectedVendor.id)
            } else {
                this.props.setPromoBannerState({
                    banners: []
                })
            }
        } else {
            this.props.getVendorBanners(this.props.login.user.id)
        }
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });
    
    _onAddClick = (event) => {
        const { banners, promoBannerTabs, selectedVendor, activePromoBanner } = this.props.promobanner;
        if (banners.length < 6) {
            if (promoBannerTabs === 'Vendor Page' && !selectedVendor && this.props.login.user.userType === 'ADMIN') {
                event.preventDefault();
                toastError('Select a vendor before adding a banner')
                return;
            }
            this.props.setSystemState({
                shallRedirect: true,
                redirectTo: '/market/promobanner/new'
            });
            let bannerImage : GenericMedia = { name: '', path: '', type: '', size: 0 };
            if (activePromoBanner) {
                bannerImage = {
                    ...activePromoBanner.bannerImage,
                    ...bannerImage,
                }
                if (typeof bannerImage.file !== 'undefined') delete bannerImage.file;
            }
            this.props.setPromoBannerState({
                activePromoBanner: {
                    bannerName: '',
                    bannerType: 'Scheduled',
                    bannerStatus: true,
                    bannerStartDate: '',
                    bannerEndDate: '',
                    bannerIsNoExpiration: false,
                    bannerTitle: '',
                    bannerImage,
                    bannerSelectedCategory: [],
                    bannerDateUpdated: undefined
                }
            })
            return;
        } 
        event.preventDefault();
        toastError('Maximum of 6 banners');
    }

    _onChangeVendor = (e: React.ChangeEvent<{}>, value: AutocompleteKeyPair | null) => {
        const selectedVendor = find(this.props.promobanner.vendors, { companyName: value?.value });
        if(selectedVendor) {
            this.props.setPromoBannerState({
                selectedVendor
            })
            this.props.getVendorBanners(selectedVendor.id);
        }
    }

    _onClickHomePageTab = () => {
        this.props.setPromoBannerState({ 
            promoBannerTabs : 'Home Page',
            selectedVendor: undefined
        });
        this.props.getHomePageBanners();
    }

    _onClickVendorPageTab = () => {
        this.props.setPromoBannerState({ promoBannerTabs : 'Vendor Page' })
        if (this.props.login.user?.userType === 'ADMIN') {
            const { selectedVendor } = this.props.promobanner;
            if (selectedVendor) {
                this.props.getVendorBanners(selectedVendor.id);
            } else {
                this.props.setPromoBannerState({ banners: [] })
            }
        } else {
            // CALL GET VENDOR BANNERS using user id
        }
    }

    render() {
        const { promoBannerTabs, promoBannerLoading } = this.props.promobanner;
        const { access } = this.props.login.user;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyTabsContainer>
                        <SymphonyTabs 
                            value={access.includes('VIEW::HOME_BANNER') ? promoBannerTabs : 'Vendor Page'}
                            TabIndicatorProps={{ style: { height: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                        >
                            {access.includes('VIEW::HOME_BANNER') &&
                                <SymphonyTab 
                                    id="promobanner-homepage-tab"
                                    label="Home Page" 
                                    value="Home Page" 
                                    onClick={this._onClickHomePageTab.bind(this)} 
                                />
                            }
                            {access.includes('VIEW::VENDOR_BANNER') &&
                                <SymphonyTab 
                                    id="promobanner-vendorpage-tab"
                                    label="Vendor Page" 
                                    value="Vendor Page" 
                                    onClick={this._onClickVendorPageTab.bind(this)} 
                                />
                            }
                        </SymphonyTabs>
                    </SymphonyTabsContainer>
                    <SymphonyContentContainer>
                        {
                            promoBannerLoading ? <SymphonyContentLoading /> :
                            <PromoBannerPage 
                                banners={this.props.promobanner.banners}
                                userType={this.props.login.user.userType}
                                vendors={this.props.promobanner.vendors}
                                page={this.props.promobanner.promoBannerTabs}
                                selectedVendor={this.props.promobanner.selectedVendor}
                                onChangeVendorSearch={this._onChangeVendor.bind(this)}
                            />
                        }
                    </SymphonyContentContainer>
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
    getAllVendors,
    getVendorBanners,
    getHomePageBanners,
    setPromoBannerState
})(PromoBanner);