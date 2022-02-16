import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

interface SystemDialogProps {
    visible: boolean;
    onCloseAction: () => void;
    title?: string;
    content?: JSX.Element | JSX.Element[] | string;
    action?: JSX.Element | JSX.Element[] | undefined;
    maxWidth: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false;
    simpleDialog: boolean;
    simpleConfirm?: boolean;
    overrideTitle?: string;
    onConfirmAction?: () => void;
    confirmOnly?: boolean;
}

export default (props: SystemDialogProps) => {
    return (
        <Dialog
            id="system-dialog"
            maxWidth={props.maxWidth}
            open={props.visible}
            onClose={props.onCloseAction}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {props.simpleDialog ?
                    <DialogContentText>
                        {props.content}
                    </DialogContentText>
                :
                    <DialogContent>
                        {props.content}
                    </DialogContent>
                }
            </DialogContent>
            {props.action && !props.simpleConfirm ?
                <DialogActions>
                    {props.action}
                </DialogActions>
            :
                <DialogActions>
                    <Button onClick={props.onCloseAction}>{props.confirmOnly ? 'Ok' : 'Cancel'}</Button>
                    {!props.confirmOnly &&
                        <Button onClick={props.onConfirmAction}>{props.overrideTitle ? props.overrideTitle : 'Save'}</Button>
                    }
                </DialogActions>
            }
        </Dialog>
    )
}