import React from 'react';
import { 
    ModalContentContainer, 
    ModalDeleteContent, 
    ModalDeleteContentInnerBox,
    ModalDeleteButtonContainer,
    ModalDeleteButton,
    ModalDeleteCancelButton,
} from './AccessibilityComponents';

//material ui
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';

interface DeleteModalProps {
    open: boolean;
    onPressDeleteButton: () => void;
    onPressCancelButton: () => void;
    statusLoading: boolean;
}

export default (props: DeleteModalProps) => {
    const { open, onPressDeleteButton, onPressCancelButton } = props;
    return (
        <Modal
            open={open}
        >
            <ModalContentContainer>
                <ModalDeleteContent>
                    <ModalDeleteContentInnerBox>
                        <Box>
                            <Typography style={{ fontSize: 22, fontWeight: 'bold' }}>
                                Delete Role?
                            </Typography>

                            <Typography style={{ fontSize: 16, marginTop: 20 }}>
                                Are you sure you want to delete this role?
                            </Typography>
                        </Box>
                        <ModalDeleteButtonContainer>
                            <ModalDeleteCancelButton
                                id="role-delete-cancel-btn"
                                onClick={onPressCancelButton}
                            >
                                Cancel
                            </ModalDeleteCancelButton>

                            <ModalDeleteButton
                                onClick={onPressDeleteButton}
                            >
                                { props.statusLoading ?<CircularProgress size={15} style={{ color: '#4C89F4' }} /> : <>Delete</>}
                            </ModalDeleteButton>
                        </ModalDeleteButtonContainer>
                    </ModalDeleteContentInnerBox>
                </ModalDeleteContent>
            </ModalContentContainer>
        </Modal>
    )
}