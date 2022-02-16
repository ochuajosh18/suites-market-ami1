import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from '../../Colors';

export const FieldsAddSectionButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            color: SYMPHONY_PRIMARY_COLOR,
            padding: '8px 10px',
            minWidth: 32,
            marginRight: 16,
            width: 144,
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
                backgroundColor: '#FFF',
            }
        }
    })
)(Button);

export const DraggableContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            height: '100%',
        }
    })
)(Box); 

export const FieldSectionsContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            width: '60%',
            height: '100%',
            overflowY: 'auto',
            borderRight: '1px solid #969696'
        }
    })
)(Box); 

export const FieldInstructionContainer = withStyles(
    () => ({
        root: {
            marginTop: 12,
            marginBottom: 8,
            fontSize: 12,
            color: '#959595'
        }
    })
)(Box); 

export const FieldSectionsBlock = withStyles(
    () => ({
        root: {
            width: 'calc(100% - 36px)',
            position: 'relative'
        }
    })
)(Box); 

export const FieldSectionsBlockAuxContainer = withStyles(
    () => ({
        root: {
            width: 32,
            position: 'absolute',
            right: -20,
            top: 36
        }
    })
)(Box); 

export const FieldSectionContainer = withStyles(
    () => ({
        root: {
            minHeight: 72,
            borderRadius: 5,
            marginBottom: 10,
            borderLeft: `8px solid ${SYMPHONY_PRIMARY_COLOR}`,
            backgroundColor: '#F8F9FB',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
        }
    })
)(Box); 

export const FieldSectionNameContainer = withStyles(
    () => ({
        root: {
            fontSize: 20,
            fontWeight: 'bold',
            cursor: 'text',
            wordBreak: 'break-all'
        }
    })
)(Box); 

export const FieldDraggableContainer = withStyles(
    () => ({
        root: {
            height: 40,
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFF',
            '&:hover': {
                '& .field-aux': {
                    width: 48,
                    visibility: 'visible',
                    opacity: 1
                }
            }
        }
    })
)(Box); 


export const DraggableFieldDeleteContainer = withStyles(
    () => ({
        root: {
            transitionDuration: '300ms',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            width: 0,
            opacity: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            visibility: 'hidden'
        }
    })
)(Box); 


export const DraggableFieldDeleteIconContainer = withStyles(
    () => ({
        root: {
            width: 28,
            height: 28,
            '& svg': {
                width: 28,
                height: 28
            }
        }
    })
)(IconButton);

export const FieldBadge = withStyles(
    () => ({
        root: {
            borderRadius: '50%',
            backgroundColor: '#121212',
            color: '#FFF',
            height: 18,
            width: 18,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 11
        }
    })
)(Box); 

export const FieldDetailsContainer = withStyles(
    () => ({
        root: {
            height: 40,
            marginLeft: 8,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 5,
            border: '1px solid #E5E5E5',
            width: '100%',
            fontSize: 12,
            '& .MuiGrid-root': {
                display: 'flex',
                alignItems: 'center',
            },
            '& .MuiGrid-root:last-child': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: 4
            }
        }
    })
)(Box); 

export const FieldEditButton = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            padding: 4,
            textTransform: 'none'
        }
    })
)(Button);

export const FieldElementsContainer = withStyles(
    () => ({
        root: {
            width: '40%',
            boxSizing: 'border-box',
            paddingLeft: 32,
            display: 'flex',
            flexDirection: 'column'
        }
    })
)(Box); 

export const FieldElementsHeaderContainer = withStyles(
    () => ({
        root: {
            paddingTop: 16,
            boxSizing: 'border-box',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18
        }
    })
)(Box); 

export const FieldElementsHeaderTextContainer = withStyles(
    () => ({
        root: {
            fontSize: 24,
            fontWeight: 'bold'
        }
    })
)(Box); 

export const FieldElementSearchInput = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
            marginBottom: 10,
            borderRadius: 5,
            padding: '6px 0 6px 12px',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            height: 44,
            '& input': {
                paddingLeft: 'unset!important'
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:before': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:after': {
                borderBottom: 'none'
            },
            '& .MuiInput-underline:hover': {
                borderBottom: 'none'
            }
        }
    })
)(TextField);

export const ElementsDraggableContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: 'calc(100vh - 396px)',
            paddingTop: 4,
            overflowY: 'auto',
            transitionDuration: '300ms',
            transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        }
    })
)(Box); 

export const FieldsDraggablePlaceholderContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            color: '#959595',
            fontSize: 12,
            borderRadius: 5,
            border: '1px dashed #969696',
            height: 40
        }
    })
)(Box); 

export const FieldDialog = withStyles(
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

export const FieldDialogTitle = withStyles(
    () => ({
        root: {

        }
    })
)(DialogTitle); 

export const FieldDialogContent = withStyles(
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

export const FieldDialogActions = withStyles(
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

export const FieldDialogCancelButton = withStyles(
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

export const FieldDialogSaveButton = withStyles(
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
