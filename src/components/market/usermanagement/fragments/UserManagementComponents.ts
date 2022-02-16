import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress'
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const UserManagementListContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 120px)',
            width: '100%',
            padding: '8px 32px',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const UserManagementListRowsContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 196px)',
            overflowY: 'auto',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        }
    })
)(Box);


export const UserManagementListRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            margin: '8px 0',
            boxSizing: 'border-box',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer'
        }
    })
)(Box);

export const UserManagementListGrid = withStyles(
    () => ({
        root: {
            fontSize: 12,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    })
)(Grid);

export const UserManagementViewGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            just: 'center',
            flexDirection: 'column',
            paddingRight: 25
        }
    })
)(Grid);

export const UserManagementButtonGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
        }
    })
)(Grid);

export const UserManagementListImageContainer = withStyles(
    () => ({
        root: {
            height: 48, 
            width: 48,
            minWidth: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(Grid);

export const UserManagementListButtonContainer = withStyles(
    () => ({
        root: {
            height: 48, 
            width: 48,
            minWidth: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(Grid);

export const ApproveButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#00ba4b',
            color: '#FFF',
            border: '1px solid #E5E5E5',
            height: 40,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#00ba4b',
            }
        }
    })
)(Button);

export const DisapproveButton = withStyles(
    () => ({
        root: {
            width: 150,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#d9534f',
            color: '#FFF',
            border: '1px solid #E5E5E5',
            height: 40,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#d9534f',
            }
        }
    })
)(Button);

export const StatusApprovedOptionButton = withStyles(
    () => ({
        root: {
            marginTop: 10,
            fontSize: 10,
            borderRadius: 50,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: '#E3FFDE',
            color: '#00AD4C',
            // border: '1px solid #E5E5E5',
            height: 30,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#E3FFDE',
            },
            '&.MuiButton-root.Mui-disabled': {
                color: '#00AD4C',
                fontWeight: 'bold'
            },
            '& .check-cicle-icon': {
                fontSize: '15px !important',
                color: 'rgb(0, 186, 75)',
                marginRight: 10
            }
        }
    })
)(Button);

export const StatusPendingOptionButton = withStyles(
    () => ({
        root: {
            justifyContent: 'space-between',
            marginTop: 10,
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 10,
            borderRadius: 50,
            // textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#fff1dc',
            color: '#ffb333',
            border: '1px solid #fff1dc',
            height: 30,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#fff1dc',
            }
        }
    })
)(Button);

export const StatusDisapprovedOptionButton = withStyles(
    () => ({
        root: {
            marginTop: 10,
            paddingLeft: 15,
            paddingRight: 15,
            fontSize: 10,
            borderRadius: 50,
            backgroundColor: '#e8b8c780',
            color: '#ff4d4d',
            border: '1px solid #E5E5E5',
            height: 30,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#e8b8c780',
            },
            '&.MuiButton-root.Mui-disabled': {
                color: '#ff4d4d',
                fontWeight: 'bold'
            }
        }
    })
)(Button);

export const MenuItemText = withStyles(
    () => ({
        root: {
          fontWeight: 'bold',
          fontSize: 11
        }
    })
)(Typography);

export const ApprovalDialog = withStyles(
    () => ({
        root: {
            '& .MuiDialog-paper': {
                padding: 8,
                boxSizing: 'border-box',
                borderRadius: 0
            }
        }
    })
)(Dialog); 

export const ApprovalDialogTitle = withStyles(
    () => ({
        root: {

        }
    })
)(DialogTitle); 

export const ApprovalDialogContent = withStyles(
    () => ({
        root: {
            '& .MuiInputBase-root': {
                width: '100%',
                '&:before': {
                    borderBottom: 'none'
                },
                '&:after': {
                    borderBottom: 'none'
                },
                '&:hover:before': {
                    borderBottom: 'none'
                }
            },
            '& .MuiSelect-icon': {
                right: 12
            },
            '& .MuiSelect-root' : {
                width: '100%',
                fontSize: 12
            },
            '& .selected-disabled': {
                color: '#969696'
            },
            '& .MuiFormHelperText-root.Mui-error': {
                display: 'none'
            },
            '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
                marginRight: 8
            },
            '& .MuiAutocomplete-popupIndicator': {
                marginRight: 4
            }
        }
    })
)(DialogContent); 

export const ApprovalDialogActions = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '0px 24px 24px',
        }
    })
)(DialogActions); 

export const ApprovalDialogCancelButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            color: SYMPHONY_PRIMARY_COLOR,
            padding: '8px 10px',
            textTransform: 'none',
            boxSizing: 'border-box',
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            height: 48,
            borderRadius: 5,
            fontWeight: 'bold',
            width: '50%',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#FFF',
            }
        }
    })
)(Button); 

export const ApprovalDialogSaveButton = withStyles(
    () => ({
        root: {
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            padding: '8px 10px',
            width: '50%',
            textTransform: 'none',
            boxSizing: 'border-box',
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            height: 48,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
            }
        }
    })
)(Button); 

// User Management - User Account - Header

export const HeaderTitle = withStyles(
    () => ({
        root: {
            fontWeight: 'bold',
            fontSize: 38
        }
    })
)(Typography); 

export const HeaderButtonContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }
    })
)(Box); 

export const HeaderActionButton = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFF',
            height: 48,
            minWidth: 120,
            marginRight: 10,
            borderColor: '#E5E5E5',
            borderStyle: 'solid',
            borderWidth: 1,
            textTransform: 'none',
            fontWeight: 'bold'
        }
    })
)(Button); 

// User Management - User Account - Dialog Content
export const UserAccountDialogContentContainer = withStyles(
    () => ({
        root: {

        }
    })
)(Box); 

export const NameContainer = withStyles(
    () => ({
        root: {
            width: '100%', 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between'
        }
    })
)(Box); 

export const NameInputContainer = withStyles(
    () => ({
        root: {
            width: '48%'
        }
    })
)(Box);

// User Management - User Account - UserAccountList
export const DecoratedPopoverButton = withStyles(
    () => ({
        root: {
            padding: 10,
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            border: 'none',
            height: 32,
            fontWeight: 'bold',
            justifyContent: 'space-between',
            '& .MuiIcon-root': {
                fontSize: 14
            },
            '& .MuiButton-label': {
                fontWeight: 300,
                fontSize: 12
            }
        }
    })
)(Button);

export const UserAccountListContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 226px)',
            width: '100%',
            display: 'flex', 
            flexDirection: 'column', 
            padding: '30px 50px 0 60px'
        }
    })
)(Box);

export const UserAccountListHeaderGridContainer = withStyles(
    () => ({
        root: {
            width: '100%', 
            minHeight: 70,
            maxHeight: 70,
            borderWidth: '0 0 2px 0', 
            borderColor: '#EDEDED', 
            borderStyle: 'solid',
            backgroundColor: '#F4F6F9',
            alignItems: 'center'
        }
    })
)(Grid);

export const UserAccountListHeaderGridItem = withStyles(
    () => ({
        root: {

        }
    })
)(Grid);

export const UserAccountListHeaderTypography = withStyles(
    () => ({
        root: {
            fontSize: 13
        }
    })
)(Typography);

export const UserAccountListBody = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 226px)',
            width: '100%',
            overflowY: 'auto'
        }
    })
)(Box);

export const UserAccountListBodyGridContainer = withStyles(
    () => ({
        root: {
            width: '100%', 
            minHeight: 80,
            maxHeight: 80,
            borderWidth: '0 0 2px 0', 
            borderColor: '#EDEDED', 
            borderStyle: 'solid', 
            alignItems: 'center'
        }
    })
)(Grid);

export const UserAccountListBodyGridItem = withStyles(
    () => ({
        root: {

        }
    })
)(Grid);

export const UserAccountListBodyTypography = withStyles(
    () => ({
        root: {
            fontSize: 13
        }
    })
)(Typography);

export const UserAccountListBodyRoleContainer = withStyles(
    () => ({
        root: {
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingRight: 20
        }
    })
)(Box);

export const UserAccountListAuxMenuContainer = withStyles(
    () => ({
        root: {
            display: 'flex', 
            flexDirection: 'column'
        }
    })
)(Box);

export const AddRoleButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#4C89F5',
            color: '#FFF',
            border: '1px solid #E5E5E5',
            height: 48,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#4C89F5',
            }
        }
    })
)(Button);

export const RoleListContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 70px',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const RoleListGrid = withStyles(
    () => ({
        root: {
            fontSize: 14,
            marginTop: 25,
            marginBottom: 25
        }
    })
)(Grid);

export const InnerCategoryListContainer = withStyles(
    () => ({
        root: {
            height: '62vh',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
    })
)(Box);

export const ModalContentContainer = withStyles(
    () => ({
        root: {
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            outline: 'none'
        }
    })
)(Box);

export const ModalDeleteContent = withStyles(
    () => ({
        root: {
            height: 150,
            width: 400,
            backgroundColor: '#FFF',
            padding: 30
        }
    })
)(Box);


export const ModalDeleteContentInnerBox = withStyles(
    () => ({
        root: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }
    })
)(Box);

export const ModalDeleteButtonContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        }
    })
)(Box);

export const ModalDeleteButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            color: '#FF4D4D',
            width: 80,
            height: 50,
            padding: '8px 0'
        }
    })
)(Button);

export const ModalDeleteCancelButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            color: '#000',
            width: 80,
            padding: '8px 0'
        }
    })
)(Button);

export const BlackLoading = withStyles(
    () => ({
        root: {
            color: '#000'
        }
    })
)(CircularProgress)
