import React from 'react';
import { PromoBanner } from '../../../../store/promobanner/types';
import { GenericMedia } from '../../../../store/system/types';
import { toastError } from '../../../../modules/Toast';

// Material UI
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';

// Local Components
import { 
    PromoBannerGrid, 
    AddInputContainer, 
    PromoBannerInputMainContainer,
    PromoBannerDateContainer,
    PromoBannerCheckBoxInputContainer,
    PromoBannerSubHeader,
    PromoBannerHeader,
    RightInputContainer,
    RightMainInputContainer,
    PromoBannerRightContainer,
    PromoBannerHeaderContainer,
    PromoBannerHeaderMainContainer,
    DecoratedPopoverButton
} from './PromoBannerCommonComponents';
import PromoBannerDatePicker from './PromoBannerDatePicker';
import PromoBannerCheckBox from './PromoBannerCheckBox';
import PromoBannerImage from './PromoBannerImage';
import PromoBannerCategoryInput from './PromoBannerCategoryInput';
import MarketAuxMenu from '../../common/MarketAuxMenu';

// Global Components
import SymphonyInput from '../../../symphony/SymphonyInput';

// Utils
import moment from 'moment';
import includes from 'lodash/includes';

interface PromoBannerInformationProps {
    activePromoBanner?: PromoBanner;
    promoBannerTabs: 'Vendor Page' | 'Home Page';
    userType: 'ADMIN' | 'VENDOR';
    vendorName: string; 
    onPromoBannerInput: (field: string, value: string | number | boolean | GenericMedia) => void;
    onPressCategoryInput: () => void;
    onPressDeleteIcon: () => void;
}

const PromoBannerInformation = (props: PromoBannerInformationProps ) => {
    return (
        <PromoBannerGrid container style={{ height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            {props.activePromoBanner &&
                <>
                    <PromoBannerGrid item xs={3} style={{ paddingTop: 80, display: 'flex', justifyContent: 'center' }}>
                        <PromoBannerInputMainContainer>
                            <AddInputContainer>
                                <SymphonyInput 
                                    id="promobanner-crud-status-select"
                                    type="select"
                                    label="Status"
                                    value={props.activePromoBanner.bannerStatus ? 'Active' : 'Inactive'}
                                    selectOptions={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
                                    selectOnchange={(e: React.ChangeEvent< { value: unknown } >) => {}}
                                    disabled
                            />
                            </AddInputContainer>
                            <PromoBannerDateContainer>
                                <PromoBannerDatePicker 
                                    startDate={!props.activePromoBanner.bannerStartDate ? moment().format('DD/MM/YYYY') as string : moment(props.activePromoBanner.bannerStartDate, 'YYYY-MM-DD').format('DD/MM/YYYY') as string}
                                    endDate={!props.activePromoBanner.bannerEndDate ? moment().format('DD/MM/YYYY') as string : moment(props.activePromoBanner.bannerEndDate, 'YYYY-MM-DD').format('DD/MM/YYYY') as string}
                                    onChangeDate={(property: 'startDate' | 'endDate', value: string) => {
                                        props.onPromoBannerInput(property as string, value)
                                    }}
                                    disableStartDate={props.activePromoBanner.bannerIsNoExpiration}
                                    disableEndDate={props.activePromoBanner.bannerIsNoExpiration}
                                />
                            </PromoBannerDateContainer>
                            <PromoBannerCheckBoxInputContainer>
                                <PromoBannerCheckBox 
                                    label="No Expiration"
                                    isChecked={props.activePromoBanner.bannerIsNoExpiration}
                                    onClick={(checked: boolean) => props.onPromoBannerInput('bannerIsNoExpiration', checked)}
                                />
                            </PromoBannerCheckBoxInputContainer>
                        </PromoBannerInputMainContainer>
                    </PromoBannerGrid>
                    <PromoBannerGrid item xs={9}>
                        <PromoBannerRightContainer>
                            <PromoBannerHeaderMainContainer>
                                <PromoBannerHeaderContainer>
                                    <PromoBannerHeader>Banner Information</PromoBannerHeader>
                                    {
                                        props.activePromoBanner.bannerDateUpdated &&
                                        <PromoBannerSubHeader>Last edited on {props.activePromoBanner.bannerDateUpdated}</PromoBannerSubHeader>
                                    }
                                </PromoBannerHeaderContainer>
                                <MarketAuxMenu>
                                    <DecoratedPopoverButton
                                        id="promobanner-delete-btn"
                                        style={{ color: '#FF4D4D' }}
                                        endIcon={<Icon className="fa fa-trash-alt" />}
                                        onClick={() => props.onPressDeleteIcon()}
                                    >
                                        Delete
                                    </DecoratedPopoverButton>
                                </MarketAuxMenu>
                            </PromoBannerHeaderMainContainer>
                            <RightMainInputContainer>
                                {
                                    props.promoBannerTabs === 'Vendor Page' && props.userType === 'ADMIN' &&
                                    <RightInputContainer>
                                        <SymphonyInput
                                            id="promobanner-crud-title-input"
                                            type="text"
                                            label="Vendor Name"
                                            value={props.vendorName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {}}
                                            disabled
                                        />
                                    </RightInputContainer>
                                }
                                <RightInputContainer>
                                    <SymphonyInput
                                        id="promobanner-crud-title-input"
                                        type="text"
                                        label="Title"
                                        value={props.activePromoBanner.bannerName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onPromoBannerInput('bannerName', e.target.value)
                                        }}
                                    />
                                </RightInputContainer>
                                <PromoBannerCategoryInput 
                                    onPressCategoryInput={props.onPressCategoryInput}
                                    selectedCategory={props.activePromoBanner.bannerSelectedCategory}
                                />
                                <PromoBannerImage 
                                    src={props.activePromoBanner.bannerImage}
                                    onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.files) {
                                            const file = e.target.files[0];
                                            if (includes(file.type, 'image')) {
                                                if (file.size > 5000000) { toastError('Each file cannot exceed 5mb'); return; };
                                                props.onPromoBannerInput('bannerImage', { 
                                                    ...props.activePromoBanner!.bannerImage, 
                                                    type: file.type, 
                                                    file
                                                })
                                                return;
                                            }
                                            toastError('Invalid file type')
                                        }
                                    }}
                                />
                                <Box style={{ height: 10, backgroundColor: 'white' }}/>            
                            </RightMainInputContainer>
                        </PromoBannerRightContainer>
                    </PromoBannerGrid>
                </>
            }
        </PromoBannerGrid>
    )
}

export default PromoBannerInformation;