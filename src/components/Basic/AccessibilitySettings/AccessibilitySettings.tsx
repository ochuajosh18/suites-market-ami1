import React from 'react';
import BasicLayout from '../Common/BasicLayout';
import AccessibilitySettingsView from './fragments/AccessibilitySettingsView';
import { AccessibilitySettingsState, ActiveAccessibilityInputData} from '../../../store/accessibilitysettings/types';
import { setAccessibilitySettingsState, updateActiveAccessibilitySettings } from '../../../store/accessibilitysettings/actions';
import { resetLoginState } from '../../../store/login/actions';
import { setHeaderEndButton } from '../../../store/system/actions';
import { toastSuccess } from '../../../modules/Toast';

import { connect } from 'react-redux';
import { AppState } from '../../../store';

interface AccessibilitySettingsStateProps{
    accessibilitysettingstate: AccessibilitySettingsState;
    setAccessibilitySettingsState: typeof setAccessibilitySettingsState;
    resetLoginState: typeof resetLoginState;
    setHeaderEndButton: typeof setHeaderEndButton;
    updateActiveAccessibilitySettings: typeof updateActiveAccessibilitySettings;
}

class AccessibilitySettings extends React.Component<AccessibilitySettingsStateProps>{
    
    componentDidMount = () => {
        this.props.setHeaderEndButton({
            title: 'Save',
            action: this._onSaveClick.bind(this)
        });
    }

    componentWillUnmount = () => {
        this.props.setHeaderEndButton({
            title: 'Logout',
            action: () => { this.props.resetLoginState() }
        });
    }
    _onChangeAppType = (newAppType:string, activeTab:string) => {
        this.props.setAccessibilitySettingsState({appType: newAppType});
    }

    _onChangeActiveTab = (activeTab:string) => {
        this.props.setAccessibilitySettingsState({activeTab: activeTab});
    }

    _onSaveClick = () => {
        toastSuccess(' Accessibility Settings Successfully Updated');
    }

    _onAccessibilitySettingsEditInput = (field: string, text:ActiveAccessibilityInputData ) => {
        this.props.updateActiveAccessibilitySettings({ field, text });
    }
    render(){
        return(
           <BasicLayout>
               <AccessibilitySettingsView
                activeAccessibilitySettings = {this.props.accessibilitysettingstate.activeAccessilibility}
                activeTab = {this.props.accessibilitysettingstate.activeTab}
                activeAppType = {this.props.accessibilitysettingstate.appType}
                onChangeAppType = {this._onChangeAppType.bind(this)}
                onChangeActiveTab = {this._onChangeActiveTab.bind(this)}
                onAccessibilitySettingsEditInput = {this._onAccessibilitySettingsEditInput.bind(this)}
               />
          </BasicLayout>
        )
    }

}
const mapStateToProps = (state: AppState) => ({
    accessibilitysettingstate: state.accessibilitysettings
});

export default connect(mapStateToProps,{
    setAccessibilitySettingsState,
    setHeaderEndButton,
    resetLoginState,
    updateActiveAccessibilitySettings
})(AccessibilitySettings);
