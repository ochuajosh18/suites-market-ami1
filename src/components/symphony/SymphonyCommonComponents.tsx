import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/styles';
import { SYMPHONY_PRIMARY_COLOR } from './Colors';

export const SymphonyBackButton = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            padding: 0,
            minWidth: 32,
            marginRight: 16
        }
    })
)(Button);

export const SymphonyTabs = withStyles(
    () => ({
        root: {
            
        }
    })
)(Tabs);

export const SymphonyTab = withStyles(
    () => ({
        root: {
            textTransform: 'none',
            fontWeight: 'bold',
            minWidth: 'unset',
            width: 'unset',
            padding: 0,
            marginRight: 16,
            '&.MuiTab-textColorInherit:not(.Mui-selected)': {
                color: '#969696',
                opacity: 1
            }
        }
    })
)(Tab);



export const SymphonyViewTabs = withStyles(
    () => ({
        root: {
           
        }
    })
)(Tabs);

export const SymphonyViewTab = withStyles(
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
            // height: 18,
            '& .MuiTab-wrapper': {
                alignItems: 'flex-start',
                minHeight: 18,
                // height: 18,
            },
            '&.MuiTab-textColorInherit:not(.Mui-selected)': {
                color: '#969696',
                opacity: 1
            }
        }
    })
)(Tab);

export const SymphonyViewTabsContainer = withStyles(
    () => ({
        root: {
            width: 150
        }
    })
)(Box);

// Component to use as the content of your view area
export const SymphonyViewContentContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            paddingTop: 20
        }
    })
)(Box);

// component to use for landing page of an entity view
export const SymphonyViewCommonInfoContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 240px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            boxSizing: 'border-box',
            flex: 1
        }
    })
)(Box);

// Component to use for the landing page of an info view (scrollable that usually contains headers and inputs )
export const SymphonyViewInfoContainer = withStyles(
    () => ({
        root: {
            overflowY: 'auto',
            height: 'calc(100vh - 240px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            boxSizing: 'border-box',
            flex: 1,
            position: 'relative'
        }
    })
)(Box);

// Component to use for the inputs of inside of your InfoContainer
export const SymphonyViewInputContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            padding: '24px 0',
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
                width: '100%',
                fontSize: 12,
                paddingLeft: 18
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
        }
    })
)(Box);

// Master Component for all textfield inside Symphony
export const SymphonyField = withStyles(
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

export const SymphonySectionHeaderContainer = withStyles(
    () => ({
        root: {
            display: 'flex'
        }
    })
)(Box);

export const SymphonySectionHeaderTitleContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: 20,
            fontWeight: 'bold'
        }
    })
)(Box);

export const SymphonySectionHeaderSubTitleContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            paddingTop: 4,
            color: '#959595',
            fontWeight: 'normal'
        }
    })
)(Box);

export const SymphonyInputGridContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            color: '#959595',
            position: 'relative'
        }
    })
)(Grid);

export const SymphonyInputLabelGridContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            color: '#959595'
        }
    })
)(Grid);

export const SymphonyInputGridItemContainer = withStyles(
    () => ({
        root: {
            fontSize: 12,
            paddingTop: 6,
            fontWeight: 'normal',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '& .MuiChip-deleteIcon': {
                color: '#FF535B'
            },
            '& .MuiFormControl-root': {
                width: '100%'
            }
        }
    })
)(Grid);

export const SymphonyTextField = withStyles(
    () => ({
        root: {
            '& input': {
                fontSize: 12,
                border: '1px solid #E5E5E5',
                borderRadius: 5,
                padding: '6px 0 6px 18px!important',
                boxSizing: 'border-box',
                backgroundColor: '#FFF',
                minHeight: 44
            },
            '& textarea': {
                fontSize: 12,
                border: '1px solid #E5E5E5',
                borderRadius: 5,
                padding: '6px 0 6px 18px!important',
                boxSizing: 'border-box',
                backgroundColor: '#FFF',
                minHeight: 100,
            },
            '& input.Mui-disabled, textarea.Mui-disabled, .MuiInputAdornment-root.disabled-adornment': {
                backgroundColor: '#F8F9FB'
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
            '& .MuiInputAdornment-root': {
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 0,
                borderColor: '#E5E5E5',
                borderStyle: 'solid',
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                height: 44,
                marginRight: 0,
                marginLeft: 0,
                boxSizing: 'border-box',
                maxHeight: 'unset',
                cursor: 'pointer',
                '& .MuiTypography-root': {
                    fontSize: '12px!important'
                },
                '&.MuiInputAdornment-positionEnd': {
                    borderRightWidth: 1,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    borderLeft: 0,
                    paddingRight: 10,
                },
                '&.MuiInputAdornment-positionStart': {
                    paddingLeft: 8
                }

            },
            '& .MuiInput-input.MuiInputBase-inputAdornedStart': {
                borderLeft: 0,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                padding: '6px 0 6px 10px!important',
            },
            '& .MuiInput-input.MuiInputBase-inputAdornedEnd': {
                borderRight: 0,
                borderLeftWidth: 1,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                padding: '6px 10px 6px 18px!important'
            },
            "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                display: "none"
            }
        }
    })
)(TextField);



export const SymphonyDropdownSearchableField = withStyles(
    () => ({
        root: {
            border: '1px solid #E5E5E5',
            borderRadius: 5,
            padding: '6px 6px 6px 18px!important',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',
            minHeight: 44,
            maxHeight: 100,
            overflowX: 'hidden',
            overflowY: 'auto',
            '& input': {
                fontSize: 12,
                paddingLeft: '0!important'
            },
            '& input.Mui-disabled': {
                backgroundColor: '#F8F9FB'
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

export const SymphonyIconRadioButton = withStyles(
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

export const SymphonyMediaContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }
    })
)(Box);

export const SymphonyMediaListHeaderContainer = withStyles(
    () => ({
        root: {
           color: '#969696',
           fontSize: 12,
           marginBottom: 12
        }
    })
)(Box);

export const SymphonyMediaListContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            cursor: 'pointer',
            '&>.MuiBox-root': {
                width: 'calc(16.66% - 40px)',
                height: 140,
                backgroundColor: '#F3F3F3'
            },
            '&>.MuiBox-root:nth-child(2),>.MuiBox-root:nth-child(3),>.MuiBox-root:nth-child(4),>.MuiBox-root:nth-child(5),>.MuiBox-root:nth-child(6)': {
                marginLeft: 18
            },
            '@media (min-width:1500px)': {
                '&>.MuiBox-root': {
                    width: 'calc(16.66% - 40px)',
                    height: 180,
                    backgroundColor: '#F3F3F3'
                },
            },
        }
    })
)(Box);

export const SymphonyMediaItemContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
            position: 'relative',
            '& .symphony-media': {
                width: '100%',
                height: 'auto',
                maxHeight: 140
            },
            '&.add-media-card': {
                backgroundColor: 'transparent',
                border: '1px dashed #E5E5E5',
                justifyContent: 'center',
                alignItems: 'center',
            },
            '@media (min-width:1500px)': {
                '& .symphony-media': {
                    width: '100%',
                    height: 'auto',
                    maxHeight: 180
                },
            },
            '&:hover': {
                '& .media-delete-btn': {
                    display: 'block'
                }
            }
        }
    })
)(Box);

export const SymphonyMediaDeleteButton = withStyles(
    () => ({
        root: {
            display: 'none',
            backgroundColor: '#FF2D55',
            color: '#FFF',
            padding: 0,
            top: 6,
            right: 6,
            width: 16,
            height: 16,
            zIndex: 100,
            position: 'absolute',
            '& svg': {
                width: 14,
                height: 14
            },
            '@media (min-width: 1366px)': {
                width: 20,
                height: 20,
                '& svg': {
                    width: 16,
                    height: 16
                },
            },
            '&:hover': {
                backgroundColor: '#FF2D55',
            }
        }
    })
)(IconButton);

export const SymphonyMediaAddContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
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

export const SymphonyMediaItemDecorationContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            backgroundColor: 'transparent',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    })
)(Box);

export const SymphonyContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#F4F6F9',
           display: 'flex',
           flexDirection: 'column',
           height: 'calc(100vh - 120px)',
           width: '100%',
           boxSizing: 'border-box'
        }
    })
)(Box);

export const SymphonyTabsContainer = withStyles(
    () => ({
        root: {
           boxSizing: 'border-box',
           display: 'flex',
           padding: '24px 32px 0',
           justifyContent: 'space-between',
           backgroundColor: '#F4F6F9',
        }
    })
)(Box);

export const SymphonyContentContainer = withStyles(
    () => ({
        root: {
           backgroundColor: '#FFFFFF',
           display: 'flex',
           flex: 1,
        }
    })
)(Box);

export const SymphonyContentLoadingContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#A2A2A2',
            backgroundColor: '#FFF'
        }
    })
)(Box);

export const SymphonyHeaderButton = withStyles(
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

export const SymphonyHeaderAuxButton = withStyles(
    () => ({
        root: {
            marginRight: 16,
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E5E5',
            height: 48,
            fontWeight: 'bold',
            '& .MuiIcon-root': {
                fontSize: 14
            }
        }
    })
)(Button)

// Symphony List Common Components
export const SymphonyListContainer = withStyles(
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

export const SymphonyListRowContainer = withStyles(
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

export const SymphonyListGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }
    })
)(Grid);

export const SymphonyListGridImageContainer = withStyles(
    () => ({
        root: {
            height: 48, 
            width: 48,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    })
)(Grid);

// Symphony List Common Components
export const SymphonyViewContainer = withStyles(
    () => ({
        root: {
            height: 'calc(100vh - 196px)',
            width: '100%',
            padding: '8px 32px',
            boxSizing: 'border-box',
            backgroundColor: '#FFF'
        }
    })
)(Box);

export const SymphonyAuxContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            alignItems: 'center'
        }
    })
)(Box);

export const SymphonyAuxButton = withStyles(
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


export const SymphonyNamedAuxButton = withStyles(
    () => ({
        root: {
            height: 24,
            '& svg': {
                width: 24,
                height: 24
            },
           '& .MuiButton-label': {
               fontSize: 11,
               textTransform: 'none'
           }
        }
    })
)(Button);

export const SymphonyInputAuxButton = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            padding: 4,
            minWidth: 32,
            marginRight: 16,
            textTransform: 'none',
            fontSize: 12,
        }
    })
)(Button);

export const SymphonySelect = withStyles(
    () => ({
        root: {
            width: '100%',
            border: '1px solid #E5E5E5',
            borderRadius: 5,
            padding: 12,
        }
    })
)(Select);

export const SymphonyInputChip = withStyles(
    () => ({
        root: {
            fontSize: 12,
            height: 24,
            '& .svg': {
                width: 20
            }
        }
    })
)(Chip);

export const SymphonyHeaderTitle = withStyles(
    () => ({
        root: {
            fontWeight: 'bold',
            fontSize: 38
        }
    })
)(Typography); 

// Symphony Dialog
export const SymphonyDialogContainer = withStyles(
    () => ({
        root: {
            '& .MuiDialog-paper': {
                padding: 8,
                boxSizing: 'border-box',
                borderRadius: 0
            }
        }
    })
)(Dialog); 

export const SymphonyDialogTitle = withStyles(
    () => ({
        root: {
            '& h2': {
                fontWeight: 'bold',
                fontSize: 26
            }
        }
    })
)(DialogTitle); 

export const SymphonyDialogContent = withStyles(
    () => ({
        root: {
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
                right: 12
            },
            '& .MuiSelect-root' : {
                width: '100%',
                fontSize: 12
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
)(DialogContent); 

export const SymphonyDialogActions = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '0px 24px 24px',
        }
    })
)(DialogActions); 

export const SymphonyDialogCancelButton = withStyles(
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
            width: '50%',
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            },
            '&:hover': {
                backgroundColor: '#FFF',
            }
        }
    })
)(Button); 

export const SymphonyDialogSaveButton = withStyles(
    () => ({
        root: {
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            padding: '8px 10px',
            width: '50%',
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
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
            }
        }
    })
)(Button); 

export const SymphonyDialogCircularProgress = withStyles(
    () => ({
        root: {
            color: '#FFF'
        }
    })
)(CircularProgress); 

export const SymphonyFilterSlider = withStyles(
    () => ({
        root: {
            '& .MuiSlider-valueLabel > span': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR
            },
            '& .MuiSlider-thumb': {
                color: '#FFF',
                border: '1px solid #E5E5E5',
                width: 16,
                height: 16,
                marginTop: -5
            },
            '& .MuiSlider-track': {
                color: SYMPHONY_PRIMARY_COLOR
            },
            '&  .MuiSlider-rail': {
                color: '#E5E5E5'
            },
            '& .MuiSlider-track, .MuiSlider-rail': {
                height: 4
            },
            '& .MuiSlider-mark': {
                width: 0,
                height: 0
            },
            '& .MuiSlider-markLabel': {
                fontSize: 12,
                transform: 'none',
            },
            '& .MuiSlider-markLabel:nth-child(7)': {
                right: '0!important',
                left: 'unset!important'
            }
        }
    })
)(Slider);

export const SymphonyFilterContainer = withStyles(
    () => ({
        root: {
           display: 'flex',
           alignItems: 'center',
           width: '100%',
           flexDirection: 'row',
           boxSizing: 'border-box',
           padding: '8px 32px',
           height: 64
        }
    })
)(Box);

export const SymphonyActiveFiltersContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            flexDirection: 'row',
            height: '100%',
            overflowX: 'auto',
            padding: '0 12px',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
            '&::-webkit-scrollbar': {
                display: 'none'
            }
        }
    })
)(Box);

export const SymphonyFilterButton = withStyles(
    () => ({
        root: {
            minWidth: 120,
            textTransform: 'none',
            boxSizing: 'border-box',
            color: '#959595',
            border: '1px solid #E5E5E5',
            height: 40,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 'bold',
            '& .MuiButton-label': {
                justifyContent: 'space-around'
            },
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            }
        }
    })
)(Button);

export const SymphonyFiltersContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: 520,
            flexDirection: 'column'
        }
    })
)(Box);

export const SymphonyFilterItemsContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            flexDirection: 'column',
            padding: '20px',
            '& .symphony-input-label': {
                textTransform: 'uppercase',
                color: '#000'
            },
            '& .MuiIconButton-label': {
                '& svg': {
                    width: 20,
                    height: 20
                }
            },
        }
    })
)(Box);

export const SymphonyActiveFilter = withStyles(
    () => ({
        root: {
            backgroundColor: '#DEE9FF',
            color: SYMPHONY_PRIMARY_COLOR,
            position: 'relative',
            fontSize: 12,
            marginRight: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            boxSizing: 'border-box',
            height: 40,
        }
    })
)(Box);

export const SymphonyActiveFilterRemove = withStyles(
    () => ({
        root: {
            position: 'absolute',
            right: -10,
            top: 10,
            bottom: 0,
            width: 20,
            height: 20,
            padding: 0,
            backgroundColor: '#FF535B',
            '&:hover': {
                backgroundColor: '#FF535B',
            }
        }
    })
)(IconButton);


export const SymphonyFiltersActionsContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            width: '100%',
            boxSizing: 'border-box',
            borderTop: '1px solid #E5E5E5',
            padding: 16
        }
    })
)(Box);


export const SymphonyFilterActionButton = withStyles(
    () => ({
        root: {
            minWidth: 96,
            textTransform: 'none',
            boxSizing: 'border-box',
            backgroundColor: SYMPHONY_PRIMARY_COLOR,
            color: '#FFF',
            border: `1px solid ${SYMPHONY_PRIMARY_COLOR}`,
            height: 40,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 'bold',
            '&:hover': {
                backgroundColor: SYMPHONY_PRIMARY_COLOR,
            },
            '&.MuiButton-outlined': {
                backgroundColor: '#FFF',
                color: SYMPHONY_PRIMARY_COLOR
            },
            '&.MuiButton-outlined:hover': {
                backgroundColor: '#FFF'
            },
            '& .MuiSvgIcon-root': {
                fontSize: '24px!important'
            }
        }
    })
)(Button);

export const SymphonySortableHeaderGridContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#FFF', 
            padding: 12, 
            boxSizing: 'border-box',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #F4F6F9',
            fontWeight: 'bold'
        }
    })
)(Grid);

export const SymphonySortableHeaderGrid = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    })
)(Grid);

export const SymphonySortableHeaderContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            height: 28,
            boxSizing: 'border-box',
            paddingRight: 16,
            cursor: 'pointer',
            '& .MuiSvgIcon-root': {
                color: '#959595'
            }
        }
    })
)(Box);

export const SymphonyFormCheckboxContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            '& .MuiFormControlLabel-label': {
                fontSize: 12
            },
            '& .MuiFormControl-root': {
                padding: '0 6px'
            }
        }
    })
)(Box);

export const SymphonyInputCheckbox = withStyles(
    () => ({
        root: {
            color: SYMPHONY_PRIMARY_COLOR,
            '&$checked': {
                color: '#FFFFFF',
            },
        }
    })
)((props: CheckboxProps) => <Checkbox color="default" {...props} />);