import React from 'react';
import { 
    ModalContainer, 
    ModalContentContainer, 
    ModalDeleteContent, 
    ModalTypography, 
    ModalDeleteContentInnerBox,
    ModalDeleteTextContainer,
    ModalDeleteButtonContainer,
    ModalDeleteButton,
    ModalDeleteCancelButton,
    BlackLoading
} from './CategoryComponents';

interface DeleteModalProps {
    modalDeleteIsOpen: boolean;
    onPressDeleteButton: () => void;
    onPressCancelButton: () => void;
    loading: boolean;
}

export default (props: DeleteModalProps) => {
    const { modalDeleteIsOpen, onPressDeleteButton, onPressCancelButton } = props;
    return (
        <ModalContainer
            open={modalDeleteIsOpen}
        >
            <ModalContentContainer>
                <ModalDeleteContent>
                    <ModalDeleteContentInnerBox>
                        <ModalDeleteTextContainer>
                            <ModalTypography style={{ fontSize: 22, fontWeight: 'bold' }}>
                                Delete Category?
                            </ModalTypography>

                            <ModalTypography style={{ fontSize: 16, marginTop: 20 }}>
                                Are you sure you want to delete this category?
                            </ModalTypography>
                        </ModalDeleteTextContainer>
                        <ModalDeleteButtonContainer>
                            <ModalDeleteCancelButton
                                id="category-delete-cancel-btn"
                                onClick={onPressCancelButton}
                            >
                                Cancel
                            </ModalDeleteCancelButton>

                            <ModalDeleteButton
                                onClick={onPressDeleteButton}
                            >
                                { props.loading ? <BlackLoading size={15}/> : <>Delete</>}
                            </ModalDeleteButton>
                        </ModalDeleteButtonContainer>
                    </ModalDeleteContentInnerBox>
                </ModalDeleteContent>
            </ModalContentContainer>
        </ModalContainer>
    )
}