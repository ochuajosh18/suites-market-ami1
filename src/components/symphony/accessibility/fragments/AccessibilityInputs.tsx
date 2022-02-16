import React from 'react';
import { UserRole } from '../../../../store/accessibility/types';

// global
import SymphonyInput from '../../SymphonyInput';

// local
import { 
    DropdownContainer,
    AccessibilityGrid,
} from './AccessibilityComponents';

interface AccessibilityInputsProps {
    activePlatform: string;
    platforms: Array<string>;
    onAccessibilityInput: (field: string, value: string) => void;
    activeEditUserRole: UserRole;
    userRoles: Array<UserRole>;
}

const AccessibilityInputs = (props: AccessibilityInputsProps) => {
    const { onAccessibilityInput, activeEditUserRole } = props;
    return (
        <DropdownContainer>
            <AccessibilityGrid container>
                {/* <AccessibilityGrid item xs={6}>
                    <InputContainer>
                        <SymphonyInput
                            disabled={true}
                            id="accessibility-platform-select"
                            type="select"
                            label="Platform"
                            value={activePlatform}
                            selectOptions={map(platforms, (p) => ({
                                label:  p,
                                value: p
                            }))}
                            selectOnchange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                onAccessibilityInput('activePlatform', e.target.value as string);
                            }}
                        />
                    </InputContainer>
                </AccessibilityGrid> */}
                <SymphonyInput 
                    type="text"
                    label="Role Name"
                    value={activeEditUserRole.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        onAccessibilityInput('name', e.target.value);
                    }}
                />
                <SymphonyInput 
                    type="multiline"
                    label="Role Description"
                    value={activeEditUserRole.description}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        onAccessibilityInput('description', e.target.value);
                    }}
                />
            </AccessibilityGrid>
        </DropdownContainer>
    )
};

export default AccessibilityInputs;