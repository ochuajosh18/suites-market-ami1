import React from 'react';
import { AdministrationUser, UserRole } from '../../../store/administration/types';
import {
    DetailHeaderBox,
    FieldBox 
} from '../../Basic/Common/BasicCommonComponents'
import EntityInput from './UserInput';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import find from 'lodash/find';
import map from 'lodash/map';

interface AutocompletePair { 
    label: string;
    value: string;
}

interface UserViewProps {
    user?: AdministrationUser;
    roles: Array<UserRole>;
    entityLoading: boolean;
    action: string;
    onChange: (field: string, value: string | boolean) => void;
    onUserDelete: () => void;
    onUserCancel: () => void;
}

export default (props: UserViewProps) => {
    return (
        <Box style={{ flex: 1, flexDirection: 'column', display: 'flex', width: '100%', height: '100%' }}>
            {props.user &&
                <>
                    <DetailHeaderBox>
                        <Box style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                            {`${props.user.firstName ? props.user.firstName : ''} ${props.user.lastName ? props.user.lastName : ''}`}
                        </Box>
                        {props.action === 'Create' &&
                            <Box>
                                <Typography 
                                    style={{ fontSize: 13, color: '#FFF', cursor: 'pointer' }} 
                                    onClick={props.onUserCancel}
                                >
                                    Cancel
                                </Typography>
                            </Box>
                        }
                    </DetailHeaderBox>
                    <FieldBox>
                        <EntityInput 
                            type="text"
                            label="First Name"
                            value={props.user.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                props.onChange('firstName', e.target.value)
                            }}
                        />
                        <EntityInput 
                            type="text"
                            label="Last Name"
                            value={props.user.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                props.onChange('lastName', e.target.value)
                            }}
                        />
                        <EntityInput 
                            type="text"
                            label="Email Address"
                            value={props.user.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                props.onChange('email', e.target.value.trim())
                            }}
                        />
                        <EntityInput 
                            type="dropdown"
                            label="User Role"
                            autocompleteList={map(props.roles, (role) => ({
                                label: role.name,
                                value: role.id
                            }))}
                            value={find(props.roles, { id: props.user.roleId }) ? find(props.roles, { id: props.user.roleId })!.name : ''}
                            onAutocompleteChange={(e, v: AutocompletePair) => {
                                props.onChange('roleId', v.value)
                            }}
                        />
                        <EntityInput 
                            type="radio"
                            label="Status"
                            value={props.user.isActive === true}
                            radioTrueText="Active"
                            radioFalseText="Inactive"
                            onRadioButtonChange={(value: boolean) => {
                                props.onChange('isActive', value)
                            }}
                        />
                    </FieldBox>
                    {props.action === 'Update' &&
                        <Box style={{  display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
                            <Button
                                style={{ border: '3px solid #000', backgroundColor: 'transparent', width: '20%', borderRadius: 30 }}
                                variant="contained"
                                onClick={props.onUserDelete}
                            >
                                Delete
                            </Button>
                        </Box>
                    }
                </>
            }
        </Box>
    )
}