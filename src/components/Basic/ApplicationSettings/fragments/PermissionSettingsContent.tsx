import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import BasicInput from '../../Common/BasicInput';
import { 
    PermissionsButtonGroup,
    PermissionsToggleButton,
    PermissionsButtonGroupContainer,
    PermissionsLabelContainer
} from './ApplicationSettingsComponents';
import { AppState } from '../../../../store';
import { ApplicationPermissionTabs, ApplicationSettingsState, PermissionTab } from '../../../../store/applicationsettings/types';
import { setApplicationSettingsState } from '../../../../store/applicationsettings/actions';
import arrayMove from 'array-move';
import PermissionTabs from './PermissionTabs'

interface PermissionSettingsContentProps {
    setApplicationSettingsState: typeof setApplicationSettingsState;
    applicationsettings: ApplicationSettingsState;
}

class PermissionSettingsContent extends React.Component<PermissionSettingsContentProps> {

    _onTabToggle = (type: ApplicationPermissionTabs) => {
        this.props.setApplicationSettingsState({ activePermissionTab: type })
    }

    _handleSort = ({ oldIndex, newIndex, }): Array<PermissionTab> => {
        let newArray = arrayMove(this.props.applicationsettings.permissionTabs, oldIndex, newIndex);
        for (let i = 0, j = 0; i < newArray.length; i++) {
            newArray[i].row = (i + 1 - j).toString();
        }
        this.props.setApplicationSettingsState({ permissionTabs: newArray })
        return newArray;
    }
    
    render() {
        return (
            <Grid container={true}>
                <Grid item={true} xs={12}>
                    <PermissionsButtonGroupContainer>
                        <PermissionsButtonGroup value={this.props.applicationsettings.activePermissionTab} exclusive aria-label="navbuttongroup">
                            <PermissionsToggleButton value="IPHONE" aria-label="iphone" onClick={this._onTabToggle.bind(this, 'IPHONE')} >Iphone</PermissionsToggleButton>
                            <PermissionsToggleButton value="IPAD" aria-label="ipad" onClick={this._onTabToggle.bind(this, 'IPAD')}>Ipad</PermissionsToggleButton>
                        </PermissionsButtonGroup>
                    </PermissionsButtonGroupContainer>
                </Grid>
                <Grid item={true} xs={8}>
                    <BasicInput
                        label="Salesperson Type"
                        value=""
                        placeholder="Select Here"
                        type="dropdown"
                    />
                    <Grid container={true} style={{ marginTop: 16 }}>
                        <Grid item={true} xs={3} style={{ paddingTop: 10 }}>
                            Tabs
                        </Grid>
                        <Grid item={true} xs={9}>
                            <Grid container={true}>
                                <Grid item={true} xs={1}>
                                    <Grid container>
                                        <Grid item={true} xs={12} style={{ marginBottom: 8}}>
                                            <PermissionsLabelContainer>
                                                1st
                                            </PermissionsLabelContainer>
                                        </Grid>
                                        <Grid item={true} xs={12} style={{ marginBottom: 8}}>
                                            <PermissionsLabelContainer>
                                                2nd
                                            </PermissionsLabelContainer>
                                        </Grid>
                                        <Grid item={true} xs={12} style={{ marginBottom: 8}}>
                                            <PermissionsLabelContainer>
                                                3rd
                                            </PermissionsLabelContainer>
                                        </Grid>
                                        <Grid item={true} xs={12} style={{ marginBottom: 8}}>
                                            <PermissionsLabelContainer>
                                                4th
                                            </PermissionsLabelContainer>
                                        </Grid>
                                        <Grid item={true} xs={12} style={{ marginBottom: 8}}>
                                            <PermissionsLabelContainer>
                                                More
                                            </PermissionsLabelContainer>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item={true} xs={11}>
                                    <PermissionTabs 
                                        onSortEnd={this._handleSort.bind(this)}
                                        tabs={this.props.applicationsettings.permissionTabs}
                                        editing={this.props.applicationsettings.editing}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    applicationsettings: state.applicationsettings
});

export default connect(mapStateToProps, {
    setApplicationSettingsState
})(PermissionSettingsContent)