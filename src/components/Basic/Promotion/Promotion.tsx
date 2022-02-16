import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { PromotionState, Promotion as PromotionType, DynamicBasicPromotionType, BasicPromotionMedia } from '../../../store/promotion/types';
import { 
    setPromotionState, 
    loadPromotions, 
    uploadPromotionMedia, 
    savePromotion,
    deletePromotion,
    fetchTierOneCategories,
    fetchTierTwoCategories,
    fetchTierThreeCategories
} from '../../../store/promotion/actions';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { MediaInputType } from '../../../store/system/types';
import BasicLayout from '../Common/BasicLayout';
import PromotionList from './fragments/PromotionList';
import PromotionView from './fragments/PromotionView';
import BasicMediaPreview from '../Common/BasicMediaPreview';
import Grid from '@material-ui/core/Grid';
import find from 'lodash/find';
import debounce from 'lodash/debounce';
import {v4} from 'uuid'
import moment from 'moment';
import { toastWarning } from '../../../modules/Toast';

interface PromotionProps {
    setPromotionState: typeof setPromotionState;
    loadPromotions: typeof loadPromotions;
    uploadPromotionMedia: typeof uploadPromotionMedia;
    savePromotion: typeof savePromotion;
    deletePromotion: typeof deletePromotion;
    setSystemState: typeof setSystemState;
    resetSystemDialog: typeof resetSystemDialog;
    fetchTierOneCategories:typeof fetchTierOneCategories;
    fetchTierTwoCategories: typeof fetchTierTwoCategories;
    fetchTierThreeCategories: typeof fetchTierThreeCategories
    promotion: PromotionState
}

class Promotion extends React.Component<PromotionProps> {
    search = debounce((input: string) => {
        this.props.loadPromotions(input);
    }, 300, { leading: false })

    componentDidMount = () => {
        this.props.loadPromotions();
        this.props.setPromotionState({ activePromotion: undefined, activePromotionId: '' });
        this.props.fetchTierOneCategories();
    }

    _onPromotionTextInput = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.setPromotionState({ [field]: e.target.value });
    }

    _onPromotionInput = (field: string, value: DynamicBasicPromotionType) => {
        this.props.setPromotionState({ [field]: value });
    }
    
    _onPromotionClick = (id: string) => {
        const promotion = find(this.props.promotion.promotions, { id })
        this.props.setPromotionState({ 
            activePromotionId: id, 
            activePromotion: { ...promotion, subtitle: promotion!.subTitle } as typeof promotion,
            selectedTierOneCategory: '',
            selectedTierTwoCategory: '',
            selectedTierThreeCategory: ''
        });
    }

    _onCancelClick = () => {}

    _onActivePromotionInput = (field: string, value: DynamicBasicPromotionType) => {
        if (field === 'media') {
            this._onMediaInput(value as React.ChangeEvent<HTMLInputElement>)
        }
        else {
            const newPromotion = { ...this.props.promotion.activePromotion, [field]: value } as PromotionType; 
            this.props.setPromotionState({ activePromotion: newPromotion });
        }
    }

    _onPromotionSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.search(e.target.value)
    }

    _onMediaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            this.props.uploadPromotionMedia(e.target.files[0])
        }
    }

    _onAddPromotionClick = () => {
        this.props.setPromotionState({ 
            activePromotion: {
                id: '',
                title: '',
                subtitle: '',
                category: '',
                description: '',
                startDate: moment().format("DD/MM/YYYY"),
                endDate: moment().format("DD/MM/YYYY"),
                pdf: [] as Array<BasicPromotionMedia>,
                images: [] as Array<BasicPromotionMedia>,
                videos: [] as Array<BasicPromotionMedia>,
                brochures: [] as Array<BasicPromotionMedia>
            } as PromotionType,
            activePromotionId: v4()
        });
    }

    _onPromotionSave = () => {
        if (this._validatePromotion()) {
            const { activePromotion } = this.props.promotion;
            if (activePromotion) {
                let mediaUploading = false;
                for (const image of activePromotion!.images) {
                    if (image.loading) mediaUploading = true;
                }
                for (const video of activePromotion!.videos) {
                    if (video.loading) mediaUploading = true;
                }
                for (const pdf of activePromotion!.pdf) {
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
                            this.props.savePromotion()
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

    _onPromotionDelete = (newsId: string) => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Confirm Delete',
            systemDialogContent: 'This will delete the promotion. Please click the delete button to proceed',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemOverrideTitle: 'Delete',
            systemDialogConfirmAction: () => { 
                // do delete
                this.props.deletePromotion(newsId);
                this.props.resetSystemDialog();
            }
        });
    }

    _validatePromotion = (): boolean => {
        const { activePromotion } = this.props.promotion;
        if (activePromotion) {
            if (!activePromotion.title) { toastWarning("Missing promotion title"); return false; }
            if (!activePromotion.subtitle) { toastWarning("Missing promotion subtitle"); return false; }
            if (!activePromotion.description) { toastWarning("Missing promotion description"); return false; }
            const existing = find(this.props.promotion.promotions, { title: activePromotion.title });
            if (existing && activePromotion.id !== existing.id) {
                toastWarning("Promotion already exist");
                return false;
            }
        }
        return true;
    }

    _onMediaPreviewClick = (media: MediaInputType) => {
        this.props.setPromotionState({
            mediaToPreview: media as BasicPromotionMedia,
            mediaPreviewVisible: true
        })
    }

    render() {
        const { activePromotionId, promotions, activePromotion, activePromotionLoading, promotionListLoading } = this.props.promotion;
        return (
            <BasicLayout>
                <Grid container={true}>
                    <Grid item={true} xs={4}>
                        <PromotionList
                            promotions={promotions}
                            activePromotionId={activePromotionId}
                            loading={promotionListLoading}
                            promotionSearch={this.props.promotion.promotionSearch}
                            onPromotionSearch={this._onPromotionSearch}
                            onPromotionClick={this._onPromotionClick.bind(this)}
                            onAddPromotionClick={this._onAddPromotionClick.bind(this)}
                            onDeletePromotionClick={this._onPromotionDelete.bind(this)}
                        />
                    </Grid>
                    <Grid item={true} xs={8}>
                        <PromotionView
                            promotion={activePromotion}
                            loading={activePromotionLoading}
                            onPromotionInput={this._onActivePromotionInput.bind(this)}
                            promotionSaving={this.props.promotion.activePromotionLoading}
                            onCancelClick={() => {
                                this._onPromotionInput('activePromotionId', '');
                                this._onPromotionInput('activePromotion', undefined);
                            }}
                            onSaveClick={this._onPromotionSave.bind(this)}
                            onMediaClick={this._onMediaPreviewClick.bind(this)}
                            onDeletePromotionClick={this._onPromotionDelete.bind(this)}
                            fetchTierTwoCategories={this.props.fetchTierTwoCategories.bind(this)}
                            fetchTierThreeCategories={this.props.fetchTierThreeCategories.bind(this)}
                            tierOneCategories={this.props.promotion.tierOneCategories}
                            tierTwoCategories={this.props.promotion.tierTwoCategories}
                            tierThreeCategories={this.props.promotion.tierThreeCategories}
                            promotionInputState={this.props.setPromotionState.bind(this)}
                            selectedTierOne={this.props.promotion.selectedTierOneCategory}
                            selectedTierTwo={this.props.promotion.selectedTierTwoCategory}
                            selectedTierThree={this.props.promotion.selectedTierThreeCategory}
                        />
                    </Grid>
                </Grid>
                <BasicMediaPreview 
                    visible={this.props.promotion.mediaPreviewVisible}
                    media={this.props.promotion.mediaToPreview}
                    handleClose={() => this.props.setPromotionState({ mediaPreviewVisible: false })}
                />
            </BasicLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    promotion: state.promotion
});

export default connect(mapStateToProps, {
    setPromotionState,
    loadPromotions,
    uploadPromotionMedia,
    savePromotion,
    deletePromotion,
    setSystemState,
    resetSystemDialog,
    fetchTierOneCategories,
    fetchTierTwoCategories,
    fetchTierThreeCategories
})(Promotion);