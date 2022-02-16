import React from 'react';
import BasicLayout from '../Common/BasicLayout';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import Grid from '@material-ui/core/Grid';
import {
    BasicTab,
    BasicTabs
} from '../Common/BasicCommonComponents';
import { 
    TabContainer, 
    SaveButton,
    SettingsContainer
} from './fragments/ApplicationSettingsComponents';
import ApplicationSettingsContent from './fragments/ApplicationSettingsContent';
import PermissionSettingsContent from './fragments/PermissionSettingsContent';
import { ApplicationSettingsState } from '../../../store/applicationsettings/types';
import { setApplicationSettingsState } from '../../../store/applicationsettings/actions';

interface ApplicationSettingsProps {
    setApplicationSettingsState: typeof setApplicationSettingsState;
    applicationsettings: ApplicationSettingsState;
}

class ApplicationSettings extends React.Component<ApplicationSettingsProps> {

    _handleEdit = (type: string, val: string | boolean) => {
        this.props.setApplicationSettingsState({ [type]: val })
    }

    TabRenderer = () => {
        const [activeTab, setActiveTab] = React.useState<'Application' | 'Permission'>('Application')
        return (
            <>
                 <Grid item={true} xs={12}>
                    <TabContainer>
                        <BasicTabs 
                            value={activeTab}
                            style={{ marginBottom: 8}}
                            TabIndicatorProps={{ style: { height: 2, backgroundColor: '#343232' }}}
                        >
                            <BasicTab
                                label="Application Settings"
                                value="Application"
                                onClick={() => setActiveTab('Application')}
                            />
                            <BasicTab
                                label="Permission Settings"
                                value="Permission"
                                onClick={() => setActiveTab('Permission')}
                            />
                        </BasicTabs>
                        <SaveButton
                            onClick={this.props.applicationsettings.editing ? this._handleEdit.bind(this, 'editing', false) : this._handleEdit.bind(this, 'editing', true)}
                        >
                            {this.props.applicationsettings.editing ? 'Save' : 'Edit'}
                        </SaveButton>
                    </TabContainer>
                </Grid>
                <Grid item={true} xs={12}>
                    <SettingsContainer>
                        {activeTab === 'Application' &&
                            <ApplicationSettingsContent />
                        }
                        {activeTab === 'Permission' &&
                            <PermissionSettingsContent />
                        }
                    </SettingsContainer>
                </Grid>
            </>
        )
    }

    render () {
        return (
            <BasicLayout>
                <Grid container>
                    <this.TabRenderer />
                </Grid>
            </BasicLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    applicationsettings: state.applicationsettings
});

export default connect(mapStateToProps, {
    setApplicationSettingsState
})(ApplicationSettings);