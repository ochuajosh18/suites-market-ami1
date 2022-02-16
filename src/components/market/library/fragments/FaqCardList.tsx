import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Faq } from '../../../../store/library/types';
import { 
    FaqListContainer,
    FaqApprovalButton, 
    FaqCancelButton,
    FaqEditContainer,
    FaqInputContainer,
    FaqEditViewNumberContainer,
    FaqEditViewButtonContainer,
    FaqListViewContainer,
    FaqListViewQuestionContainer,
    FaqListQuestionHeaderContainer,
    FaqListNumberContainer,
    FaqListAnswerContainer
} from './LibraryCommonComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';

//util
import map from 'lodash/map';
import find from 'lodash/find';

// material
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import EditIcon from '../../../../assets/images/icons/symphony-edit-gold.png';

interface FaqCardListProps {
    faqs: Array<Faq>;
    faqIndex: number;
    activeFaq?: Faq;
    toggleEditView: (selectedFaq: number, activeFaq: Faq | undefined) => void;
    onChangeField: (field: string, value: string | boolean) => void;
    toggleAddView: (open: boolean) => void;
    deleteClick: () => void;
    saveClick: () => void;
    addFaq: boolean;
}

const FaqCardList = (props: FaqCardListProps) => {
    const { faqs, faqIndex, activeFaq, toggleEditView, onChangeField, toggleAddView, deleteClick, saveClick, addFaq } = props;
    return (
        <>
        <Droppable 
            droppableId="elements-droppable"
            renderClone={(provided) => {
                const faq = find(faqs, { question: provided.draggableProps['data-rbd-draggable-id'].split('-')[0] });
                return (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {faq &&
                            <FaqListViewContainer style={{ display: 'block', backgroundColor: '#ededed'}}>
                                <FaqListViewQuestionContainer>
                                    <FaqListQuestionHeaderContainer>
                                        <FaqListNumberContainer >
                                            0
                                        </FaqListNumberContainer>
                                        <Box style={{display: faqIndex !== -1 || addFaq ? 'none' : 'block', paddingTop: 10}}>
                                            <Button
                                                fullWidth={true}
                                                onClick={() => toggleEditView(0, faq)}
                                            >
                                                <img src={EditIcon} style={{ width: 22, height: 22 }} alt="" />
                                            </Button>
                                        </Box>
                                    </FaqListQuestionHeaderContainer>
                                    <Box style={{ marginTop: 15}}>
                                        {faq.question}
                                    </Box>
                                </FaqListViewQuestionContainer>
                                <FaqListAnswerContainer dangerouslySetInnerHTML={{__html: faq.answer}}/>
                            </FaqListViewContainer>
                        }
                    </div>
                )
            }}
        >
            {(provided) => (
                <FaqListContainer id="faq-list-container" paddingTop="10px" innerRef={provided.innerRef}>
                    {map(faqs, (faq, index) => {
                        const { question, answer, isActive } = faq;
                        return(
                            <Draggable 
                                key={`${faq.question.replace(/ /g,"_")}-draggable`}
                                draggableId={`${faq.question}-draggable`}
                                isDragDisabled={ addFaq || faqIndex !== -1 }
                                index={index}
                            > 
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        // style={{ ...provided.draggableProps.style, display: 'block' }}
                                    >
                                        <Box key={`faq-box-${index}`} id={`faq-box-${index}`}>
                                            <Grow in={faqIndex === index} timeout={{enter: 300, exit: 500}}>
                                                <FaqInputContainer style={{ display: faqIndex === index?'flex':'none', flexDirection: 'column' }}>
                                                    <Box style={{textAlign: 'right'}}>
                                                        <Button id='select-faq-delete-button' onClick={() => deleteClick()}>
                                                            <Icon className="fa fa-trash-alt" style={{  }} />
                                                        </Button>
                                                    </Box>
                                                    <Box style={{display: 'flex'}}>
                                                        <FaqEditViewNumberContainer>{index + 1}.</FaqEditViewNumberContainer>
                                                        <FaqEditContainer>
                                                            <SymphonyInput
                                                                id="faq-email-input"
                                                                type="text"
                                                                label=""
                                                                value={activeFaq ? activeFaq.question : question}
                                                                placeholder="Enter question here..."
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                                                    onChangeField('question', e.target.value)
                                                                }}
                                                            />
                                                            <Box marginTop="10px">
                                                                <SymphonyInput
                                                                    id="aboutus-description-input"
                                                                    type="multiline"
                                                                    label=""
                                                                    richText={true}
                                                                    value={activeFaq ? activeFaq.answer : answer}
                                                                    onRichTextInput={(html) => {
                                                                        onChangeField("answer", html)
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Box style={{display: 'flex'}} marginTop="20px">
                                                                <SymphonyInput
                                                                    id="useraccount-status-input"
                                                                    value={activeFaq ? activeFaq.isActive : isActive}
                                                                    label="Status"
                                                                    type="radio"
                                                                    radioTrueText="Active"
                                                                    radioFalseText="Inactive"
                                                                    onRadioButtonChange={(val: boolean) => {
                                                                        onChangeField('isActive', val)
                                                                    }}
                                                                />
                                                                <FaqEditViewButtonContainer>
                                                                    <FaqCancelButton id="faq-approval-cancel-btn" 
                                                                    onClick={() => toggleEditView(-1, undefined)}
                                                                    >
                                                                        Cancel
                                                                    </FaqCancelButton>
                                                                    <FaqApprovalButton 
                                                                        id="faq-approval-confirm-btn"
                                                                        onClick={() => {saveClick()}}
                                                                    >
                                                                        Save
                                                                    </FaqApprovalButton>
                                                                </FaqEditViewButtonContainer>
                                                            </Box>
                                                        </FaqEditContainer>
                                                    </Box>
                                                </FaqInputContainer>
                                            </Grow>
                                            <Fade in={faqIndex !== index} timeout={{enter: 500, exit: 500}}>
                                                <FaqListViewContainer style={{ display: faqIndex !== index ? 'block' : 'none'}}>
                                                    <FaqListViewQuestionContainer>
                                                        <FaqListQuestionHeaderContainer>
                                                            <FaqListNumberContainer >
                                                                {index + 1}
                                                            </FaqListNumberContainer>
                                                            <Box style={{display: faqIndex !== -1 || addFaq ? 'none' : 'block', paddingTop: 10}}>
                                                                <Button
                                                                    id={`faq-list-edit-button-${index}`}
                                                                    fullWidth={true}
                                                                    onClick={() => toggleEditView(index, faq)}
                                                                >
                                                                    <img src={EditIcon} style={{ width: 22, height: 22 }} alt="" />
                                                                </Button>
                                                            </Box>
                                                        </FaqListQuestionHeaderContainer>
                                                        <Box style={{ marginTop: 15}}>
                                                            {question}
                                                        </Box>
                                                    </FaqListViewQuestionContainer>
                                                    <FaqListAnswerContainer dangerouslySetInnerHTML={{__html: answer}}/>
                                                </FaqListViewContainer>
                                            </Fade>
                                        </Box>
                                    </div>
                                )}
                            </Draggable>
                        )
                    })}
                    <Box key='add-faq-box' id='add-faq-box'>
                        <Grow in={addFaq} timeout={{enter: 300, exit: 500}}>
                            <FaqInputContainer style={{ display: addFaq?'flex':'none', flexDirection: 'column' }}>
                                <Box style={{display: 'flex'}}>
                                    <FaqEditViewNumberContainer>{faqs.length + 1}.</FaqEditViewNumberContainer>
                                    <FaqEditContainer>
                                        <SymphonyInput
                                            id="faq-email-input"
                                            type="text"
                                            label=""
                                            value={activeFaq ? activeFaq.question : ""}
                                            placeholder="Enter question here..."
                                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                                onChangeField('question', e.target.value)
                                            }}
                                        />
                                        <SymphonyInput
                                            id="aboutus-description-input"
                                            type="multiline"
                                            label=""
                                            richText={true}
                                            value={activeFaq ? activeFaq.answer : ""}
                                            onRichTextInput={(html) => {
                                                onChangeField("answer", html)
                                            }}
                                        />
                                        <Box style={{display: 'flex'}}>
                                            <SymphonyInput
                                                id="useraccount-status-input"
                                                value={activeFaq ? activeFaq.isActive : ""}
                                                label="Status"
                                                type="radio"
                                                radioTrueText="Active"
                                                radioFalseText="Inactive"
                                                onRadioButtonChange={(val: boolean) => {
                                                    onChangeField('isActive', val)
                                                }}
                                            />
                                            <FaqEditViewButtonContainer>
                                                <FaqCancelButton id="faq-add-cancel-btn" 
                                                    onClick={() => toggleAddView(false)}
                                                >
                                                    Cancel
                                                </FaqCancelButton>
                                                <FaqApprovalButton 
                                                    id="faq-add-confirm-btn"
                                                    onClick={() => {saveClick()}}
                                                >
                                                    Save
                                                </FaqApprovalButton>
                                            </FaqEditViewButtonContainer>
                                        </Box>
                                    </FaqEditContainer>
                                </Box>
                            </FaqInputContainer>
                        </Grow>
                    </Box>
                </FaqListContainer>
            )}
        </Droppable>
        {/* removed code here */}
        </>
    )
}

export default FaqCardList;