import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store/';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { LibraryState, Faq } from '../../../store/library/types';
import { setSystemState, resetSystemDialog } from '../../../store/system/actions';
import { setLibraryState, getFaqs, deleteFaq, saveFaq, updateFaqOrder } from '../../../store/library/actions';

// Material UI
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';

// Local Components
import FaqCardList from './fragments/FaqCardList'

// Global Components
import { 
    SymphonyHeaderButton, 
    SymphonyHeaderTitle,
    SymphonyContainer,
    SymphonyContentContainer,
} from '../../symphony/SymphonyCommonComponents';
import SymphonyLayout from '../../symphony/SymphonyLayout';
import SymphonyContentLoading from '../../symphony/SymphonyContentLoading';
import findIndex from 'lodash/findIndex';
import { toastError } from '../../../modules/Toast';

interface FaqProps {
    library: LibraryState;
    getFaqs: typeof getFaqs;
    setSystemState: typeof setSystemState;
    setLibraryState: typeof setLibraryState; 
    resetSystemDialog: typeof resetSystemDialog;
    deleteFaq: typeof deleteFaq;
    saveFaq: typeof saveFaq;
    updateFaqOrder: typeof updateFaqOrder;
}

class Faqs extends React.PureComponent<FaqProps> {
    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <SymphonyHeaderTitle
                        id="faq-header-title"
                    >
                        Frequently Asked Questions
                    </SymphonyHeaderTitle>
                    <div>
                        <SymphonyHeaderButton 
                            id="faq-add-btn"
                            startIcon={<AddIcon />}
                            onClick={async () => {
                                await this.props.setLibraryState({addFaq: true, activeFaq: {answer: '', question: '', isActive: true}})
                                const element = document.getElementById("add-faq-box");
                                element!.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
                            }}
                        >
                            Add New
                        </SymphonyHeaderButton>
                    </div>
                </Box>
            )
        })
        this.props.getFaqs();
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined })

    _onToggleEditView = (faqIndex: number, editedFaq: Faq | undefined) => {
        const { faqs, activeFaq, selectedFaq } = this.props.library;
        if(editedFaq === undefined && faqs[selectedFaq] !== activeFaq) {
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Unsaved Changes',
                systemDialogContent: 'Please note that you have unsaved changes. You are about to undo all changes.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemOverrideTitle: 'Confirm',
                systemDialogConfirmAction: () => { 
                    this.props.setLibraryState({selectedFaq: faqIndex, activeFaq: editedFaq});
                    this.props.resetSystemDialog();
                }
            });
        } else {
            this.props.setLibraryState({selectedFaq: faqIndex, activeFaq: editedFaq});
        }
        this.updateHeaderButton(faqIndex !== -1)
    }

    updateHeaderButton = (status: boolean) => {
        this.props.setSystemState({
            header: (
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <SymphonyHeaderTitle
                        id="faq-header-title"
                    >
                        Frequently Asked Questions
                    </SymphonyHeaderTitle>
                    <div>
                        <SymphonyHeaderButton 
                            id="faq-add-btn"
                            startIcon={<AddIcon />}
                            disabled={status}
                            onClick={async () => {
                                await this.props.setLibraryState({addFaq: true, activeFaq: {answer: '', question: '', isActive: true}})
                                const element = document.getElementById("add-faq-box");
                                element!.scrollIntoView({behavior: "smooth", block: "end"});
                            }}
                        >
                            Add New
                        </SymphonyHeaderButton>
                    </div>
                </Box>
            )
        })
    }

    _onDeleteClick = () => {
        this.props.setSystemState({
            systemDialogOpen: true,
            systemDialogMaxWidth: 'xs',
            systemDialogTitle: 'Delete FAQ',
            systemDialogContent: 'Please note that any changes are permanent. To continue, please click the delete button.',
            systemDialogSimple: true,
            systemDialogConfirm: true,
            systemOverrideTitle: 'Delete',
            systemDialogConfirmAction: () => { 
                this.props.deleteFaq()
                this.props.resetSystemDialog();
                this.updateHeaderButton(false)
            }
        });
    }

    _onClickSave = () => {
        const { faqs, selectedFaq, activeFaq } = this.props.library
        const faqIndex = findIndex(faqs, (faq, index)  => {
            return faq.question.toLowerCase() === activeFaq!.question.toLowerCase() && index !== selectedFaq
        })
        if(!activeFaq!.question) toastError('Question is required')
        if(!activeFaq!.answer) toastError('Answer is required')

        if(activeFaq!.question && activeFaq!.answer) {
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Save FAQ',
                systemDialogContent: 'Please note that any changes are permanent. To continue, please click the save button.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemOverrideTitle: 'Save',
                systemDialogConfirmAction: () => { 
                    if(faqIndex !== -1) toastError('Question already exist')
                    else {
                        this.props.saveFaq()
                        this.updateHeaderButton(false)
                    }
                    this.props.resetSystemDialog();
                    
                }
            });
        }
    }

    _onToggleAddView = (open: boolean) => {
        const { activeFaq } = this.props.library;
        if(!open && (activeFaq!.answer !== "" || activeFaq!.question !== "")) {
            this.props.setSystemState({
                systemDialogOpen: true,
                systemDialogMaxWidth: 'xs',
                systemDialogTitle: 'Unsaved Changes',
                systemDialogContent: 'Please note that you have unsaved changes. You are about to undo all changes.',
                systemDialogSimple: true,
                systemDialogConfirm: true,
                systemOverrideTitle: 'Confirm',
                systemDialogConfirmAction: () => { 
                    this.props.setLibraryState({addFaq: open});
                    this.props.resetSystemDialog();
                    this.updateHeaderButton(open)
                }
            });
        } else {
            this.updateHeaderButton(open)
            this.props.setLibraryState({addFaq: open});
        }
    }

    _onChangeFaqFields = (field: string, value: string | boolean) => {
        let {activeFaq} = this.props.library;
        if(activeFaq){
            const newFaq = {...activeFaq, [field]: value}
            this.props.setLibraryState({activeFaq: newFaq});
        }
    }

    _onDragEnd = (result: DropResult) => {
        const { source, destination  } = result;
        let faqs = [...this.props.library.faqs];
        const section = faqs[source.index];
        faqs.splice(source.index, 1);
        faqs.splice(destination!.index, 0, section);
        this.props.setLibraryState({ faqs });
        this.props.updateFaqOrder()
    }
    
    render () {
        const { faqLoading, faqs, activeFaq, selectedFaq, addFaq } = this.props.library;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer>
                        { faqLoading ? <SymphonyContentLoading /> :
                            <DragDropContext onDragEnd={this._onDragEnd.bind(this)}>
                                <FaqCardList
                                    faqs={faqs}
                                    faqIndex={selectedFaq}
                                    activeFaq={activeFaq}
                                    toggleEditView={this._onToggleEditView.bind(this)}
                                    onChangeField={this._onChangeFaqFields.bind(this)}
                                    toggleAddView={this._onToggleAddView.bind(this)}
                                    deleteClick={this._onDeleteClick.bind(this)}
                                    saveClick={this._onClickSave.bind(this)}
                                    addFaq={addFaq}
                                />
                            </DragDropContext>
                        }
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        library: state.library
    }
}

export default connect(mapStateToProps, {
    getFaqs,
    setSystemState,
    setLibraryState,
    resetSystemDialog,
    deleteFaq,
    saveFaq,
    updateFaqOrder
})(Faqs);