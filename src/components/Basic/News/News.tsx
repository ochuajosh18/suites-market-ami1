import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { NewsState, News as NewsType, DynamicBasicNewsType, BasicNewsMedia } from '../../../store/news/types';
import { setNewsState, loadNews, uploadNewsMedia, saveNews, deleteNews } from '../../../store/news/actions';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { MediaInputType } from '../../../store/system/types';
import BasicLayout from '../Common/BasicLayout';
import NewsList from './fragments/NewsList';
import NewsView from './fragments/NewsView';
import BasicMediaPreview from '../Common/BasicMediaPreview';
import Grid from '@material-ui/core/Grid';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import {v4} from 'uuid'
import moment from 'moment';
import { toastWarning } from '../../../modules/Toast';

interface NewsProps {
    setNewsState: typeof setNewsState;
    loadNews: typeof loadNews;
    uploadNewsMedia: typeof uploadNewsMedia;
    saveNews: typeof saveNews;
    deleteNews: typeof deleteNews;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    news: NewsState
}

class News extends React.Component<NewsProps> {
    search = debounce((input: string) => {
        this.props.loadNews(input);
    }, 300, { leading: false })

    componentDidMount = () => {
        this.props.loadNews();
    }

    _onNewsTextInput = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setNewsState({ [field]: e.target.value });
    }

    _onNewsInput = (field: string, value: DynamicBasicNewsType) => {
        this.props.setNewsState({ [field]: value });
    }
    
    _onNewsClick = (id: string) => {
        const news = find(this.props.news.news, { id })
        this.props.setNewsState({ activeNewsId: id, activeNews: news });
    }

    _onCancelClick = () => {}

    _onActiveNewsInput = (field: string, value: DynamicBasicNewsType) => {
        if (field === 'media') {
            this._onMediaInput(value as React.ChangeEvent<HTMLInputElement>)
        }
        else {
            const newNews = { ...this.props.news.activeNews, [field]: value } as NewsType; 
            this.props.setNewsState({ activeNews: newNews });
        }
    }

    _onNewsSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.search(e.target.value)
    }

    _onMediaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            this.props.uploadNewsMedia(e.target.files[0])
        }
    }

    _onAddNewsClick = () => {
        this.props.setNewsState({ 
            activeNews: {
                id: '',
                title: '',
                subtitle: '',
                category: '',
                description: '',
                startDate: moment().format("DD/MM/YYYY"),
                endDate: moment().format("DD/MM/YYYY"),
                pdf: [] as Array<BasicNewsMedia>,
                images: [] as Array<BasicNewsMedia>,
                videos: [] as Array<BasicNewsMedia>,
                brochures: [] as Array<BasicNewsMedia>
            } as NewsType,
            activeNewsId: v4()
        });
    }

    _onNewsSave = () => {
        if (this._validateNews()) {
            const { activeNews } = this.props.news;
            if (activeNews) {
                let mediaUploading = false;
                for (const image of activeNews!.images) {
                    if (image.loading) mediaUploading = true;
                }
                for (const video of activeNews!.videos) {
                    if (video.loading) mediaUploading = true;
                }
                for (const pdf of activeNews!.pdf) {
                    if (pdf.loading) mediaUploading = true;
                }

                if (!mediaUploading) {
                    this.props.setSystemState({
                        systemDialogOpen: true,
                        systemDialogMaxWidth: 'xs',
                        systemDialogTitle: 'Confirm Save',
                        systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
                        systemDialogSimple: true,
                        systemDialogConfirm: false,
                        systemConfirmOnly: false,
                        systemDialogConfirmAction: () => { 
                            this.props.saveNews()
                            this.props.resetSystemDialog();
                        }
                    });
                }
                else {
                    toastWarning("Cannot save when a media is still uploading")
                }
            }
        }
    }

    _onNewsDelete = (newsId: string) => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Confirm Delete',
            systemDialogContent: 'This will delete the news. Please click the delete button to proceed',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemOverrideTitle: 'Delete',
            systemDialogConfirmAction: () => { 
                // do delete
                this.props.deleteNews(newsId);
                this.props.resetSystemDialog();
            }
        });
    }

    _validateNews = (): boolean => {
        const { activeNews } = this.props.news;
        if (activeNews) {
            if (!activeNews.title) { toastWarning("Missing news title"); return false; }
            if (!activeNews.subtitle) { toastWarning("Missing news subtitle"); return false; }
            if (!activeNews.description) { toastWarning("Missing news description"); return false; }
            
            const existing = find(this.props.news.news, { title: activeNews.title });
            if (existing && activeNews.id !== existing.id) {
                toastWarning("News already exist");
                return false;
            }
        }
        return true;
    }

    _onMediaPreviewClick = (media: MediaInputType) => {
        this.props.setNewsState({
            mediaToPreview: media as BasicNewsMedia,
            mediaPreviewVisible: true
        })
    }

    render() {
        const { activeNewsId, news, activeNews, activeNewsLoading, newsListLoading } = this.props.news;
        return (
            <BasicLayout>
                <Grid container={true}>
                    <Grid item={true} xs={4}>
                        <NewsList
                            news={news}
                            activeNewsId={activeNewsId}
                            loading={newsListLoading}
                            onNewsSearch={this._onNewsSearch}
                            onNewsClick={this._onNewsClick.bind(this)}
                            onAddNewsClick={this._onAddNewsClick.bind(this)}
                            onDeleteNewsClick={this._onNewsDelete.bind(this)}
                        />
                    </Grid>
                    <Grid item={true} xs={8}>
                        <NewsView
                            news={activeNews}
                            loading={activeNewsLoading}
                            onNewsInput={this._onActiveNewsInput.bind(this)}
                            newsSaving={this.props.news.activeNewsLoading}
                            onCancelClick={() => {
                                this._onNewsInput('activeNewsId', '');
                                this._onNewsInput('activeNews', undefined);
                            }}
                            onSaveClick={this._onNewsSave.bind(this)}
                            onMediaClick={this._onMediaPreviewClick.bind(this)}
                            onDeleteNewsClick={this._onNewsDelete.bind(this)}
                        />
                    </Grid>
                </Grid>
                <BasicMediaPreview 
                    visible={this.props.news.mediaPreviewVisible}
                    media={this.props.news.mediaToPreview}
                    handleClose={() => this.props.setNewsState({ mediaPreviewVisible: false })}
                />
            </BasicLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    news: state.news
});

export default connect(mapStateToProps, {
    setNewsState,
    loadNews,
    uploadNewsMedia,
    saveNews,
    deleteNews,
    setSystemState,
    resetSystemDialog
})(News);