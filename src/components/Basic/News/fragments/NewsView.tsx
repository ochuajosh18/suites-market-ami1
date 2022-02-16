import React from 'react';
import { 
    DetailHeaderBox,
    HeaderButton,
    ViewLoadingBox,
    BasicFieldBox,
    BasicDeleteButton
} from '../../Common/BasicCommonComponents';
import { News, DynamicBasicNewsType, BasicNewsMedia } from '../../../../store/news/types';
import { BasicProductMedia } from '../../../../store/basicproduct/types';
import { BasicPromotionMedia } from '../../../../store/promotion/types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import BasicInput from '../../Common/BasicInput';
import find from 'lodash/find'
import moment from 'moment';

interface NewsViewProps {
    news?: News
    loading: boolean;
    onNewsInput: (field: string, val: DynamicBasicNewsType) => void;
    newsSaving: boolean;
    onSaveClick: () => void;
    onCancelClick: () => void;
    onDeleteNewsClick: (newsId: string) => void;
    onMediaClick: (media: BasicNewsMedia | BasicProductMedia | BasicPromotionMedia ) => void;
}

export default (props: NewsViewProps) => {
    const { news } = props;
    const statusList = [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }];
    const statusOption = find(statusList, { value: news && news.isActive ? 'Active' : 'Inactive' });
    const fieldValue = statusOption ? statusOption.value : '';
    return (
        <>
            {news &&
                <>
                    <DetailHeaderBox>
                        <HeaderButton
                            onClick={props.onCancelClick}
                        >
                            Cancel
                        </HeaderButton>
                        {news.id ? news.title : ''}
                        <HeaderButton onClick={props.onSaveClick}>Save</HeaderButton>
                    </DetailHeaderBox>
                    {props.loading ? 
                        <ViewLoadingBox>
                            <CircularProgress />
                        </ViewLoadingBox>
                    :
                        <BasicFieldBox>
                            {props.newsSaving ?
                                <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                    <CircularProgress />
                                </Box>
                            :
                                <>
                                    <BasicInput
                                        label="News Title"
                                        type="text"
                                        placeholder="Type here"
                                        value={news.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onNewsInput('title', e.target.value)
                                        }}
                                    />
                                    <BasicInput
                                        label="News Status"
                                        type="dropdown"
                                        autocompleteList={statusList}
                                        placeholder="Select here"
                                        value={fieldValue}
                                        onAutocompleteChange={(e, v) => {
                                            if (v) {
                                                props.onNewsInput('isActive', v.value === 'Active' ? true : false)
                                            }
                                        }}
                                    />
                                    <BasicInput
                                        label="News Sub Title"
                                        type="text"
                                        placeholder="Select here"
                                        value={news.subtitle as string}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onNewsInput('subtitle', e.target.value)
                                        }}
                                    />
                                    <BasicInput
                                        label="News Description"
                                        type="multiline"
                                        placeholder="Type here"
                                        value={news.description}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onNewsInput('description', e.target.value)
                                        }}
                                    />
                                    <BasicInput
                                        label="News Period"
                                        type="daterange"
                                        value=""
                                        dateRangeValueFrom={moment(news.startDate ? news.startDate : new Date(), 'DD/MM/YYYY')}
                                        dateRangeValueTo={moment(news.endDate ? news.endDate : new Date(), 'DD/MM/YYYY')}
                                        onDateChange={(type: 'startDate' | 'endDate', value) => {
                                            console.log(type, value)
                                            if (type === 'startDate') props.onNewsInput('startDate', value);
                                            if (type === 'endDate') props.onNewsInput('endDate', value);
                                        }}
                                    />
                                    <BasicInput
                                        label="Images"
                                        type="mediainput"
                                        mediaLabel="Click to add Image"
                                        mediaType="IMAGE"
                                        disableMediaLabel={true}
                                        value={news.images}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onNewsInput('media', (e as React.ChangeEvent<HTMLInputElement>))
                                        }}
                                        mediaClick={props.onMediaClick}
                                    />
                                    <BasicInput
                                        label="Videos"
                                        type="mediainput"
                                        mediaLabel="Click to add Video"
                                        mediaType="VIDEO"
                                        disableMediaLabel={true}
                                        value={news.videos}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onNewsInput('media', (e as React.ChangeEvent<HTMLInputElement>))
                                        }}
                                        mediaClick={props.onMediaClick}
                                    />
                                    <BasicInput
                                        label="Brochures"
                                        type="mediainput"
                                        mediaLabel="Click to add Brochure"
                                        mediaType="PDF"
                                        disableMediaLabel={true}
                                        value={news.brochures}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                            props.onNewsInput('media', (e as React.ChangeEvent<HTMLInputElement>))
                                        }}
                                        mediaClick={props.onMediaClick}
                                    />
                                    {props.news!.id.indexOf('NEWS') > -1 &&
                                        <Box style={{ margin: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box' }}>
                                            <BasicDeleteButton onClick={() => { props.onDeleteNewsClick(props.news!.id) }}>
                                                Delete
                                            </BasicDeleteButton>
                                        </Box>
                                    }
                                </>
                            }
                            
                        </BasicFieldBox>
                    }
                </>
            }
        </>
    )
}