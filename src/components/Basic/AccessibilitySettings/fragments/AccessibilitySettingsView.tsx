import React from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHeader from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import BasicInput from '../../Common/BasicInput';
import {
    AccessibilitySettingsFieldBox,
    AccessibilitySettingsFieldHeaderBox,
    AccessibilitySettingsTypography,
    AccessibilitySettingsTabsContainer,
    AccessibilityTabContainer,
    AccessibilitySettingsTabs,
    AccessibilitySettingsTab,
    AccessibilityModuleBox,
    AccessibilityTableRow,
    AccessibilityTableCell,
    AccessibilityCheckbox
} from '../fragments/AccessibilitySettingsComponents';
import {
    AccessibilitySetting
} from '../../../../store/accessibilitysettings/types';

interface AccessibilitySettingsProps{
    activeAccessibilitySettings: AccessibilitySetting;
    activeTab: string;
    activeAppType:string;
    onChangeAppType: (newCallType: string, activeScreen: string) => void;
    onChangeActiveTab: (activeScreen: string) => void;
    onAccessibilitySettingsEditInput: (field: string, val: string) => void;
}

const options = [
    {
        label: 'Basic',
        value: 'Basic'
    },
    {
        label: 'Marketplace',
        value: 'Marketplace'
    }
]
const AccessibilityCheckIcon = (props: { value: boolean }) => {
    if(props.value) {
        return (
        <AccessibilityTableCell>
            <AccessibilityCheckbox color="primary" checked />
        </AccessibilityTableCell>
        )
    }else{
        return (
            <AccessibilityTableCell>
                <AccessibilityCheckbox color="primary" />
            </AccessibilityTableCell>
        )
    }
}

export default (props:AccessibilitySettingsProps) => {
    return(
        <AccessibilitySettingsFieldBox>
            <AccessibilitySettingsFieldHeaderBox>
                <AccessibilitySettingsTypography>
                    Contact Details
                </AccessibilitySettingsTypography>
                <Grid container={true}>
                    <Grid item={true} xs={8}>
                        <BasicInput
                            type="text"
                            label="Role Name"
                            value={props.activeAccessibilitySettings.roleName}
                            onChange ={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    props.onAccessibilitySettingsEditInput('roleName', e.target.value)
                                }
                            }
                        />
                        <BasicInput
                            label="Date Created"
                            value={props.activeAccessibilitySettings.dateCreated}
                            type="readonly"
                        />
                    <BasicInput
                            label="Last Updated"
                            value={props.activeAccessibilitySettings.lastUpdated}
                            type="readonly"
                        />
                        <BasicInput
                            type="dropdown"
                            label="App Type"
                            autocompleteList={options}
                            value={props.activeAppType} 
                            onAutocompleteChange={(e, value) => {
                                if (value) {
                                    props.onChangeAppType(value.label, props.activeTab)
                                }
                            }}   
                        />
                    </Grid>
                </Grid>
                <AccessibilitySettingsTypography style={{ paddingTop: 20 }} >
                    Module Accessibility
                </AccessibilitySettingsTypography>
                    <AccessibilitySettingsTabsContainer>
                            <AccessibilityTabContainer>
                                <AccessibilitySettingsTabs 
                                    indicatorColor="secondary"
                                    value={props.activeTab}
                                    TabIndicatorProps={{ style: { height: 2, backgroundColor: '#343232' }}}
                                >
                                    <AccessibilitySettingsTab 
                                        label="AMI"
                                        value="AMI"
                                        onClick={() => props.onChangeActiveTab("AMI")}
                                    />
                                    <AccessibilitySettingsTab 
                                        label="APP"
                                        value="APP"
                                        onClick={() => props.onChangeActiveTab("APP")}
                                    /> 
                                </AccessibilitySettingsTabs>
                                </AccessibilityTabContainer>
                    </AccessibilitySettingsTabsContainer>
            </AccessibilitySettingsFieldHeaderBox> 
            {/* Accessibility Table body */}
            <AccessibilityModuleBox>
                <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHeader>
                            <TableRow style = {{ height: "10"}}>
                                <AccessibilityTableCell><AccessibilityCheckbox color="primary"/>Module</AccessibilityTableCell>
                                <AccessibilityTableCell>View</AccessibilityTableCell>
                                <AccessibilityTableCell>Add</AccessibilityTableCell>
                                <AccessibilityTableCell>Edit</AccessibilityTableCell>
                                <AccessibilityTableCell>Delete</AccessibilityTableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody style={{ overflow: 'auto'  }} >
                            {props.activeAccessibilitySettings.modules.map((row) => (
                                <AccessibilityTableRow key={row.id}>
                                    <AccessibilityTableCell component="th" scope="row">
                                    <AccessibilityCheckbox color="primary"/>{row.name}
                                    </AccessibilityTableCell>
                                    <AccessibilityCheckIcon value={row.isView} ></AccessibilityCheckIcon>
                                    <AccessibilityCheckIcon value={row.isAdd} ></AccessibilityCheckIcon>
                                    <AccessibilityCheckIcon value={row.isEdit} ></AccessibilityCheckIcon>
                                    <AccessibilityCheckIcon value={row.isDelete} ></AccessibilityCheckIcon>
                                   
                                </AccessibilityTableRow>
                            ))} 
                            </TableBody>
                    </Table>
                </TableContainer>
            </AccessibilityModuleBox>
        </AccessibilitySettingsFieldBox>

    )
    
}
    
  
    
        
    
          
   



