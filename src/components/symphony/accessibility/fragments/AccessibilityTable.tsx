import React from 'react';
import { UserRole, AccessibilityTabs } from '../../../../store/accessibility/types';

// Components
import { 
    TableHeaderContainer,
    TableBodyContainer,
    TableRowContainer,
    AccessibilityGrid,
    HorizontalContainer,
    AccessibilityCheckbox,
} from './AccessibilityComponents';

//utils
import map from 'lodash/map';

interface AccessibilityTableProps {
    modules: Array<string>;
    role: string;
    roles: Array<UserRole>;
    tab: AccessibilityTabs;
    onCheckboxClick: (value: string) => void;
    onModuleCheckboxClick: (value: string) => void;
    activeEditUserRole?: UserRole;
    activeModuleCheckbox: Array<string>;
}

export default (props: AccessibilityTableProps) => {

    const { activeEditUserRole } = props;
    return (
        <>
            <TableHeaderContainer id="accessibility-table-container">
                <AccessibilityGrid container>
                    <AccessibilityGrid item xs={4}>
                        <HorizontalContainer>
                            <AccessibilityCheckbox 
                                id="accessibility-table-all-checkbox"
                                checked={props.activeModuleCheckbox.includes('ALL')}
                                onClick={() => props.onModuleCheckboxClick('ALL')} 
                            />
                            Module
                        </HorizontalContainer>
                    </AccessibilityGrid>
                    <AccessibilityGrid item xs={2}>
                        <HorizontalContainer>
                            View
                        </HorizontalContainer>
                    </AccessibilityGrid>
                    <AccessibilityGrid item xs={2}>
                        <HorizontalContainer>
                            Add
                        </HorizontalContainer>
                    </AccessibilityGrid>
                    <AccessibilityGrid item xs={2}>
                        <HorizontalContainer>
                            Edit
                        </HorizontalContainer>
                    </AccessibilityGrid>
                    <AccessibilityGrid item xs={2}>
                        <HorizontalContainer>
                            Delete
                        </HorizontalContainer>
                    </AccessibilityGrid>
                </AccessibilityGrid>
            </TableHeaderContainer>
            {activeEditUserRole ? 
                <TableBodyContainer id="accessibility-crud-table">
                    {map(props.modules, (module) => {
                        const moduleComparator = module.toUpperCase().replace(/ +/g, '_');
                        const viewComparator = props.tab === 'AMI' ? (activeEditUserRole.amiAccess.includes(`VIEW::${moduleComparator}`)) : (activeEditUserRole.appAccess.includes(`VIEW::${moduleComparator}`));
                        const addComparator = props.tab === 'AMI' ? (activeEditUserRole.amiAccess.includes(`CREATE::${moduleComparator}`)) : (activeEditUserRole.appAccess.includes(`CREATE::${moduleComparator}`));
                        const editComparator = props.tab === 'AMI' ? (activeEditUserRole.amiAccess.includes(`UPDATE::${moduleComparator}`)) : (activeEditUserRole.appAccess.includes(`UPDATE::${moduleComparator}`));
                        const deleteComparator = props.tab === 'AMI' ? (activeEditUserRole.amiAccess.includes(`DELETE::${moduleComparator}`)) : (activeEditUserRole.appAccess.includes(`DELETE::${moduleComparator}`));
                        return (
                            <TableRowContainer className="accessibility-crud-row" key={module}>
                                <AccessibilityGrid container>
                                    <AccessibilityGrid item xs={4}>
                                        <HorizontalContainer>
                                            <AccessibilityCheckbox 
                                                id={`module-${moduleComparator}-checkbox`}
                                                checked={props.activeModuleCheckbox.includes(module)}
                                                onClick={() => props.onModuleCheckboxClick(module)} 
                                            />
                                            {module}
                                        </HorizontalContainer>
                                    </AccessibilityGrid>
                                    <AccessibilityGrid item xs={2}>
                                        <HorizontalContainer>
                                            {/* View */}
                                            <AccessibilityCheckbox 
                                                id={`module-${moduleComparator}-view-checkbox`}
                                                className="accessibility-checkbox"
                                                checked={viewComparator} 
                                                onClick={() => props.onCheckboxClick(`VIEW::${moduleComparator}`)}
                                            />
                                        </HorizontalContainer>
                                    </AccessibilityGrid>
                                    <AccessibilityGrid item xs={2}>
                                        <HorizontalContainer>
                                            {/* Add */}
                                            <AccessibilityCheckbox 
                                                id={`module-${moduleComparator}-create-checkbox`}
                                                className="accessibility-checkbox"
                                                checked={addComparator} 
                                                onClick={() => props.onCheckboxClick(`CREATE::${moduleComparator}`)}
                                            />
                                        </HorizontalContainer>
                                    </AccessibilityGrid>
                                    <AccessibilityGrid item xs={2}>
                                        <HorizontalContainer>
                                            {/* Edit */}
                                            <AccessibilityCheckbox 
                                                id={`module-${moduleComparator}-update-checkbox`}
                                                className="accessibility-checkbox"
                                                checked={editComparator} 
                                                onClick={() => props.onCheckboxClick(`UPDATE::${moduleComparator}`)}
                                            />
                                        </HorizontalContainer>
                                    </AccessibilityGrid>
                                    <AccessibilityGrid item xs={2}>
                                        <HorizontalContainer>
                                            {/* Delete */}
                                            <AccessibilityCheckbox 
                                                id={`module-${moduleComparator}-delete-checkbox`}
                                                className="accessibility-checkbox"
                                                checked={deleteComparator} 
                                                onClick={() => props.onCheckboxClick(`DELETE::${moduleComparator}`)}
                                            />
                                        </HorizontalContainer>
                                    </AccessibilityGrid>
                                </AccessibilityGrid>
                            </TableRowContainer>
                        )
                    })}
                </TableBodyContainer>
            :
                <></>
            }
            
        </>
    )
}