import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

export const ProductsContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#F4F6F9',
           display: 'flex',
           flexDirection: 'column',
           height: 'calc(100vh - 120px)'
        }
    })
)(Box);

export const ProductsContentContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#FFFFFF',
           display: 'flex',
        }
    })
)(Box);

export const ProductsTabsContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#F4F6F9',
           boxSizing: 'border-box',
           display: 'flex',
           padding: '24px 32px 0',
           justifyContent: 'space-between',
        }
    })
)(Box);

export const AddProductButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            height: 48,
            borderRadius: 5,
            fontWeight: 'bold',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
                opacity: 0.5
            }
        }
    })
)(Button);

export const ProductListContainer = withStyles(
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


export const ProductLoadingContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A2A2A2'
        }
    })
)(Box);


export const ProductRowContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            padding: 12,
            boxSizing: 'border-box',
            width: '100%',
            textAlign: 'left'
        }
    })
)(ButtonBase);

export const ProductGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    })
)(Grid);

export const ProductImageContainer = withStyles(
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

export const ProductViewContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const ProductViewBackButton = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            padding: 0,
            minWidth: 32,
            marginRight: 16
        }
    })
)(Button);

export const ProductHeaderButton = withStyles(
    () => ({
        root: {
            marginLeft: 16,
            minWidth: 96,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            color: '#FFF',
            height: 48,
            fontWeight: 'bold',
            '& .MuiIcon-root': {
                fontSize: 14
            },
            '&:hover': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
                opacity: 0.5
            }
        }
    })
)(Button);

export const ProductViewTabsContainer = withStyles(
    () => ({
        root: {
            width: 150
        }
    })
)(Box);

export const ProductViewContentContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            paddingTop: 20
        }
    })
)(Box);

export const ProductViewTabs = withStyles(
    () => ({
        root: {
           
        }
    })
)(Tabs);

export const ProductViewTab = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontWeight: 'bold',
            minWidth: 'unset',
            width: 'unset',
            padding: 0,
            marginBottom: 8,
            fontSize: 13,
            minHeight: 18,
            height: 18,
            '& .MuiTab-wrapper': {
                alignItems: 'flex-start',
                minHeight: 18,
                height: 18,
            },
            '&.MuiTab-textColorInherit:not(.Mui-selected)': {
                color: '#969696',
                opacity: 1
            }
        }
    })
)(Tab);

export const ProductViewCommonInfoContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            boxSizing: 'border-box',
            flex: 1
        }
    })
)(Box);

export const ProductViewCommonInfoInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: '24px 0'
        }
    })
)(Box);

export const ProductVariantsContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 0px',
            boxSizing: 'border-box',
            flex: 1,
        }
    })
)(Box);

export const ProductVariantsCardContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            '&>.MuiBox-root': {
                width: 'calc(33.33% - 16px)'
            },
            '&>.MuiBox-root:nth-child(3n+2)': {
                margin: '0px 20px'
            }
        }
    })
)(Box);

export const ProductVariantsCard = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
            cursor: 'pointer',
            height: 195,
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

export const ProductVariantsImageContainer = withStyles(
    () => ({
        root: {
            height: 195,
            width: 130,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F2F2F2',
            '& img': {
                width: 130,
                height: 'auto',
                maxHeight: 195
            }
        }
    })
)(Box);

export const ProductVariantDescriptionContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            height: '100%',
            display: 'inline-flex',
            justifyContent: 'center',
            padding: '0 12px',
            flexDirection: 'column'
        }
    })
)(Box);

export const ProductVariantAddContainer = withStyles(
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

export const ProductVariantAuxContainer = withStyles(
    () => ({
        root: {
            height: '100%',
            width: '50%',
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
            padding: 10,
        }
    })
)(Box);

export const ProductAuxIconButton = withStyles(
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

export const ProductVariantContentContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            paddingTop: 20
        }
    })
)(Box);

export const ProductVariantsViewContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 196px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            boxSizing: 'border-box',
            flex: 1
        }
    })
)(Box);

export const ProductVariantsInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: '24px 0'
        }
    })
)(Box);

export const ProductVariantsAuxContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Box);

export const ProductAuxButton = withStyles(
    () => ({
        root: {
            width: 24,
            height: 24,
            '& svg': {
                width: 24,
                height: 24
            }
        }
    })
)(IconButton);