import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const CustomerContactContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 128px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 0px',
            boxSizing: 'border-box',
            flex: 1,
        }
    })
)(Box);

export const CustomerContactCardContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            '&>.MuiBox-root': {
                width: 'calc(33.33% - 16px)',
                position: 'relative'
            },
            '&>.MuiBox-root:nth-child(3n+2)': {
                margin: '0px 20px'
            }
        }
    })
)(Box);

export const CustomerContactCard = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
            cursor: 'pointer',
            height: 150,
            borderRadius: 5,
            marginBottom: 12,
            display: 'flex',
            '&.add-variant-card': {
                border: '1px dashed #E5E5E5',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }
    })
)(Box);

export const CustomerContactImageContainer = withStyles(
    () => ({
        root: {
            height: 150,
            width: 100,
            minWidth: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Box);

export const CustomerContactDescriptionContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            height: '100%',
            display: 'inline-flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    })
)(Box);

export const CustomerContactAddContainer = withStyles(
    () => ({
        root: {
            alignItems: 'center',
            flex: 1,
            width: '100%',
            height: '100%',
            '& svg': {
                width: 32,
                height: 32
            },
            '& .MuiButton-label': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textTransform: 'none',
                color: SYMPHONY_PRIMARY_COLOR
            }
        }
    })
)(Button);

export const CustomerContactAuxContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
            position: 'absolute',
            top: 10,
            right: 10
        }
    })
)(Box);

export const CustomerContactAuxIconButton = withStyles(
    () => ({
        root: {
            width: 32,
            height: 32,
            '& svg': {
                width: 24,
                height: 24
            }
        }
    })
)(IconButton);


export const CustomerContactCardAvatarContainer = withStyles(
    () => ({
        root: { 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '16px 32px 32px',
            boxSizing: 'border-box'
        }
    })
)(Box);


export const CustomerContactCardAvatar = withStyles(
    () => ({
        root: { 
            height: 72,
            width: 72,
            boxSizing: 'border-box',
            padding: 16,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontSize: 14,
            textAlign: 'center',
            '& svg': {
                width: 52,
                height: 52
            },
            '& .MuiAvatar-img': {
                width: 72,
                height: 'auto',
                maxHeight: 72
            }
        }
    })
)(Avatar);