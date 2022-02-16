import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/styles/withStyles';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const CustomerListImportButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            marginRight: 16,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            color: SYMPHONY_PRIMARY_COLOR,
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            height: 44,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#FFF',
            }
        }
    })
)(Button)

export const DistributorDialog = withStyles(
    () => ({
        root: {
            '& .MuiDialog-paper': {
                borderRadius: 0
            }
        }
    })
)(Dialog)

export const DistributorDialogTitle = withStyles(
    () => ({
        root: {
            paddingBottom: 16
        }
    })
)(DialogTitle)

export const DistributorDialogContent = withStyles(
    () => ({
        root: {
            minHeight: 320
        }
    })
)(DialogContent)

export const DistributorDialogActions = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '8px 24px 28px'
        }
    })
)(DialogActions)

export const DistributorDialogActionButton = withStyles(
    () => ({
        root: {
            width: 'calc(100% - 16px)',
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            height: 44,
            borderRadius: 5,
            fontWeight: 'bold',
            '&.MuiButton-outlined': {
                backgroundColor: '#FFF',
                color: SYMPHONY_PRIMARY_COLOR,
                border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            },
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#FFF',
            }
        }
    })
)(Button)

export const DistributorDialogGrid = withStyles(
    () => ({
        root: {
            marginBottom: 20,
            fontSize: 14
        }
    })
)(Grid)