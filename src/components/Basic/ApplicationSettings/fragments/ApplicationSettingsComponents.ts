import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { withStyles } from '@material-ui/styles';

export const TabContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            height: 64,
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: 16,
            borderBottom: '2px solid #808080',
            justifyContent: 'space-between'
        }
    })
)(Box);

export const SaveButton = withStyles(
    () => ({
        root: {
            backgroundColor: '#343232',
            minWidth: 100,
            '&:hover': {
                backgroundColor: '#343232',
                opacity: 0.8
            },
            '& .MuiButton-label': {
                textTransform: 'none',
                color: '#FFF'
            },
        }
    })
)(Button);

export const SettingsContainer = withStyles(
    () => ({
        root: {
            flex: 1,
            height: 'calc(100vh - 128px)',
            padding: 16
        }
    })
)(Box);

export const PermissionsButtonGroupContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Box);

export const PermissionsButtonGroup = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(ToggleButtonGroup);

export const PermissionsToggleButton = withStyles(
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
            '& .MuiToggleButton-label': {
                textTransform: 'none',
            },
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

export const PermissionIconButton = withStyles(
    () => ({
        root: {
            color: '#000'
        }
    })
)(IconButton);


export const PermissionsLabelContainer = withStyles(
    () => ({
        root: {
            height: 40,
            width: '100%',
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Box);

export const PermissionsRowContainer = withStyles(
    () => ({
        root: {
            height: 40,
            width: '100%',
            marginBottom: 8,
            paddingLeft: 8,
            boxSizing: 'border-box',
            position: 'relative'
        }
    })
)(Box);

export const PermissionsRow = withStyles(
    () => ({
        root: {
            height: 40,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #000',
            borderRadius: 24,
            padding: '8px 16px',
            boxSizing: 'border-box',
            backgroundColor: '#E6E6E6'
        }
    })
)(Box);