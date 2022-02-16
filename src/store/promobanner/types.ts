export interface PromoBanner {
    bannerName: string;
    bannerType: 'Published' | 'Expired' | 'Scheduled',
    bannerStatus: boolean;
    bannerStartDate: string;
    bannerEndDate: string;
    bannerIsNoExpiration: boolean;
    bannerTitle: string;
    bannerImage: GenericMedia;
    bannerSelectedCategory: Array<BannerSelectedCategoryType>;
    bannerDateUpdated?: string;
}

export interface PromoBannerState {
    promoBannerTabs: 'Home Page' | 'Vendor Page';
    promoBannerLoading: boolean;
    banners: Array<BannerType>;
    vendors: Array<VendorType>;
    selectedVendor?: VendorType
    defaultBanner: BannerType | undefined;
    activePromoBanner?: PromoBanner;
    bannerTierOneCategories: Array<HierarchyOne>;
    bannerTierTwoCategories: Array<HierarchyTwo>;
    bannerTierThreeCategories: Array<string>;
    bannerSelectCategoryModalIsOpen: boolean;
    bannerSaveLoading: boolean;
    deleteModalIsOpen: boolean;
    deleteModalIsLoading: boolean;
}

export const SET_PROMO_BANNER_STATE = 'set_promo_banner_state';

export interface PromoBannerInput {
    [name: string]: string | number | boolean | undefined | VendorType | Array<BannerType> | Array<VendorType> | GenericMedia | Array<BannerSelectedCategoryType> | BannerType | PromoBanner
}

export interface GenericMedia {
    id?: string;
    name: string;
    path: string;
    size: number;
    type: string;
    loading?: boolean;
    file?: File;
}
export interface BannerSelectedCategoryType {
    h1: string;
    h2?: string;
    h3?: string;
}

export interface BannerType {
    bannerNumber: number;
    category: Array<BannerCategoryType>;
    endDate: string;
    image: string;
    isActive: boolean;
    name: string;
    startDate: string;
    dateUpdated: string;
}

export interface BannerCategoryType {
    h1: string;
    h2?: string;
    h3?: string;
}

export interface VendorType {
    companyName: string;
    dateCreated: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    mobileNumber: string;
    role: string;
    status: string;
}

export interface HierarchyOne {
    name: string
    h1Thumbnail: {
        name: string;
        path: string;
        size: number;
        type: string;
    },
    h2?: Array<HierarchyTwo>;
}

export interface HierarchyTwo {
    name: string
    h2Thumbnail: {
        name: string;
        path: string;
        size: number;
        type: string;
    },
    h3?: Array<string>;
}

export interface SetPromoBannerStateAction {
    type: typeof SET_PROMO_BANNER_STATE;
    payload: PromoBannerInput
}

export type PromoBannerAction = SetPromoBannerStateAction