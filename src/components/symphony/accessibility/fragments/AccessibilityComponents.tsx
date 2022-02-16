import React from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from '../../Colors';

export const SaveAccessibilityButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            border: '1px solid #E5E5E5',
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

export const AccessibilityContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            padding: 30,
            boxSizing: 'border-box',
            height: 'calc(100vh - 120px)',
            overflowY: 'auto',
            width: '100%'
        }
    })
)(Box);

export const AccessibilityContentContainer = withStyles(
    () => ({
        root: {
            boxSizing: 'border-box',
            width: '100%',
        }
    })
)(Box);

export const DropdownContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
        }
    })
)(Box);

export const InputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            width: '100%',
            height: 48,
            alignItems: 'center',
            '& .MuiInputBase-root': {
                width: '100%',
                marginRight: 16,
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
                right: 'calc(26%)'
            },
            '& .MuiSelect-root' : {
                width: '70%'  
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
)(Box);

export const AccessibilityGrid = withStyles(
    () => ({
        root: {

        }
    })
)(Grid);

export const SubHeaderContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }
    })
)(Box);

export const HeaderText = withStyles(
    () => ({
        root: {
            letterSpacing: 0,
            color: '#121212',
            opacity: 1,
            fontWeight: 'bold',
            fontSize: '25px'
        }
    })
)(Typography);

export const SubHeaderText = withStyles(
    () => ({
        root: {
            letterSpacing: 0,
            color: '#959595',
            opacity: 1,
            fontSize: '15px'
        }
    })
)(Typography);

export const TabsContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            marginTop: 20
        }
    })
)(Box);

export const AccessibilityTabs = withStyles(
    () => ({
        root: {
            width: '100%',
            borderRadius: 5,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#EDEDED',
        }
    })
)(Button);

export const TableHeaderContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            backgroundColor: '#F8F9FB',
            border: '1px solid #E5E5E5',
            height: 64,
            boxSizing: 'border-box',
            marginTop: 15,
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Box);

export const TableBodyContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            paddingBottom: 32,
            boxSizing: 'border-box',
            flexDirection: 'column',  
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
            '& .accessibility-crud-row:last-child': {
                borderBottom: '1px solid #E5E5E5'
            }
        }
    })
)(Box);

export const TableRowContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            backgroundColor: '#F8F9FB',
            border: '1px solid #E5E5E5',
            height: 64,
            boxSizing: 'border-box',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Box);

export const HorizontalContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            height: 64
        }
    })
)(Box);

export const AccessibilityCheckbox = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            '&$checked': {
                color: '#FFFFFF',
            },
        }
    })
)((props: CheckboxProps) => <Checkbox color="default" {...props} />);


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

export const AddRoleButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            border: '1px solid #E5E5E5',
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

export const RoleListGrid = withStyles(
    () => ({
        root: {
            fontSize: 14,
            marginTop: 25,
            marginBottom: 25
        }
    })
)(Grid);

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