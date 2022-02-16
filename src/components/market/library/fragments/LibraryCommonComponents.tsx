import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import { KeyboardTimePicker } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const SubHeader = withStyles(
    () => ({
        root: {
            color: '#959595',
            fontSize: 14,
            marginBottom: 40
        }
    })
)(Typography);

export const LibraryContentHeader = withStyles(
    () => ({
        root: {
            color: '#000',
            fontSize: 21,
            fontWeight: 'bold'
        }
    })
)(Typography);

export const LibraryInputLabel = withStyles(
    () => ({
        root: {
            color: '#000',
            fontSize: 15,
            fontWeight: 'bold'
        }
    })
)(Typography);

export const LibraryContentContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingLeft: 34,
            paddingRight: 30,
            paddingTop: 30,
            '& #media-add-image': {
                width: 220,
                height: 120,
                borderRadius: 5
            },
            '& .single-media': {
                width: 220,
                height: 120,
                borderRadius: 5
            },
            '& .single-media img': {
                width: 220,
                height: 120,
                borderRadius: 5,
                objectFit: 'contain'
            }
        }
    })
)(Box);

export const LibraryInputContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            display: 'flex',
            wordBreak: 'break-all',
            '& .MuiOutlinedInput-root': {
                height: '300px !important' as any
            },
            '& .ck': {
                height: '100% !important' as any,
                maxHeight: '300px'
            }
        }
    })
)(Box);

export const HelpDeskMediaInputContainer = withStyles(
    () => ({
        root: {
            width: '48%'
        }
    })
)(Box);

export const HelpDeskTimePicker = withStyles(
    () => ({
        root: {
            '& .MuiInputBase-root': {
                
            },
            '& .MuiInput-underline:before': {
                borderBottom: 0
            },
            '& .MuiInput-underline:after': {
                borderBottom: 0
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 0
            },
            '& .MuiInputBase-input.Mui-disabled': {
                color: '#000'
            }
        }
    })
)(KeyboardTimePicker);

export const LibraryTextField = withStyles(
    () => ({
        root: {
            width: '100%',
            marginRight: 16,
            borderRadius: 5,
            padding: '6px 0 5px',
            boxSizing: 'border-box',
            '&:before': {
                borderBottom: 'none'
            },
            '&:after': {
                borderBottom: 'none'
            },
            '&:hover:before': {
                borderBottom: 'none'
            },
            '& .MuiInputBase-root': {
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#E5E5E5',
                borderRadius: 5,
                padding: 5
            },
        }
    })
)(TextField);

export const FaqCancelButton = withStyles(
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
            width: 120,
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#FFF',
            }
        }
    })
)(Button); 

export const FaqApprovalButton = withStyles(
    () => ({
        root: {
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            padding: '8px 10px',
            width: 120,
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
                opacity: 0.5
            }
        }
    })
)(Button); 

export const FaqListContainer = withStyles(
    () => ({
        root: {
            overflow: 'auto',
            height: 'calc(100vh - 120px)',
            width: '100%',
            padding: '8px 32px',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const FaqEditContainer = withStyles(
    () => ({
        root: {
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%',
            '& .MuiInputBase-multiline.MuiInputBase-marginDense': {
                backgroundColor: '#fff'
            }
        }
    })
)(Box);


export const FaqInputContainer = withStyles(
    () => ({
        root: {
            padding: 15, 
            fontSize: 14, 
            backgroundColor: '#EDEDED'
        }
    })
)(Box);

export const FaqEditViewNumberContainer = withStyles(
    () => ({
        root: {
            width: 40, 
            textAlign: 'center', 
            paddingTop: 10
        }
    })
)(Box);

export const FaqEditViewButtonContainer = withStyles(
    () => ({
        root: {
            display: 'flex', 
            justifyContent: 'space-between', 
            width: 345, 
            paddingTop: 12, 
            paddingRight: 12
        }
    })
)(Box);

export const FaqListViewContainer = withStyles(
    () => ({
        root: {
            padding: 10, 
            fontSize: 14
        }
    })
)(Box);

export const FaqListViewQuestionContainer = withStyles(
    () => ({
        root: {
            backgroundColor: 'rgb(181, 121, 54, 0.2)', 
            height: 90, 
            paddingLeft: 30, 
            paddingRight: 15
        }
    })
)(Box);

export const FaqListQuestionHeaderContainer = withStyles(
    () => ({
        root: {
            color: 'white', 
            width: '100%', 
            height: 35, 
            display: 'flex', 
            justifyContent: 'space-between'
        }
    })
)(Box);

export const FaqListNumberContainer = withStyles(
    () => ({
        root: {
            paddingTop: 6,
            backgroundColor: SYMPHONY_PRIMARY_COLOR, 
            color: 'white', 
            textAlign: 'center', 
            width: 26, 
            height: 22
        }
    })
)(Box);

export const FaqListAnswerContainer = withStyles(
    () => ({
        root: {
            paddingLeft: 30,
            paddingRight: 15,
            paddingTop: 14,
            borderColor: '#E5E5E5',
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 3,
            height: 100,
            marginTop: 12,
            backgroundColor: '#fff'
        }
    })
)(Box);
