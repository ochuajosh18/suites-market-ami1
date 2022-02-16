import React from 'react';
import { BannerType, VendorType } from '../../../../store/promobanner/types';
import { AutocompleteKeyPair } from '../../../../store/system/types';

// Local Components
import PromoBannerList from './PromoBannerList';
import { 
    PromoBannerPageContainer,
    PromoBannerTypography,
    PromoBannerPageContentContainer,
    PromoBannerTypographyContainer,
    SearchInputContainer
} from './PromoBannerCommonComponents';

// Global Components
import { SymphonyContentLoadingContainer } from '../../../symphony/SymphonyCommonComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';

// Utils
import map from 'lodash/map';

interface PromoBannerPageProps {
    page: 'Home Page' | 'Vendor Page';
    userType: 'ADMIN' | 'VENDOR';
    banners: Array<BannerType>;
    vendors: Array<VendorType>;
    selectedVendor: VendorType | undefined;
    onChangeVendorSearch?: (e: React.ChangeEvent<{}>, value: AutocompleteKeyPair | null) => void;
}

export default (props: PromoBannerPageProps) => {
    return (
        <PromoBannerPageContainer>
            <PromoBannerPageContentContainer>
                {
                    props.page === 'Vendor Page' && props.userType === 'ADMIN' && 
                    <SearchInputContainer>
                        <SymphonyInput
                            id="promobanner-vendor-search-input"
                            type="searchabledropdown"
                            label=""
                            value={typeof props.selectedVendor === 'undefined' ? '' : props.selectedVendor.companyName}
                            autocompleteOptions={map(props.vendors, (p) => ({
                                label: typeof p.companyName === 'undefined' ? '' : p.companyName,
                                value: typeof p.companyName === 'undefined' ? '' : p.companyName
                            }))}
                            placeholder="Select Vendor"
                            onAutocompleteChange={props.onChangeVendorSearch}
                        />
                    </SearchInputContainer>
                }
                <PromoBannerTypographyContainer style={{ paddingTop: 10 }}>
                    <PromoBannerTypography style={{ color: '#959595', fontSize: 14 }} id="promobanner-maximum-text">Maximum of 6 Banners</PromoBannerTypography>
                </PromoBannerTypographyContainer>
                { props.banners.length > 0 ?
                    <PromoBannerList 
                        page={props.page}
                        banners={props.banners}
                        userType={props.userType}
                    /> :
                    <SymphonyContentLoadingContainer 
                        height={props.page === 'Vendor Page' && props.userType === 'ADMIN' ? 'calc(100% - 86px)!important': 'calc(100% - 192px)'}
                    >
                        No Banner Found
                    </SymphonyContentLoadingContainer>
                }
            </PromoBannerPageContentContainer>
        </PromoBannerPageContainer>
    )
}