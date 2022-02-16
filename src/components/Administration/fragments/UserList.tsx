import React from 'react';
import {
    ListBox,
    ListContainerBox,
    SearchBox,
    ScrollBox
} from '../../Basic/Common/BasicCommonComponents';
import { AdministrationUser } from '../../../store/administration/types';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import map from 'lodash/map';

interface UserListProps {
    entities: Array<AdministrationUser>;
    loading: boolean;
    activeUserId: string;
    onUserClick: (id: string) => void;
    onUserSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUserCreateClick: () => void;
}

export default (props: UserListProps) => {
    return (
        <ListBox>
            <SearchBox
                display="flex"
                p={1.5}
                style={{ paddingRight: 8 }}
            >
                <Box flexGrow={1}>
                    <TextField
                        className="round-border1"
                        fullWidth
                        size="small"
                        label="Search"
                        variant="outlined"
                        onChange={props.onUserSearch}
                    />
                </Box>
                <Box>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={props.onUserCreateClick}
                    >
                        <AddIcon fontSize="large" htmlColor="#000" />
                    </IconButton>
                </Box>
            </SearchBox>
            <ScrollBox>
                {props.loading ?
                    <ListContainerBox>
                        <CircularProgress />
                    </ListContainerBox>
                :
                    <Box py={1} px={2}>
                        <MenuList>
                            {map(props.entities, (item) => 
                                <MenuItem
                                    onClick={() => props.onUserClick(item.id)}
                                    key={item.id}
                                    style={{ fontWeight: props.activeUserId === item.id ? 'bold' : 'normal' }}
                                >
                                    {`${item.firstName} ${item.lastName}`}
                                </MenuItem>
                            )}
                        </MenuList>
                    </Box>
                }
            </ScrollBox>
        </ListBox>
    )
}