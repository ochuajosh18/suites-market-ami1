import React from 'react';
import { 
    DetailHeaderBox,
    HeaderButton,
    ViewLoadingBox,
    BasicFieldBox,
    BasicDeleteButton
} from '../../Common/BasicCommonComponents';
import { DynamicBasicPromotionType, Promotion } from '../../../../store/promotion/types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import BasicInput from '../../Common/BasicInput';
import { MediaInputType } from '../../../../store/system/types';
import { Tier1Type, Tier2Type } from '../../../../store/product/types';
import moment from 'moment';
import find from 'lodash/find';

interface PromotionViewProps {
    promotion?: Promotion
    loading: boolean;
    promotionSaving: boolean;
    onCancelClick: () => void;
    onPromotionInput: (field: string, val: DynamicBasicPromotionType) => void;
    onSaveClick: () => void;
    onDeletePromotionClick: (promotionId: string) => void;
    onMediaClick: (media: MediaInputType ) => void;
    tierOneCategories: Array<Tier1Type>;
    tierTwoCategories: Array<Tier2Type>;
    tierThreeCategories: Array<string>;
    selectedTierOne: string;
    selectedTierTwo: string;
    selectedTierThree: string;
    fetchTierTwoCategories: (h1: string) => void;
    fetchTierThreeCategories: (h1: string, h2: string) => void;
    promotionInputState: (input: { [name: string]: DynamicBasicPromotionType }) => void;
}

export default (props: PromotionViewProps) => {
    const { promotion } = props;
    const statusList = [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }];
    const statusOption = find(statusList, { value: promotion && promotion.isActive ? 'Active' : 'Inactive' });
    const fieldValue = statusOption ? statusOption.value : '';
    return (
        <>
            {promotion &&
                <>
                    <DetailHeaderBox>
                        <HeaderButton
                            onClick={props.onCancelClick}
                        >
                            Cancel
                        </HeaderButton>
                        {promotion.id ? promotion.title : ''}
                        <HeaderButton onClick={props.onSaveClick}>Save</HeaderButton>
                    </DetailHeaderBox>
                    {props.loading ? 
                        <ViewLoadingBox>
                            <CircularProgress />
                        </ViewLoadingBox>
                    :
                        <BasicFieldBox>
                            <BasicInput
                                label="Promo Title"
                                type="text"
                                placeholder="Type here"
                                value={promotion.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onPromotionInput('title', e.target.value)
                                }}
                            />
                            <BasicInput
                                label="Promo Status"
                                type="dropdown"
                                autocompleteList={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
                                placeholder="Select here"
                                value={fieldValue}
                                onAutocompleteChange={(e, v) => {
                                    if (v) {
                                        props.onPromotionInput('isActive', v.value === 'Active' ? true : false)
                                    }
                                }}
                            />
                            <BasicInput
                                label="Promo Sub Title"
                                type="text"
                                placeholder="Select here"
                                value={promotion.subtitle as string}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onPromotionInput('subtitle', e.target.value)
                                }}
                            />
                            {/* <Grid container={true} style={{ marginTop: 16 }}>
                                <Grid item={true} xs={3}>Promo Category</Grid>
                                <Grid item={true} xs={9}>
                                    <BasicTreeView
                                        tierOneCategories={props.tierOneCategories}
                                        tierTwoCategories={props.tierTwoCategories}
                                        tierThreeCategories={props.tierThreeCategories}
                                        fetchTierTwoCategories={props.fetchTierTwoCategories}
                                        fetchTierThreeCategories={props.fetchTierThreeCategories}
                                        basicInputState={props.promotionInputState}
                                        selectedTierOne={props.selectedTierOne}
                                        selectedTierTwo={props.selectedTierTwo}
                                        selectedTierThree={props.selectedTierThree}
                                    />
                                </Grid>
                            </Grid> */}
                            <BasicInput
                                label="Promo Description"
                                type="multiline"
                                placeholder="Type here"
                                value={promotion.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onPromotionInput('description', e.target.value)
                                }}
                            />
                            <BasicInput
                                label="Promo Period"
                                type="daterange"
                                value=""
                                dateRangeValueFrom={moment(promotion.startDate ? promotion.startDate : new Date(), 'DD/MM/YYYY')}
                                dateRangeValueTo={moment(promotion.endDate ? promotion.endDate : new Date(), 'DD/MM/YYYY')}
                                onDateChange={(type: 'startDate' | 'endDate', value) => {
                                    console.log(type, value)
                                    if (type === 'startDate') props.onPromotionInput('startDate', value);
                                    if (type === 'endDate') props.onPromotionInput('endDate', value);
                                }}
                            />
                            <BasicInput
                                label="Images"
                                type="mediainput"
                                mediaLabel="Click to add Image"
                                mediaType="IMAGE"
                                disableMediaLabel={true}
                                value={promotion.images}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onPromotionInput('media', (e as React.ChangeEvent<HTMLInputElement>))
                                }}
                                mediaClick={props.onMediaClick}
                            />
                            <BasicInput
                                label="Videos"
                                type="mediainput"
                                mediaLabel="Click to add Video"
                                mediaType="VIDEO"
                                disableMediaLabel={true}
                                value={promotion.videos}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onPromotionInput('media', (e as React.ChangeEvent<HTMLInputElement>))
                                }}
                                mediaClick={props.onMediaClick}
                            />
                            <BasicInput
                                label="Brochures"
                                type="mediainput"
                                mediaLabel="Click to add Brochure"
                                mediaType="PDF"
                                disableMediaLabel={true}
                                value={promotion.brochures}
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onPromotionInput('media', (e as React.ChangeEvent<HTMLInputElement>))
                                }}
                                mediaClick={props.onMediaClick}
                            />
                            {props.promotion!.id.indexOf('PROMOTION') > -1 &&
                                <Box style={{ margin: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
                                    <BasicDeleteButton onClick={() => { props.onDeletePromotionClick(props.promotion!.id) }}>
                                        Delete
                                    </BasicDeleteButton>
                                </Box>
                            }
                            
                        </BasicFieldBox>
                    }
                </>
            }
        </>
    )
}