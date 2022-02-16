import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { withStyles } from '@material-ui/styles';
import Editicon from '@material-ui/icons/Edit';
import Deleteicon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress'
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const CategoryGrid = withStyles(
    () => ({
        root: {
            height: '100%',
            width: '100%',
            paddingTop: 20,
            paddingLeft: 50,
            paddingRight: 50,
        }
    })
)(Grid);

export const CategoryGridItem = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Grid);

export const CategoryBox = withStyles(
    () => ({
        root: {
            height: '95%',
            width: '90%'
        }
    })
)(Box);

export const CategoryContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flex: 1,
        }
    })
)(Box);

export const CategoryHeader = withStyles(
    () => ({
        root: {
            height: '50px',
            backgroundColor: '#F8F9FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
)(Box);

export const CategoryHeaderText = withStyles(
    () => ({
        root: {
            fontWeight: 600,
            fontSize: 13
        }
    })
)(Typography);

export const CategoryTextField = withStyles(
    () => ({
        root: {
            padding: '6px 0 6px 12px',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            height: 44,
            fontSize: 12,
            '& input': {
                paddingLeft: 'unset!important',
                fontSize: 13
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
            },
            '& input::placeholder': {
                fontSize: 13
            }
        }
    })
)(TextField);

export const CategoryButtonBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F8F9FB',
        }
    })
)(Box);

export const CategoryButton = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '99%',
            height: 35,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#C6C6C6'
        }
    })
)(Button);

export const AddIcon = withStyles(
    () => ({
        root: {
            fontSize: 18,
            color: SYMPHONY_PRIMARY_COLOR
        }
    })
)(AddCircleIcon);

export const EditIcon = withStyles(
    () => ({
        root: {
            fontSize: 18,
            color: '#959595',
            marginRight: 5
        }
    })
)(Editicon);

export const DeleteIcon = withStyles(
    () => ({
        root: {
            fontSize: 18,
            color: '#959595'
        }
    })
)(Deleteicon);

export const IconContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            transform: 'translateX(60px)',
            opacity: 0
        }
    })
)(Box);

export const CategoryListContainer = withStyles(
    () => ({
        root: {
            height: '57vh',
            marginTop: 20,
            borderWidth: 1,
            borderRadius: 3,
            borderStyle: 'solid',
            borderColor: '#E5E5E5',
            overflowY: 'auto',
            overflowX: 'hidden'
        },
    })
)(Box);

export const CategoryRowButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            width: '100%',
            paddingTop: 10,
            paddingLeft: 20,
            paddingBottom: 10,
            boxSizing: 'border-box',
            borderBottom: "1px solid #E5E5E5",
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& *': { transition: 'all 200ms linear' },
            '&:hover': {
                '& .icon-container': { 
                    transform: 'translateX(-24px)',
                    opacity: 1
                },
            }
        }
    })
)(Box);

export const CategoryRowName = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontSize: 12,
            marginLeft: 20,
            wordBreak: 'break-word',

        }
    })
)(Typography);

export const CategoryLeftBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'calc(100% - 60px)',
            '& img': {
                height: 50, 
                width: 50, 
                borderRadius: 10, 
                borderWidth: 0, 
                objectFit: 'cover', 
                overflow: 'hidden'
            }
        }
    })
)(Box);

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

export const ModalContent = withStyles(
    () => ({
        root: {
            height: 400,
            width: 400,
            backgroundColor: '#FFF',
            padding: 40
        }
    })
)(Box);

export const ModalTitle = withStyles(
    () => ({
        root: {
            fontSize: 20
        }
    })
)(Typography);

export const ModalImageContainer = withStyles(
    () => ({
        root: {
            height: 200,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            '& img' : {
                height: 100, 
                width: 100, 
                objectFit: 'cover'
            }
        }
    })
)(Box);

export const ModalImageBox = withStyles(
    () => ({
        root: {
            height: 100,
            width: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: '#C6C6C6'
        }
    })
)(Button);

export const ModalAddIcon = withStyles(
    () => ({
        root: {
            fontSize: 25,
            color: SYMPHONY_PRIMARY_COLOR
        }
    })
)(AddCircleIcon);

export const ModalTypography = withStyles(
    () => ({
        root: {
            
        }
    })
)(Typography);

export const ModalUploadImageButton = withStyles(
    () => ({
        root: {
            fontSize: 14,
            color: SYMPHONY_PRIMARY_COLOR,
            marginTop: 10,
            textTransform: 'none'
        }
    })
)(Button);

export const ModalInputContainer = withStyles(
    () => ({
        root: {
            marginTop: 20
        }
    })
)(Box);

export const ModalButtonContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }
    })
)(Box);

export const ModalCancelButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            width: '48%',
            height: 50,
            textTransform: 'capitalize',
            color: SYMPHONY_PRIMARY_COLOR,
            borderWidth: 1,
            borderColor: SYMPHONY_PRIMARY_COLOR,
            borderStyle: 'solid'
        }
    })
)(Button);

export const ModalSaveButton = withStyles(
    () => ({
        root: {
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            width: '48%',
            height: 50,
            textTransform: 'capitalize',
            color: '#FFF'
        }
    })
)(Button);

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

export const CategoryTypography = withStyles(
    () => ({
        root: {

        }
    })
)(Typography);

export const CategoryFullHeightWidth = withStyles(
    () => ({
        root: {
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
)(Box);

export const Loading = withStyles(
    () => ({
        root: {
            color: '#FFF'
        }
    })
)(CircularProgress)

export const BlackLoading = withStyles(
    () => ({
        root: {
            color: '#000'
        }
    })
)(CircularProgress)
