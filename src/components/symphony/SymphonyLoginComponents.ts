import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from './Colors';

export const SymphonyLoginContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            position: 'relative',
            '@media (min-width: 1366px)': {
                padding:'4rem'
            },
            '@media (max-width: 1365px)': {
                padding: '2rem'
            },
            '@media (max-width: 766px)': {
                padding: '1rem'
            }
        }
    })
)(Box); 

export const SymphonyLoginLogoContainer = withStyles(
    () => ({
        root: {
            position: 'absolute',
            backgroundColor: '#FFF',
            display: 'flex',
            left: '1em',
            right: 0,
            boxSizing: 'border-box',
            '& img': {
                width: 'auto',
                height: 50,
                objectFit: 'cover'
            },
            '@media (min-width: 1366px)': {
                left:'4rem',
                top: '4rem',
            },
            '@media (max-width: 1365px)': {
                left: '2rem',
                top: '2rem'
            },
            '@media (max-width: 766px)': {
                left: 0,
                right: 0,
                top: '15%',
                justifyContent: 'center'
            }
        }
    })
)(Box); 

export const SymphonyLoginFormContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            flexDirection: 'column'
        }
    })
)(Box); 

export const SymphonyLoginFormInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem',
            boxSizing: 'border-box',
            width: 400,
            flexDirection: 'column',
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
                right: 8
            },
            '& .MuiSelect-root' : {
                width: '100%'  
            },
            '& .selected-disabled': {
                color: '#969696'
            },
            '& .MuiFormHelperText-root.Mui-error': {
                display: 'none'
            },
            '& .MuiAutocomplete-popupIndicator': {
                marginRight: 4
            },
            '@media (max-width: 440px)': {
                width: 360
            },
            '@media (max-width: 400px)': {
                width: 320
            }
        }
    })
)(Box); 

export const SymphonyLoginWelcomeText = withStyles(
    () => ({
        root: {
            fontSize: 23,
            marginBottom: 32,
            fontWeight: 'bold'
        }
    })
)(Typography); 

export const SymphonyLoginButton = withStyles(
    () => ({
        root: {
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            width: 400,
            height: 44,
            transition: 'none',
            textTransform: 'none',
            '&.MuiButton-root.Mui-disabled': {
                color: '#FFF',
                backgroundColor: '#969696'
            },
            '&:hover': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
                opacity: 0.9
            },
            '@media (max-width: 440px)': {
                width: 360
            },
            '@media (max-width: 400px)': {
                width: 320
            }
        }
    })
)(Button);

export const SymphonyLoginTextContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: 400,
            marginTop: 32,
            color: '#959595',
            '& li': {
                textAlign: 'left',
                fontSize: 12
            },
            fontSize: 14,
            '@media (max-width: 440px)': {
                width: 360
            },
            '@media (max-width: 400px)': {
                width: 320
            }
        }
    })
)(Box); 

export const SymphonyForgotPasswordButton = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            marginLeft: 8,
            textTransform: 'none',
            padding: 0
        }
    })
)(Button);

export const SymphonyLoginAdornedInputContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            position: 'relative'
        }
    })
)(Box); 

export const SymphonyLoginAdornmentContainer = withStyles(
    () => ({
        root: {
            top: 0,
            bottom: 0,
            right: 44,
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Box); 
