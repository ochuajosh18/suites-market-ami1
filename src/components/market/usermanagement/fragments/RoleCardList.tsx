import React from 'react';
import { Role } from '../../../../store/usermanagement/types';
import { 
    RoleListGrid,
    RoleListContainer,
    DecoratedPopoverButton,
    InnerCategoryListContainer
} from './UserManagementComponents';
import RoleAuxMenu from './RoleAuxMenu';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';

// util
import map from 'lodash/map';

// Assets
import EditIcon from '../../../../assets/images/icons/symphony-edit-gold.png';

interface RoleCardListProps {
    roles: Array<Role>;
    onEditClick: (id: string, name: string, description: string) => void;
    toggleDeleteModal: (open: boolean, id: string) => void
}

const RoleCardList = (props: RoleCardListProps) => {
    const { roles, onEditClick, toggleDeleteModal } = props;
    return (
        <RoleListContainer style={{ paddingTop: 30 }}>
            <Grid container={true} style={{ backgroundColor: '#F4F6F9' }}>
                <RoleListGrid item={true} xs={3} style={{ paddingLeft: 70 }}>
                    <Box display="inline" >Roles</Box>
                </RoleListGrid>
                <RoleListGrid item={true} xs={8}>
                    <Box display="inline">Role Description </Box>
                </RoleListGrid>
            </Grid>
            <Divider/>
            <InnerCategoryListContainer>
                {map(roles, ({ name, description, id, isDefault }) => {
                    return (
                        <Box key={id}>
                            <Grid container={true}>
                                <RoleListGrid item={true} xs={3} style={{ paddingLeft: 70 }}>
                                    <Box display="inline">{name}</Box>
                                </RoleListGrid>
                                <RoleListGrid item={true} xs={8}>
                                    <Box display="inline" color="#A2A2A2">{description}</Box>
                                </RoleListGrid>
                                <RoleListGrid item={true} xs={1}>
                                    <RoleAuxMenu roleId={id} disabled={isDefault}>
                                        <DecoratedPopoverButton
                                            id={`role-edit-btn-${id}`}
                                            style={{ color: '#4C89F5' }}
                                            endIcon={<img src={EditIcon} style={{ width: 14, height: 14 }} alt="" />}
                                            onClick={() => onEditClick(id, name, description)}
                                        >
                                            Edit
                                        </DecoratedPopoverButton>
                                        <DecoratedPopoverButton
                                            id={`role-delete-btn-${id}`}
                                            style={{ color: '#FF4D4D' }}
                                            endIcon={<Icon className="fa fa-trash-alt" />}
                                            onClick={() => toggleDeleteModal(true, id)}
                                        >
                                            Delete
                                        </DecoratedPopoverButton>
                                    </RoleAuxMenu>
                                </RoleListGrid>
                            </Grid>
                            <Divider/>
                        </Box>
                    )
                })}
            </InnerCategoryListContainer>
        </RoleListContainer>
    )
}

export default RoleCardList;