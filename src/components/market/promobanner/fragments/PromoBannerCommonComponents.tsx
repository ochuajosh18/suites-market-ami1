import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckBox from '@material-ui/core/Checkbox';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { KeyboardDatePicker } from '@material-ui/pickers';
import RadioButtonCheckedSharpIcon from '@material-ui/icons/RadioButtonCheckedSharp';
import RadioButtonUncheckedSharpIcon from '@material-ui/icons/RadioButtonUncheckedSharp';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR, SYMPHONY_SECONDARY_COLOR_DARK } from '../../../symphony/Colors';

export const PromoBannerGrid = withStyles(
    () => ({
        root: { 
            width: '100%'
        }
    })
)(Grid);

export const PromoBannerGridContainer = withStyles(
    () => ({
        root: { 
            width: '100%'
        }
    })
)(Grid);

export const PromoBannerListContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'scroll',
            overflowX: 'hidden',
            padding: '0 20px 0 20px',
            height: 'calc(100% - 192px)'
        }
    })
)(Box);

export const PromoBannerTypography = withStyles(
    () => ({
        root: {
            marginBottom: 0
        }
    })
)(Typography);

export const PromoBannerTypographyContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flex: .04,
            padding: '0 30px 0px 30px'
        }
    })
)(Box);

export const PromoBannerPageContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
        }
    })
)(Box);

export const PromoBannerPageContentContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
        }
    })
)(Box);

export const BannerCardContainer = withStyles(
    () => ({
        root: {
            width: '95%', 
            height: '100%',
            borderRadius: 5, 
            borderWidth: 0.5, 
            borderColor: 'rgba(158, 150, 150, .5)', 
            borderStyle: 'solid'
        }
    })
)(Box)

export const AddInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            width: '65%',
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
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
                right: 'calc(5%)'
            },
            '& .MuiSelect-root' : {
                width: '100%',
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

export const PromoBannerTextField = withStyles(
    () => ({
        root: {
            width: '100%',
            marginRight: 16,
            border: '1px solid #E5E5E5',
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
            }
        }
    })
)(TextField);

export const PromoBannerInputMainContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
        }
    })
)(Box);

export const SearchInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            paddingLeft: 30,
            paddingRight: 30,
            justifyContent: 'center',
            boxSizing: 'border-box',
            marginTop: 12,
            alignItems: 'center',
            '& div': {
                marginBottom: 0
            }
        }
    })
)(Box)

export const PromoBannerDateContainer = withStyles(
    () => ({
        root: {
            width: '65%',
            marginBottom: 20
        }
    })
)(Box)

export const PromoBannerDatePickerMainContainer = withStyles(
    () => ({
        root: {
            width: '100%'
        }
    })
)(Box);

export const PromoBannerDatePickerContainer = withStyles(
    () => ({
        root: {
            width: '100%', 
            marginBottom: 20,
        }
    })
)(Box);

export const PromoBannerKeyboardDatePicker = withStyles(
    () => ({
        root: {
            paddingLeft: 10, 
            paddingRight: 10,
            '& .MuiInput-underline:before': {
                borderBottom: 0
            },
            '& .MuiInput-underline:after': {
                borderBottom: 0
            },
            '& .MuiInput-underline:hover': {
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
)(KeyboardDatePicker);

export const PromoBannerDatePickerLabel = withStyles(
    () => ({
        root: {
            fontSize: 12, 
            color: '#959595'
        }
    })
)(Typography);

export const PromoBannerCheckBoxContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row'
        }
    })
)(Box);

export const PromoBannerCheckBoxLabel = withStyles(
    () => ({
        root: {
            fontSize: 15, 
            color: '#000',
            marginLeft: 10
        }
    })
)(Typography);

export const PromoBannerCheckBoxInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '65%'
        }
    })
)(Box)

export const PromoBannerCheckBox = withStyles(
    () => ({
        root: {
            padding: 0
        }
    })
)(CheckBox);

export const PromoBannerCheckBoxCheckedIcon = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            fontSize: 17
        }
    })
)(RadioButtonCheckedSharpIcon);

export const PromoBannerUnCheckedBoxCheckedIcon = withStyles(
    () => ({
        root: {
            fontSize: 17
        }
    })
)(RadioButtonUncheckedSharpIcon);

export const PromoBannerHeaderMainContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%'
        }
    })
)(Box);

export const DecoratedPopoverButton = withStyles(
    () => ({
        root: {
            padding: 4,
            minWidth: 96,
            textTransform: 'none',
            boxSizing: 'border-box',
            border: 'none',
            height: 32,
            fontWeight: 'bold',
            '& .MuiIcon-root': {
                fontSize: 14
            }
        }
    })
)(Button);

export const PromoBannerHeaderContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column'
        }
    })
)(Box);

export const PromoBannerHeader = withStyles(
    () => ({
        root: {
            fontSize: 30,
            color: '#000',
            fontWeight: 'bold'
        }
    })
)(Typography);

export const PromoBannerSubHeader = withStyles(
    () => ({
        root: {
            fontSize: 15,
            color: '#959595'
        }
    })
)(Typography);

export const RightMainInputContainer = withStyles(
    () => ({
        root: {
            width: '90%',
            marginTop: 50
        }
    })
)(Box);

export const RightInputContainer = withStyles(
    () => ({
        root: {
            width: '100%'
        }
    })
)(Box);

export const PromoBannerRightContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            paddingTop: 60,
            paddingLeft: 35
        }
    })
)(Box);

export const PromoBannerImageContainer = withStyles(
    () => ({
        root: {
            height: 200,
            width: '100%',
            '& img': {
                height: 120,
                width: 220,
                backgroundColor: 'orange',
                borderRadius: 5,
                boderWidth: 0,
                borderColor: 'tranparent',
                marginRight: 20
            }
        }
    })
)(Box);

export const PromoBannerImageRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }
    })
)(Box);

export const PromoBannerImageLabel = withStyles(
    () => ({
        root: {
            fontSize: 12, 
            color: '#959595',
            marginBottom: 10
        }
    })
)(Box);

export const PromoBannerChangeButton = withStyles(
    () => ({
        root: {
            height: 120,
            width: 220,
            borderRadius: 5,
            borderColor: '#C6C6C6',
            borderWidth: 1,
            borderStyle: 'dashed',
            display: 'flex',
            flexDirection: 'column',
            textTransform: 'none',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Button);

export const PromoBannerChangeButtonContent = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Box);

export const PromoBannerChangeButtonIcon = withStyles(
    () => ({
        root: {
            fontSize: 35,
            color: SYMPHONY_PRIMARY_COLOR,
            marginBottom: 10
        }
    })
)(AddCircleIcon);

export const PromoBannerChangeButtonLabel = withStyles(
    () => ({
        root: {
            fontSize: 14,
            color: SYMPHONY_PRIMARY_COLOR
        }
    })
)(Typography);

export const PromoBannerModal = withStyles(
    () => ({
        root: {

        }
    })
)(Modal);

export const PromoBannerModalContentContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            height: '60vh',
            width: '50vw',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 5
        }
    })
)(Box);

export const PromoBannerModalLabelContainer = withStyles(
    () => ({
        root: {
            padding: '5px 20px 5px 20px',
            backgroundColor: SYMPHONY_SECONDARY_COLOR_DARK,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50
        }
    })
)(Box);

export const PromoBannerModalCategoryListContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100% - 50px)',
            overflow: 'auto'
        }
    })
)(Box);

export const PromoBannerModalCloseIcon = withStyles(
    () => ({
        root: {
           color: '#FFF'
        }
    })
)(CloseIcon);

export const PromoBannerModalLabel = withStyles(
    () => ({
        root: {
            fontWeight: 'bold',
            fontSize: 20,
            color: '#FFF'
        }
    })
)(Typography);



export const TierOneRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            height: 70,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'none',
            padding: '0px 15px 0 15px',
            borderRadius: 0,
            borderBottomWidth: 1,
            borderColor: '#E5E5E5',
            borderStyle: 'solid'
        }
    })
)(Button);

export const TierTwoRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            height: 70,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'none',
            padding: '0px 15px 0 100px',
            borderRadius: 0,
            borderBottomWidth: 1,
            borderColor: '#E5E5E5',
            borderStyle: 'solid'
        }
    })
)(Button);

export const TierThreeRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            height: 70,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'none',
            padding: '0px 15px 0 200px',
            borderRadius: 0,
            borderBottomWidth: 1,
            borderColor: '#E5E5E5',
            borderStyle: 'solid'
        }
    })
)(Button);

export const PromoBannerImageNameContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            heigth: 100,
            width: 'calc(100% - 1.5rem)',
            '& img': {
                height: 50,
                width: 50
            }
        }
    })
)(Box);

export const PromoBannerRowLabel = withStyles(
    () => ({
        root: {
            marginLeft: 20
        }
    })
)(Typography);

export const SelectedCategoryRowContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            minHeight: 43,
            borderColor: '#E5E5E5',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 5,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }
    })
)(Box);

export const PromoBannerCategoryInputLabel = withStyles(
    () => ({
        root: {
            color: "#959595",
            fontSize: 12
        }
    })
)(Typography);

export const PromoBannerSelectedCategoryRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            padding: '0 10px 0 10px'
        }
    })
)(Box);

export const PromoBannerSelectedCategoryRowLabel = withStyles(
    () => ({
        root: {
            color: "#000",
            fontSize: 14
        }
    })
)(Typography);

export const PromoBannerCategoryInputContainer = withStyles(
    () => ({
        root: {

        }
    })
)(Box);

export const PromoBannerSaveLoading = withStyles(
    () => ({
        root: {
            color: '#FFF'
        }
    })
)(CircularProgress);

export const ModalContainer = withStyles(
    () => ({
        root: {

        }
    })
)(Modal);

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

export const ModalDeleteTextContainer = withStyles(
    () => ({
        root: {

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

export const BlackLoading = withStyles(
    () => ({
        root: {
            color: '#000'
        }
    })
)(CircularProgress)

export const ModalTypography = withStyles(
    () => ({
        root: {
            
        }
    })
)(Typography);


