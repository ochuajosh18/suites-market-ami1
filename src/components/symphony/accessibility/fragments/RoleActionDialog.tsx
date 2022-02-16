import React from 'react';

import {
    ApprovalDialog,
    ApprovalDialogTitle,
    ApprovalDialogContent,
    ApprovalDialogActions,
    ApprovalDialogCancelButton,
    ApprovalDialogSaveButton,
} from './AccessibilityComponents';

import SymphonyInput from '../../../symphony/SymphonyInput';
import CircularProgress from '@material-ui/core/CircularProgress';

interface RoleActionDialogInterface {
    open: boolean;
    roleName: string;
    roleDescription: String;
    onClose: () => void;
    onUpdateField: (field: string, value: string) => void;
    statusLoading: boolean;
    selectedRoleId: string;
    onSaveClick: () => void;
}

const RoleActionDialog = (props: RoleActionDialogInterface) => {
    const { open, roleName, roleDescription, onClose, onUpdateField, statusLoading, selectedRoleId, onSaveClick } = props;
    return (
        <ApprovalDialog id="role-approval-dialog" fullWidth={true} maxWidth="xs" open={open} onClose={onClose}>
            <ApprovalDialogTitle>{selectedRoleId ? "Edit Role" : "New Role"}</ApprovalDialogTitle>
            <ApprovalDialogContent>
                <SymphonyInput 
                    id="company-name-dialog-input"
                    type="text"
                    value={roleName}
                    disabled={
                        selectedRoleId === 'ROLE::CUSTOMER' || selectedRoleId === 'ROLE::VENDOR'
                    }
                    label="Name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        onUpdateField("selectedRoleName", e.target.value);
                    }}
                    placeholder="Enter name here..."
                />
                <SymphonyInput
                    id="role-remarks-input"
                    type="multiline"
                    label="Role Description"
                    value={roleDescription as string}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        onUpdateField("selectedRoleDescription", e.target.value);
                    }}
                    placeholder="Enter description here..."
                />
            </ApprovalDialogContent>
            <ApprovalDialogActions>
                <ApprovalDialogCancelButton id="role-approval-cancel-btn" onClick={onClose}>
                    Cancel
                </ApprovalDialogCancelButton>
                <ApprovalDialogSaveButton id="role-approval-confirm-btn" onClick={onSaveClick}>
                    { statusLoading ? <CircularProgress size={22}/> : selectedRoleId ? "Save" : "Add"}
                </ApprovalDialogSaveButton>
            </ApprovalDialogActions>
        </ApprovalDialog>
    )
}

export default RoleActionDialog;