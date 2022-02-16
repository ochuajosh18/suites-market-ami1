import React from 'react';
import BasicLayout from '../Common/BasicLayout';
import  CallTypeSettingsView  from './fragments/CallTypeSettingsView';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { CallTypeSettingsState } from '../../../store/calltypesettings/types';
import { setCallTypeState,loadCallTypeElements, loadAllCallTypeElements, updateCallElements} from '../../../store/calltypesettings/actions';
import arrayMove from 'array-move';

interface CallTypeSettingsProps {
    calltypesettings: CallTypeSettingsState;
    setCallTypeState: typeof setCallTypeState;
    loadCallTypeElements: typeof loadCallTypeElements;
    loadAllCallTypeElements: typeof loadAllCallTypeElements;
    updateCallElements: typeof updateCallElements;
}

class CallTypeSettings extends React.Component<CallTypeSettingsProps>{

    _handleSort = ({ oldIndex, newIndex, }): Array<string> => {
        let activeCallTypeIphone = (this.props.calltypesettings.activeCallType === "Meeting") ? this.props.calltypesettings.iphone?.meeting.elements : this.props.calltypesettings.iphone?.customerProfiling.elements;
        let activeCallTypeIpad = (this.props.calltypesettings.activeCallType === "Meeting") ? this.props.calltypesettings.ipad?.meeting.elements : this.props.calltypesettings.ipad?.customerProfiling.elements;
        let activeCallTypeData = (this.props.calltypesettings.activeScreen === "iphone") ? activeCallTypeIphone: activeCallTypeIpad;
        this.props.setCallTypeState({callElements: activeCallTypeData});
        let newArray = arrayMove(this.props.calltypesettings.callElements, oldIndex, newIndex);
        let activeCallElementsIphoneMeeting = (this.props.calltypesettings.activeCallType === "Meeting" && this.props.calltypesettings.activeScreen === "iphone") ? newArray : this.props.calltypesettings.iphone?.meeting.elements;
        let activeCallElementsIphoneCustomerProfiling = (this.props.calltypesettings.activeCallType === "Customer Profiling" && this.props.calltypesettings.activeScreen === "iphone") ?  newArray: this.props.calltypesettings.iphone?.customerProfiling.elements;
        let activeCallElementsIpadMeeting = (this.props.calltypesettings.activeCallType === "Meeting" && this.props.calltypesettings.activeScreen === "ipad") ?  newArray : this.props.calltypesettings.ipad?.meeting.elements;
        let activeCallElementsIpadCustomerProfiling = (this.props.calltypesettings.activeCallType === "Customer Profiling" && this.props.calltypesettings.activeScreen === "ipad") ?newArray : this.props.calltypesettings.ipad?.customerProfiling.elements;
        this.props.setCallTypeState(
            { 
                activeCallType: this.props.calltypesettings.activeCallType,
                activeScreen: this.props.calltypesettings.activeScreen,
                iphone: {
                    meeting:{
                        title: this.props.calltypesettings.iphone?.meeting.title,
                        elements: activeCallElementsIphoneMeeting
                    },
                    customerProfiling:{
                        title: this.props.calltypesettings.iphone?.customerProfiling.title,
                        elements: activeCallElementsIphoneCustomerProfiling
                    }
                },
                ipad: {
                    meeting:{
                        title: this.props.calltypesettings.ipad?.meeting.title,
                        elements: activeCallElementsIpadMeeting
                    },
                    customerProfiling:{
                        title: this.props.calltypesettings.ipad?.customerProfiling.title,
                        elements: activeCallElementsIpadCustomerProfiling
                    }
                }
              
            });
        return newArray;
    }

    componentDidMount() {
        this.props.loadAllCallTypeElements();
        this.props.setCallTypeState({activeCallType: "Meeting"});
    }
    
    _onClickToggleScreen = (screen: string) => {
        this.props.loadCallTypeElements('',screen);
        this.props.setCallTypeState( {activeScreen: screen, activeCallType: "Meeting"});
    }

    _onClickEditElements = (field: string, value:string | boolean | Array<string> | undefined) => {
        this.props.setCallTypeState({ [field]: value });
    }

    _onClickEditButton = (buttonValue:string) => {
        if( buttonValue === 'Edit'){
            this.props.setCallTypeState({editing: true, buttonName: "Save" });
        }else{
           this.props.updateCallElements(this.props.calltypesettings.iphone!, this.props.calltypesettings.ipad!);
           this.props.setCallTypeState({editing: false, buttonName: "Edit" });
        }
    }

    _onChangeCallType = (newCallType:string, activeScreen:string) => {
        this.props.setCallTypeState({activeCallType:newCallType});
        this.props.loadCallTypeElements(newCallType, activeScreen);
    }

    render(){
        return(
            <BasicLayout>
                <CallTypeSettingsView
                    onSortEnd = {this._handleSort.bind(this)}
                    onToggleScreen = {this._onClickToggleScreen.bind(this)}
                    activeScreen = {this.props.calltypesettings.activeScreen}
                    editing = {this.props.calltypesettings.editing}
                    onClickEditButton = {this._onClickEditButton.bind(this)}
                    buttonValue = {this.props.calltypesettings.buttonName}
                    activeCallType = {this.props.calltypesettings.activeCallType}
                    onChangeCallType = {this._onChangeCallType.bind(this)}
                    iphoneTabData = {this.props.calltypesettings.iphone}
                    ipadTabData = {this.props.calltypesettings.ipad}
                    loading={this.props.calltypesettings.callTypeElementsLoading}
               />
            </BasicLayout>
        )
    }
}



const mapStateToProps = (state: AppState) => ({
    calltypesettings: state.calltypesettings
});

export default connect(mapStateToProps, {
    setCallTypeState,
    loadCallTypeElements,
    loadAllCallTypeElements,
    updateCallElements
})(CallTypeSettings);
