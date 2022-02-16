import React from 'react';
import { BannerType } from '../../../../store/promobanner/types';

// Local Components
import BannerCard from './BannerCard';
import { PromoBannerGrid, PromoBannerListContainer, PromoBannerGridContainer  } from './PromoBannerCommonComponents';

interface PromoBannerListProps {
    banners: Array<BannerType>;
    page: 'Vendor Page' | 'Home Page';
    userType: 'ADMIN' | 'VENDOR';
}

export default (props: PromoBannerListProps) => {
    return (
        <PromoBannerListContainer style={{ flex: 1, height: props.page === 'Vendor Page' && props.userType === 'ADMIN' ? 'calc(100% - 278px)!important': 'calc(100% - 192px)' }}>
            <PromoBannerGridContainer container>
                {props.banners.map((tile) => (
                    <PromoBannerGrid key={`${tile.bannerNumber}`} item xs={4} style={{ borderWidth: 1, borderColor: 'white', borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: 240, marginBottom: 20 }}>
                        <BannerCard 
                            bannerNumber={tile.bannerNumber} 
                            name={tile.name}
                            startDate={tile.startDate}
                            endDate={tile.endDate}
                            image={tile.image}
                            subTitle={tile.name}
                        />
                    </PromoBannerGrid>
                ))}
            </PromoBannerGridContainer>
        </PromoBannerListContainer>
    )
}