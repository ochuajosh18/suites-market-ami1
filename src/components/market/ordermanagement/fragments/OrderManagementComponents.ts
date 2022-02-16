import Box from '@material-ui/core/Box';
// import ButtonBase from '@material-ui/core/ButtonBase';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';

export const OrderListContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const OrderImageContainer = withStyles(
    () => ({
        root: {
            height: 60, 
            width: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(Grid);

export const OrderGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    })
)(Grid);


export const OrderRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            padding: 12,
            boxSizing: 'border-box',
            width: '100%',
            textAlign: 'left',
            fontSize: 12,
            borderBottom: '1px solid #EDEDED',
            cursor: 'pointer',
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
                },
                '& .MuiSelect-icon': {
                    right: 8
                }
            },
        }
    })
)(Box);

export const OrderHeaderGridContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#F4F6F9', 
            padding: 12, 
            boxSizing: 'border-box',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Grid);

export const OrderHeaderGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    })
)(Grid);

export const OrderHeaderItem = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: 64,
            boxSizing: 'border-box',
            paddingRight: 16,
            cursor: 'pointer',
            '& .MuiSvgIcon-root': {
                color: '#959595'
            }
        }
    })
)(Box);

export const OrderStatusSelect = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
        }
    })
)(Select);

export const OrderItemListContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            marginTop: 16,
            '& .centered-column': {
                display: 'flex',
                justifyContent: 'center'
            }
        }
    })
)(Box);

export const OrderItemListHeaderGrid = withStyles(
    () => ({
        root: {
            color: '#959595',
            fontSize: 12,
            
        }
    })
)(Grid);

export const OrderItemListRowGrid = withStyles(
    () => ({
        root: {
            marginTop: 8,
            paddingBottom: 8,
            boxSizing: 'border-box',
            fontSize: 12,
            borderBottom: '1px solid #E5E5E5',
            height: 72,
            '& .MuiGrid-item': {
                display: 'flex',
                alignItems: 'center',
            },
        }
    })
)(Grid);

export const OrderItemImageContainer = withStyles(
    () => ({
        root: {
            height: 60,
            width: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2F2F2',
            '& img': {
                width: 48,
                height: 'auto',
                maxHeight: 60
            }
        }
    })
)(Box);

export const OrderStatusSelectContainer = withStyles(
    () => ({
        root: {
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
                },
                '& .MuiSelect-icon': {
                    right: 8
                }
            },
        }
    })
)(Box);

export const OrderJourneyIconContainer = withStyles(
    () => ({
        root: {
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center', 
            borderRadius: '100%', 
            width: 20, 
            height: 20,
            boxSizing: 'border-box',
            position: 'relative'
        }
    })
)(Box);

export const OrderJourneyContainer = withStyles(
    () => ({
        root: {
            padding: "5px",
            height: 26, 
            backgroundColor: "#F4F6F9",
            borderRadius: 20,
            margin: "54px 0 96px"
        }
    })
)(Box);

export const OrderJourneyInformationItem = withStyles(
    () => ({
        root: {
            position: "absolute",
            minWidth: "100px",
            color: "black",
            fontSize: "12px" 
        }
    })
)(Box);