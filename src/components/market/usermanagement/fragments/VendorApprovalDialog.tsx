import React from 'react';
import { Vendor } from '../../../../store/usermanagement/types';

import {
    ApprovalDialog,
    ApprovalDialogTitle,
    ApprovalDialogContent,
    ApprovalDialogActions,
    ApprovalDialogCancelButton,
    ApprovalDialogSaveButton,
    StatusApprovedOptionButton,
    StatusDisapprovedOptionButton
} from './UserManagementComponents';

import {
    SymphonyInputGridContainer,
    SymphonyInputLabelGridContainer
} from '../../../symphony/SymphonyCommonComponents'

import SymphonyInput from '../../../symphony/SymphonyInput';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import CircleDispprovedImage from '../../../../assets/images/status/circleDisapproved.png';

interface FieldEditDialogInterface {
    open: boolean;
    vendor: Vendor;
    statusUpdate: string;
    vendorRemarksUpdate: string;
    onClose: () => void;
    onChangeStatusField: (remarks: string) => void;
    statusUpdateSave: () => void;
    statusLoading: boolean;
}

const FieldEditDialog = (props: FieldEditDialogInterface) => {
    const { open, vendor, statusUpdate, vendorRemarksUpdate, onClose, onChangeStatusField, statusUpdateSave, statusLoading } = props;
    return (
        <ApprovalDialog id="vendor-approval-dialog" fullWidth={true} maxWidth="xs" open={open} onClose={onClose}>
            <ApprovalDialogTitle>Approval</ApprovalDialogTitle>
            <ApprovalDialogContent>
                <SymphonyInput 
                    id="company-name-dialog-input"
                    type="text"
                    value={vendor.companyName}
                    label="Name"
                    disabled={true}
                />
                <SymphonyInputGridContainer container={true}>
                    <SymphonyInputLabelGridContainer item={true} xs={12}>
                        Approval Status
                    </SymphonyInputLabelGridContainer>
                    {
                        statusUpdate === "Approved" &&
                            <StatusApprovedOptionButton
                                disabled={true}
                            >
                                <CheckCircleIcon 
                                    className="check-cicle-icon"
                                />
                                Approve
                            </StatusApprovedOptionButton>
                    }
                    {
                        statusUpdate === "Rejected" &&
                            <StatusDisapprovedOptionButton
                                disabled={true}
                            >
                                <img
                                    src={CircleDispprovedImage}
                                    className="status-img-size"
                                    alt=""
                                />
                                Reject
                            </StatusDisapprovedOptionButton>
                    }
                </SymphonyInputGridContainer>
                <Box marginTop="20px">
                    <SymphonyInput
                        id="vendor-remarks-input"
                        type="multiline"
                        label="Remarks"
                        value={vendorRemarksUpdate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onChangeStatusField(e.target.value);
                        }}
                        placeholder="Type here..."
                    />
                </Box>
            </ApprovalDialogContent>
            <ApprovalDialogActions>
                <ApprovalDialogCancelButton id="vendor-approval-cancel-btn" onClick={onClose}>
                    Cancel
                </ApprovalDialogCancelButton>
                <ApprovalDialogSaveButton id="vendor-approval-confirm-btn" onClick={statusUpdateSave}>
                    { statusLoading ? <CircularProgress size={22}/> : "Confirm" }
                </ApprovalDialogSaveButton>
            </ApprovalDialogActions>
        </ApprovalDialog>
    )
}

export default FieldEditDialog;