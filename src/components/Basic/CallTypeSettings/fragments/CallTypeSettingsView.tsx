import React from 'react';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map';
import {
    CallTypeSettingsFieldBox,
    CallTypeSettingsFieldHeaderBox,
    CallTypeSettingsFieldToggleButton,
    CallTypeSettingsFieldToggleButtonGroup,
    CallTypeSettingsFieldButton,
    CallTypeSettingsFieldInputBox,
    CallTypeSettingsFieldIconButton,
    ViewLoadingBox
} from './CallTypeSettingsComponents';
import BasicInput from '../../Common/BasicInput';
import CallTypeSettingsInput from './CallTypeSettingsInput';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Ipad,Iphone } from '../../../../store/calltypesettings/types';
import DragIconHandle from '@material-ui/icons/DragIndicator';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

interface CallTypeProps {
    onSortEnd: ({ oldIndex, newIndex }) => Array<string> ;
    onToggleScreen: (selectedScreen: string) => void;
    activeScreen: string;
    editing: boolean;
    onClickEditButton: (buttonStatus: string) => void;
    buttonValue: string;
    activeCallType: string ;
    onChangeCallType: (newCallType: string, activeScreen: string) => void;
    iphoneTabData: Iphone | undefined ;
    ipadTabData: Ipad | undefined ;
    loading: boolean;
}

const options = [
    {
        label: 'Customer Profiling',
        value: 'customerProfiling'
    },
    {
        label: 'Meeting',
        value: 'meeting'
    }
]

const DraggableHandle = SortableHandle(() => (
    <CallTypeSettingsFieldIconButton>
        <Tooltip 
            title="Drag and Drop to Rearrange Fields" 
            aria-label="drag-and-drop"
            placement="left"
            arrow
        >    
            <DragIconHandle fontSize="large" htmlColor="#B2B2B2" /> 
        </Tooltip>
    </CallTypeSettingsFieldIconButton>
));

const DragIcon = (props: { editing: boolean }) => {
    if(props.editing) {
        return <DraggableHandle />;
    }
    return null;
}

export default (props: CallTypeProps) => {
    let activeCallTypeIphone = (props.activeCallType === "Meeting") ? props.iphoneTabData?.meeting.elements :  props.iphoneTabData?.customerProfiling.elements;
    let activeCallTypeIpad = (props.activeCallType === "Meeting") ? props.ipadTabData?.meeting.elements :  props.ipadTabData?.customerProfiling.elements;
    let activeCallElementData = (props.activeScreen === "iphone") ? activeCallTypeIphone: activeCallTypeIpad;
    const SortableItem = SortableElement(({inCallElement, inCallElementLabel, editing}) => {
        return (
            <CallTypeSettingsInput
                label={inCallElementLabel}
                value={inCallElement}
                dragHandle={<DragIcon editing={editing}/>} 
            />
        );
    });

    const SortableInCallFields = SortableContainer(({ items, editing }) => {
        return (
            <ul style={{ padding: 0, margin: 0 }}>
                {map(items, (inCallElement, index) => {
                let ordinalAbbreviation = '';
                let callElementLabel = '';
                switch (parseInt(index,10)) {
                    case 0: ordinalAbbreviation = 'st'; break;
                    case 1: ordinalAbbreviation = 'nd'; break;
                    case 2: ordinalAbbreviation = 'rd'; break;
                    case 3: ordinalAbbreviation = 'th'; break;
                    case 4: ordinalAbbreviation = 'More'; break;
                    default:ordinalAbbreviation = '';break;
                }
                if(parseInt(index,10) > 3 ){
                    callElementLabel = ordinalAbbreviation;
                }else{
                    callElementLabel = (index + 1).toString() + ordinalAbbreviation
                }
                return (
                    <SortableItem
                        index={parseInt(index, 10)}
                        key={`item-${inCallElement}`}
                        inCallElement={inCallElement}
                        editing={editing}
                        inCallElementLabel ={callElementLabel}   

                    />
                )
                })}
            </ul>
        );
    });
  
    return(
        <CallTypeSettingsFieldBox>
            <CallTypeSettingsFieldHeaderBox>
                <CallTypeSettingsFieldToggleButtonGroup value={props.activeScreen} exclusive aria-label="navbuttongroup">
                    <CallTypeSettingsFieldToggleButton value="iphone" aria-label="iphone" onClick={() => props.onToggleScreen("iphone")} >IPHONE</CallTypeSettingsFieldToggleButton>
                    <CallTypeSettingsFieldToggleButton value="ipad" aria-label="ipad" onClick={() => props.onToggleScreen("ipad")}>IPAD</CallTypeSettingsFieldToggleButton>
                </CallTypeSettingsFieldToggleButtonGroup>
            </CallTypeSettingsFieldHeaderBox>
            <CallTypeSettingsFieldButton
                color="primary" 
                variant="contained"
                onClick={() => props.onClickEditButton(props.buttonValue)}
            >
                {props.buttonValue} 
            </CallTypeSettingsFieldButton>
            <CallTypeSettingsFieldInputBox>
                <Grid container>
                    <Grid item xs={10}>
                        <BasicInput
                            type="dropdown"
                            label="Call Types"
                            autocompleteList={options}
                            value={props.activeCallType}
                            onAutocompleteChange={(e, value) => {
                                if (value) {
                                    props.onChangeCallType(value.label, props.activeScreen)
                                }
                            }}
  
                        />
                    </Grid>
                </Grid> 
                            
                <Grid container >
                {!props.loading ?
                    <Grid item xs={10}>
                        <Grid container style= {{marginTop: '1rem'}}>
                            <Grid item xs={3} >
                                <Grid container>
                                    <Grid item xs={12} style = {{height:48, display:'flex', alignItems:'center'}}>
                                        In Call Elements
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={9}>
                               <Grid container>
                                   <Grid item xs={12}>
                                   <SortableInCallFields
                                            items={activeCallElementData}   
                                            editing={props.editing}
                                            onSortEnd={props.onSortEnd}
                                            useDragHandle
                                        /> 
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                :
                    <Grid item xs={10}>
                        <Grid container style= {{marginTop: '1rem'}}>
                            <Grid item xs={3} >
                                <Grid container>
                                    <Grid item xs={12} style = {{height:48, display:'flex', alignItems:'center'}}>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={9}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <ViewLoadingBox>
                                        <CircularProgress />      
                                    </ViewLoadingBox>     
                                </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>             
                }               
                </Grid>
            </CallTypeSettingsFieldInputBox>
        </CallTypeSettingsFieldBox>

    )
}


