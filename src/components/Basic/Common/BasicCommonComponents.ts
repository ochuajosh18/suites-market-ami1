import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GridListTile from '@material-ui/core/GridListTile';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TreeItem from '@material-ui/lab/TreeItem';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/styles';

export const BasicField = withStyles(
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
            }
        }
    })
)(TextField);

export const BasicExpandedField = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none',
            '& .MuiOutlinedInput-root': {
                padding: '0 16px!important',
                '& .MuiOutlinedInput-input': {
                    paddingLeft: '8px!important'
                },
                '& fieldset': { 
                    border: '1px solid #000',
                    borderRadius: 24
                }
            }
        }
    })
)(TextField);

export const DropdownField = withStyles(
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
)(Autocomplete); 

export const IconRadioButton = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none',
            padding: 0,
            width: 32,
            height: 32
        }
    })
)(IconButton);

export const ListBox = withStyles(
    () => ({
        root: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            width: '100%',
            borderRight: '2px solid #707070',
            boxSizing: 'border-box',
            '& ul.MuiList-root': {
                outline: 'none'
            }
        }
    })
)(Box);

export const SearchBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '2px solid #707070',
            paddingRight: 4,
            height: 64
        }
    })
)(Box);

export const DetailHeaderBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 64,
            backgroundColor: '#999898',
            color: '#FFF',
            padding: '0 16px'
        }
    })
)(Box);

export const FieldBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            padding: '20px 24px',
            flexDirection: 'column',
            position: 'relative'
        }
    })
)(Box);

export const BasicMultilineField = withStyles(
    () => ({
        root: {
            width: '100%',
            '& .MuiOutlinedInput-root': {
                borderRadius: '1rem!important',
                height: '100%',
                width: '100%',
                paddingLeft: 24,
                '& .MuiOutlinedInput-input': {
                    height: '100%'
                },
                '& fieldset': {
                    borderColor: '#000'
                }
            },
            '& .MuiOutlinedInput-multiline': {
                padding: '18.5px 23px'
            }
        },
    })
)(TextField);

export const MediaTile = withStyles(
    () => ({
        root: {
            width: '130px!important',
            height: '150px!important',
            opacity: 0.8,
            position: 'relative',
            '& .MuiGridListTile-tile img': {
                height: 130,
                maxWidth: 130,
                maxHeight: 100,
                width: 'auto',
                '&.MuiGridListTile-imgFullHeight': {
                    left: 'unset',
                    height: 130,
                    transform: 'unset'
                }
            },
            '& .MuiGridListTile-tile': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 130,
                overflow: 'inherit'
            }
        }
    })
)(GridListTile)

export const MediaTileCover = withStyles(
    () => ({
        root: {
            top: -20,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
        }
    })
)(Box)

export const MediaTileLabelBox = withStyles(
    () => ({
        root: {
            left: 0,
            right: 0,
            bottom: -16,
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 12
        }
    })
)(Box)

export const MediaTileAddBox = withStyles(
    () => ({
        root: {
            width: '100%',
            height: 130,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            border: '1px dashed black',
            flexDirection: 'column',
            cursor: 'pointer',
            textAlign: 'center'
        }
    })
)(Box)

export const MediaTileAddIcon = withStyles(
    () => ({
        root: {
            fontSize: 40
        }
    })
)(AddCircleOutlineIcon)

export const MediaTileIcon = withStyles(
    () => ({
        root: {
            fontSize: 60,
            color: '#FFF'
        }
    })
)(PlayCircleOutlineIcon)

export const ScrollBox = withStyles(
    () => ({
        root: { 
            overflowY: 'auto'
        }
    })
)(Box);

export const GearIconButton = withStyles(
    () => ({
        root: { 
            '& .MuiIconButton-label': {
                width: 36,
                height: 36
            }
        }
    })
)(IconButton);

export const GearIcon = withStyles(
    () => ({
        root: {
            width: 30,
            height: 30
        }
    })
)(SettingsIcon);

export const BasicSwitch = withStyles(
    () => ({
        root: {
            '& .Mui-checked .MuiSwitch-thumb': {
                backgroundColor: 'black!important'
            },
            '& .MuiSwitch-track': {
                backgroundColor: '#9F9F9F!important'
            }
        }
    })
)(Switch);

export const BasicTabs = withStyles(
    () => ({
        root: {
           
        }
    })
)(Tabs);

export const BasicTab = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontWeight: 'bold'
        }
    })
)(Tab);

export const ListContainerBox = withStyles(
    () => ({
        root: { 
            height: 'calc(100vh - 128px)', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }
    })
)(Box);

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

export const ListHeaderContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '2px solid #B7B7B7',
            paddingRight: 8,
            paddingLeft: 20,
            height: 64,
            backgroundColor: '#999898',
            fontSize: 18,
            color: '#FFF'
        }
    })
)(Box);

export const InlineSearchBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            boxSizing: 'border-box',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px 8px',
            height: 64
        }
    })
)(Box);

export const ListToolContainer = withStyles(
    () => ({
        root: {
            position: 'absolute', 
            right: 8, 
            top: 0, 
            bottom: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 10
        }
    })
)(Box);

export const ListToolButton = withStyles(
    () => ({
        root: {
            padding: 6
        }
    })
)(IconButton);

export const HeaderButton = withStyles(
    () => ({
        root: {
            color: '#FFF',
            textTransform: 'none'
        }
    })
)(Button);

export const BasicFieldBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            height: 'calc(100vh - 144px)',
            overflowY: 'scroll',
            padding: '20px 24px',
            flexDirection: 'column',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const BasicFieldDateRangeBox = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }
    })
)(Box);

export const BasicTreeViewContainer = withStyles(
    () => ({
        root: {
            height: 200,
            border: '1px solid black',
            borderRadius: 15,
            boxSizing: 'border-box',
            padding: '10px 28px 10px 20px',
            overflowY: 'auto'
        }
    })
)(Box);

export const BasicDeleteButton = withStyles(
    () => ({
        root: {
            minWidth: 166,
            backgroundColor: '#EE6C62',
            borderRadius: 20,
            color: '#FFF',
            textTransform: 'none',
            '&:hover': {
                backgroundColor: '#EE6C62'
            }
        }
    })
)(Button);


export const CustomTreeItem = withStyles(
    () => ({
        root: {
            paddingLeft: 20,
            '& .MuiTreeItem-label': {
                padding: '8px 0'
            },
            marginBottom: 5
        }
    })
)(TreeItem);

export const BasicCategoryInputSelectedBox = withStyles(
    () => ({
        root: {
            padding: '12px 14px 0px',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTop: '1px solid black',
            borderLeft: '1px solid black',
            borderRight: '1px solid black',
            fontWeight: 'bold',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }
    })
)(Box);

export const BasicUpdatedField = withStyles(
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

export const SalesField = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
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

export const SalesTabs = withStyles(
    () => ({
        root: {
           
        }
    })
)(Tabs);

export const SalesTab = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontWeight: 'bold',
            minWidth: 'unset',
            width: 'unset',
            padding: 0,
            marginRight: 16
        }
    })
)(Tab);