import React from 'react';

// Local Components
import {
    SymphonyDialogContainer,
    SymphonyDialogTitle,
    SymphonyDialogContent,
    SymphonyDialogActions,
    SymphonyDialogCancelButton,
    SymphonyDialogSaveButton,
    SymphonyDialogCircularProgress
} from './SymphonyCommonComponents';

interface SymphonyDialogProps {
    idKey: string;
    children: JSX.Element;
    open: boolean;
    loading: boolean;
    title: string;
    onClose?: () => void;
    onClickSave?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
}

const SymphonyDialog = (props: SymphonyDialogProps) => {
    const { open, idKey, children, loading, title, cancelLabel, saveLabel, onClose, onClickSave } = props;
    return (
        <SymphonyDialogContainer id={`${idKey}-dialog`} fullWidth={true} maxWidth="xs" open={open} onClose={onClose ? onClose: () => {} }>
            <SymphonyDialogTitle>{title}</SymphonyDialogTitle>
            <SymphonyDialogContent>{ children }</SymphonyDialogContent>
            <SymphonyDialogActions>
                <SymphonyDialogCancelButton id={`${idKey}-cancel-btn`} onClick={onClose ? onClose: () => {} }>
                    { cancelLabel ? cancelLabel : 'Cancel' }
                </SymphonyDialogCancelButton>
                <SymphonyDialogSaveButton id={`${idKey}-confirm-btn`} onClick={onClickSave ? onClickSave : () => {} }>
                    { loading ? <SymphonyDialogCircularProgress size={22}/> : saveLabel ? saveLabel : "Confirm"}
                </SymphonyDialogSaveButton>
            </SymphonyDialogActions>
        </SymphonyDialogContainer>
    )
}

export default SymphonyDialog;