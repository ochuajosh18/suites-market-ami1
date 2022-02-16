import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dropdown from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';

export const CallTypeSettingsFieldBox = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 64px)',
            width: '100%',
            display: 'flex',
            flex: 1,
            boxSizing: 'border-box',
            flexDirection: 'column',
            '& ul.MuiList-root': {
                outline: 'none'
            }
        }
    })
)(Box);


export const CallTypeSettingsFieldHeaderBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            boxSizing: 'border-box',
            paddingRight: 4,
            height: 78,
            borderBottom: '2px solid #707070',
        },
    })
)(Box);

export const CallTypeSettingsFieldToggleButton = withStyles(
    () => ({
        root: {
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 7,
            height: 34,
            backgroundColor: '#E8E8E8',
            color: '#000',
            '&.Mui-selected': {
                backgroundColor: '#000000'
            },
            '&.Mui-selected .MuiToggleButton-label': {
                color: '#FFF'
            },
            '&.Mui-selected:hover': {
                opacity: 0.9,
                backgroundColor: '#000'
            }
        }
    })
)(ToggleButton);

export const CallTypeSettingsFieldToggleButtonGroup = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(ToggleButtonGroup);


export const CallTypeSettingsFieldButton= withStyles(
    () => ({
        root: {
            color: '#FFFFFF',
            textTransform: 'none',
            backgroundColor: '#000000',
            boxShadow: 'none',
            borderRadius: 8,
            height: 36,
            width: 144,
            position: 'absolute',
            top: 86,
            right: 30
        }
    })
)(Button);

export const CallTypeSettingsFieldInput = withStyles(
    () => ({
        root: {
            color: '#FFFFFF',
            textTransform: 'none',
            borderColor: '#000000',
            '& .MuiOutlinedInput-root': {
                '& .MuiOutlinedInput-input': {
                    padding: '10px 14px'
                },
                '& fieldset': { 
                    border: '1px solid #000',
                }
            }
        }
    })
)(TextField);

export const CallTypeSettingsFieldInputBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            padding: '20px 24px',
            flexDirection: 'column',
            overflowY: 'auto',
            boxSizing: 'border-box',
            height: 'calc(100vh - 142px)'
        }
    })
)(Box);

export const CallTypeSettingFieldDropdown = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none',
            '& .MuiOutlinedInput-root': {
                '& .MuiOutlinedInput-input': {
                    padding: '10px 14px'
                },
                '& fieldset': { 
                    border: '1px solid #000',
                }
            },
            '& .MuiAutocomplete-inputRoot': {
                padding: '0 32px 0 0'
            }
        }
    })
)(Dropdown); 

export const CallTypeSettingsFieldTypography= withStyles(
    () => ({
        root: {
            paddingTop: 16
        }
    })
)(Typography)

export const CallTypeSettingsFieldMenuBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: 48,
        },
    })
)(Box);

export const CallTypeSettingsFieldMenuGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            alignItems: 'center',
        },
    })
)(Grid);

export const CallTypeSettingsFieldTextBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            background: '#E6E6E6',
            border: '1px solid #000',
            borderRadius: 20,
            paddingLeft: '20px',
            height: '36px'
        }
    })
)(Box);

export const CallTypeSettingsFieldIconButton = withStyles(
    () => ({
        root: {
            color: '#000',
            padding: '0px 8px'
        }
    })
)(IconButton);

export const ViewLoadingBox = withStyles(
    () => ({
        root: { 
            height: 'calc(100vh - 168px)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
        }
    })
)(Box);

