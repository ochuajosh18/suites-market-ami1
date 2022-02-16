import React from 'react';
import { User, Role } from '../../../../store/usermanagement/types';

// Local Components
import { 
    UserAccountDialogContentContainer,
    NameContainer,
    NameInputContainer
} from './UserManagementComponents';

// Global Components
import SymphonyInput from '../../../symphony/SymphonyInput';

// Material UI
import Box from '@material-ui/core/Box';

// Utils
import map from 'lodash/map';

interface UserAccountDialogContentProps {
    activeUser?: User;
    userRoles: Array<Role>;
    onChangeActiveUserInput: (property: string, value: string) => void;
}

const UserAccountDialogContent = (props: UserAccountDialogContentProps) => {
    const { activeUser, userRoles, onChangeActiveUserInput } = props;
    return (
        <UserAccountDialogContentContainer>
            { activeUser &&
                <Box>
                    <NameContainer>
                        <NameInputContainer>
                            <SymphonyInput 
                                id="useraccount-firstname-input"
                                type="text"
                                value={activeUser.firstName}
                                label="First Name"
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    onChangeActiveUserInput('firstName', e.target.value)
                                }}
                            />
                        </NameInputContainer>
                        <NameInputContainer>
                            <SymphonyInput 
                                id="useraccount-lastname-input"
                                type="text"
                                value={activeUser.lastName}
                                label="Last Name"
                                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    onChangeActiveUserInput('lastName', e.target.value)
                                }}
                            />
                        </NameInputContainer>
                    </NameContainer>
                    <SymphonyInput 
                        id="useraccount-email-input"
                        type="text"
                        value={activeUser.email}
                        label="Email"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                            onChangeActiveUserInput('email', e.target.value)
                        }}
                    />
                    <SymphonyInput
                        id="useraccount-role-select"
                        key="useraccount-role-select"
                        type="select"
                        label="Role"
                        value={activeUser.role}
                        selectOptions={map(userRoles, (role) => ({
                            label: role.name,
                            value: role.name
                        }))}
                        selectOnchange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            console.log(e.target.value)
                            onChangeActiveUserInput('role', e.target.value as string)
                        }}
                    />
                    <SymphonyInput
                        id="useraccount-status-input"
                        value={activeUser.status === 'Active' ? true : false as boolean}
                        label="Status"
                        type="radio"
                        radioTrueText="Active"
                        radioFalseText="Inactive"
                        onRadioButtonChange={(val: boolean) => {
                            onChangeActiveUserInput('status', val ? 'Active' : 'Inactive')
                        }}
                    />
                </Box>
            }
        </UserAccountDialogContentContainer>
    )
}

export default UserAccountDialogContent;