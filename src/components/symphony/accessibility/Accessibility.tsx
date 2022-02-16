import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, match } from 'react-router-dom';

// Store
import { AppState } from '../../../store';
import { setSystemState } from '../../../store/system/actions';
import { AccessibilityState, AccessibilityTabs as Tab, UserRole } from '../../../store/accessibility/types'
import { setAccessibilityState, getUserRoles, getUserRole, upsertUserRole, loadModules} from '../../../store/accessibility/actions'

// Components
import { 
    SaveAccessibilityButton, 
    AccessibilityContainer,
    AccessibilityContentContainer,
    AccessibilityGrid,
    SubHeaderContainer,
    HeaderText,
    SubHeaderText,
    AccessibilityTabs,
    TabsContainer
} from './fragments/AccessibilityComponents'

import AccessibilityTable from './fragments/AccessibilityTable';
import AccessibilityInputs from './fragments/AccessibilityInputs';

// Global Components
import SymphonyLayout from '../SymphonyLayout';
import { 
    SymphonyContainer,
    SymphonyContentContainer,
} from '../SymphonyCommonComponents';
import SymphonyContentLoading from '../SymphonyContentLoading';
import BackButton from '../SymphonyBackButton';

import Box from '@material-ui/core/Box';

//utils
import find from 'lodash/find';
import filter from 'lodash/filter';

interface MatchParams {
    params: { roleId: string; };
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface AccessibilityProps {
    accessibility: AccessibilityState;
    loadModules: typeof loadModules;
    setSystemState: typeof setSystemState;
    setAccessibilityState: typeof setAccessibilityState;
    getUserRole: typeof getUserRole;
    getUserRoles: typeof getUserRoles;
    upsertUserRole: typeof upsertUserRole;
}

class Accessibility extends React.PureComponent<AccessibilityProps & RouteParams> {

    componentDidMount = () => {
        this.props.setSystemState({
            header: (
                <Box height="56px" display="flex" alignItems="center">
                    <BackButton to="/symphony/roles" />
                    Roles & Accessibility
                </Box>
            ),
            headerEndButton: (
                <Box height="56px">
                    <SaveAccessibilityButton 
                        id="add-product-btn"
                        onClick={this._onSaveClick.bind(this)}
                    >
                        Save
                    </SaveAccessibilityButton>
                </Box>
            ),
            shallRedirect: false,
            redirectTo: ''
        });


        if (this.props.match.params.roleId === 'new') {
            this.props.loadModules();
            this.props.setAccessibilityState({
                activeEditUserRole: {
                    name: '',
                    description: '',
                    amiAccess: [],
                    appAccess: []
                }
            })
        }
        else this.props.getUserRole(this.props.match.params.roleId);
    }

    componentWillUnmount = () => this.props.setSystemState({ header: undefined, headerEndButton: undefined });

    _onSaveClick = () => {
        //Call save accessibility
        this.props.upsertUserRole();
    }

    _onActiveAccessibilityInput = (key: string, value: string | number | boolean) => {
        this.props.setAccessibilityState({ 
            activeEditUserRole: { ...this.props.accessibility.activeEditUserRole, [key]: value }
        });
        if (key === 'activeUserRole') {
            const userRole = find(this.props.accessibility.userRoles, { id: value as string });
            if (userRole) {
                this.props.setAccessibilityState({
                    activeEditUserRole: userRole,
                    activeModuleCheckbox: this._initializeModuleCheckbox(userRole)
                })
            }
        }
    }

    _initializeModuleCheckbox = (userRole: UserRole, tab: Tab = 'AMI'): Array<string> => {
        const accessKey = tab === 'AMI' ? 'amiAccess' : 'appAccess';
        const modules =  this.props.accessibility[tab === 'AMI' ? 'amiModules' : 'appModules'];
        let moduleCheckbox: Array<string> = [];
        for (const m of modules) {
            let ctr = 0;
            const moduleComparator = m.toUpperCase().replace(/ +/g, '_');
            if (typeof userRole[accessKey] !== 'undefined') {
                for (const c of userRole[accessKey]) {
                    if (c.indexOf(moduleComparator) > -1 && typeof c[c.indexOf(moduleComparator) + moduleComparator.length + 1] === 'undefined') {
                        ctr+=1;
                    }
                }
            }

            if (ctr > 3) {
                moduleCheckbox = [ ...moduleCheckbox, m ]
            }
        }
        return moduleCheckbox.length === modules.length ? [ ...moduleCheckbox, 'ALL' ] : moduleCheckbox;
    }

    _onCheckboxClick = (value: string) => {
        const accessKey = this.props.accessibility.activeTab === 'AMI' ? 'amiAccess' : 'appAccess';
        const moduleName =  value.split('::')[1];
        let convertedModuleName = '';
        for (const s of moduleName.toLowerCase().split('_')) {
            convertedModuleName += `${s[0].toUpperCase()}${s.substr(1)}_`
        }
        convertedModuleName = convertedModuleName.split('_').join(' ').trim();
        if (this.props.accessibility.activeEditUserRole) {
            const moduleList = this.props.accessibility.activeEditUserRole[accessKey];
            const moduleCheckboxes = this.props.accessibility.activeModuleCheckbox;
            if (moduleList.includes(value)) {
                //if checkbox is check for this module
                const newAccess = filter(moduleList, (r) => {
                    if (value.indexOf('VIEW') === -1) return r !== value; // only remove clicked
                    return r.indexOf(value.split('::')[1]) === -1;
                });
                const moduleCheckboxComparator = filter(newAccess, (m) => m.indexOf(value.split('::')[1]) > -1 ).length < 4;
                this.props.setAccessibilityState({
                    activeEditUserRole: {
                        ...this.props.accessibility.activeEditUserRole,
                        [accessKey]: newAccess
                    },
                    activeModuleCheckbox: moduleCheckboxComparator ? filter(moduleCheckboxes, (m) => m !== convertedModuleName && m !== 'ALL') : moduleCheckboxes
                })
            } else {
                let newAccess = [ ...moduleList, value ];
                newAccess = newAccess.includes(`VIEW::${moduleName}`) ? newAccess : [...newAccess, `VIEW::${moduleName}`];
                const comparator = filter(newAccess, (m) => m.indexOf(moduleName) > -1 ).length >= 4 ;
                const newModuleChecks =  [...moduleCheckboxes, convertedModuleName];
                const moduleAccessKey = this.props.accessibility.activeTab === 'AMI' ? 'amiModules' : 'appModules';
                this.props.setAccessibilityState({
                    activeEditUserRole: {
                        ...this.props.accessibility.activeEditUserRole,
                        [accessKey]: newAccess,
                    },
                    activeModuleCheckbox: comparator ? newModuleChecks.length === this.props.accessibility[moduleAccessKey].length ? [...newModuleChecks, 'ALL'] : newModuleChecks : moduleCheckboxes
                });
            }
        }
    }

    _onModuleCheckboxClick = (value: string) => {
        const accessKey = this.props.accessibility.activeTab === 'AMI' ? 'amiAccess' : 'appAccess';
        if (value === 'ALL') {
            if (this.props.accessibility.activeModuleCheckbox.includes('ALL')) {
                this.props.setAccessibilityState({
                    activeEditUserRole: {
                        ...this.props.accessibility.activeEditUserRole,
                        [accessKey]: []
                    } as UserRole,
                    activeModuleCheckbox: []
                })
            } 
            else {
                const modules = this.props.accessibility.activeTab === 'AMI' ? this.props.accessibility.amiModules : this.props.accessibility.appModules;
                const { activeEditUserRole } = this.props.accessibility;
                if (activeEditUserRole) {
                    let access: Array<string> = [];
                    for (const m of modules) {
                        const moduleComparator = m.toUpperCase().replace(/ +/g, '_');
                        if (!activeEditUserRole[accessKey].includes(`VIEW::${moduleComparator}`)) {
                            access = [ ...access, `VIEW::${moduleComparator}` ];
                        }
                        if (!activeEditUserRole[accessKey].includes(`CREATE::${moduleComparator}`)) {
                            access = [ ...access, `CREATE::${moduleComparator}` ];
                        }
                        if (!activeEditUserRole[accessKey].includes(`UPDATE::${moduleComparator}`)) {
                            access = [ ...access, `UPDATE::${moduleComparator}` ];
                        }
                        if (!activeEditUserRole[accessKey].includes(`DELETE::${moduleComparator}`)) {
                            access = [ ...access, `DELETE::${moduleComparator}` ];
                        }
                    }
                    const userRole = {
                        ...this.props.accessibility.activeEditUserRole,
                        [accessKey]: [ ...activeEditUserRole[accessKey], ...access ]
                    } as typeof activeEditUserRole
                    this.props.setAccessibilityState({
                        activeEditUserRole: userRole,
                        activeModuleCheckbox: [ ...modules, 'ALL' ]
                    })
                }
            }
        } else {
            const moduleComparator = value.toUpperCase().replace(/ +/g, '_');
            if (this.props.accessibility.activeModuleCheckbox.includes(value)) {
                //unchecked
                this.props.setAccessibilityState({
                    activeEditUserRole: {
                        ...this.props.accessibility.activeEditUserRole,
                        [accessKey]: filter(this.props.accessibility.activeEditUserRole![accessKey], (m) => m.indexOf(moduleComparator) === -1)
                    } as UserRole,
                    activeModuleCheckbox: filter(this.props.accessibility.activeModuleCheckbox, (m) => m !== value && m !== 'ALL')
                })
            } else {
                const filtered = filter(this.props.accessibility.activeEditUserRole![accessKey], (m) => m.indexOf(moduleComparator) === -1);
                const newVal = [ ...this.props.accessibility.activeModuleCheckbox, value ];
                const moduleAccessKey = this.props.accessibility.activeTab === 'AMI' ? 'amiModules' : 'appModules';
                this.props.setAccessibilityState({
                    activeEditUserRole: {
                        ...this.props.accessibility.activeEditUserRole,
                        [accessKey]: [ ...filtered, `VIEW::${moduleComparator}`, `CREATE::${moduleComparator}`, `UPDATE::${moduleComparator}`, `DELETE::${moduleComparator}` ]
                    } as UserRole,
                    activeModuleCheckbox: newVal.length === this.props.accessibility[moduleAccessKey].length ? [...newVal, 'ALL'] : newVal
                })
            }

        }
    }

    _onTabClick = (tab: Tab) => {
        this.props.setAccessibilityState({ activeTab: tab })
        if (this.props.accessibility.activeEditUserRole) {
            this.props.setAccessibilityState({
                activeModuleCheckbox: this._initializeModuleCheckbox(this.props.accessibility.activeEditUserRole, tab),
            })
        }
    }

    render() {
        const { activePlatform, platform, userRoles, activeEditUserRole } = this.props.accessibility;
        return (
            <SymphonyLayout>
                <SymphonyContainer>
                    <SymphonyContentContainer>
                        <AccessibilityContainer>
                            {this.props.accessibility.roleLoading ? <SymphonyContentLoading overrideHeight="calc(100vh - 166px) !important" /> : 
                            <AccessibilityContentContainer>
                                {activeEditUserRole &&
                                    <>
                                        <AccessibilityInputs
                                            activePlatform={activePlatform}
                                            platforms={platform}
                                            onAccessibilityInput={this._onActiveAccessibilityInput.bind(this)}
                                            activeEditUserRole={activeEditUserRole}
                                            userRoles={userRoles}
                                        />
                                        <SubHeaderContainer>
                                            <HeaderText>Permission</HeaderText>
                                            <SubHeaderText>User in this role are allowed to manipulate modules in the following ways:</SubHeaderText>
                                        </SubHeaderContainer>
                                        <TabsContainer>
                                            <AccessibilityGrid container>
                                                <AccessibilityGrid item xs={6}>
                                                    <AccessibilityTabs 
                                                        style={{ backgroundColor: this.props.accessibility.activeTab === 'AMI' ? 'rgb(181, 121, 54, 0.2)' : '#FFFFFF', fontWeight: this.props.accessibility.activeTab === 'AMI' ? 'bold' : 'normal' }}
                                                        onClick={this._onTabClick.bind(this, 'AMI')}
                                                        disabled={activeEditUserRole && typeof activeEditUserRole['appAccess'] === 'undefined'}
                                                    >
                                                        AMI
                                                    </AccessibilityTabs>
                                                </AccessibilityGrid>
                                                <AccessibilityGrid item xs={6}>
                                                    <AccessibilityTabs 
                                                        style={{ backgroundColor: this.props.accessibility.activeTab === 'APP' ? 'rgb(181, 121, 54, 0.2)' : '#FFFFFF', fontWeight: this.props.accessibility.activeTab === 'APP' ? 'bold' : 'normal' }}
                                                        onClick={this._onTabClick.bind(this, 'APP')}
                                                        disabled={activeEditUserRole && typeof activeEditUserRole['appAccess'] === 'undefined'}
                                                    >
                                                        APP
                                                    </AccessibilityTabs>
                                                </AccessibilityGrid>
                                            </AccessibilityGrid>
                                        </TabsContainer>
                                            <AccessibilityTable 
                                                modules={this.props.accessibility.activeTab === 'AMI' ? this.props.accessibility.amiModules : this.props.accessibility.appModules}
                                                role={this.props.accessibility.activeUserRole}
                                                roles={this.props.accessibility.userRoles}
                                                tab={this.props.accessibility.activeTab}
                                                onCheckboxClick={this._onCheckboxClick.bind(this)}
                                                onModuleCheckboxClick={this._onModuleCheckboxClick.bind(this)}
                                                activeEditUserRole={this.props.accessibility.activeEditUserRole}
                                                activeModuleCheckbox={this.props.accessibility.activeModuleCheckbox}
                                            />
                                        
                                    </>
                                }
                            </AccessibilityContentContainer>
                            }
                        </AccessibilityContainer>
                    </SymphonyContentContainer>
                </SymphonyContainer>
            </SymphonyLayout>
        )
    }
}

const mapStateToProps = (state: AppState) => {
    return {
        accessibility: state.accessibility,
    }
}

export default withRouter(connect(mapStateToProps, {
    setSystemState,
    setAccessibilityState,
    getUserRoles,
    getUserRole,
    upsertUserRole,
    loadModules
})(Accessibility));