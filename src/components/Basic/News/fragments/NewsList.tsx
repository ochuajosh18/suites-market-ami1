import React from 'react';
import {
    ListBox,
    ListContainerBox,
    ScrollBox,
    InlineSearchBox,
    ListHeaderContainer,
    ListToolContainer,
    ListToolButton
} from '../../Common/BasicCommonComponents';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import map from 'lodash/map';
import { News } from '../../../../store/news/types';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';

interface PromtionListProps {
    news: Array<News>;
    loading: boolean;
    activeNewsId: string;
    onNewsClick: (id: string) => void;
    onNewsSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddNewsClick: () => void;
    onDeleteNewsClick: (newsId: string) => void;
}

export default (props: PromtionListProps) => {
    return (
        <ListBox>
            <ListHeaderContainer
                display="flex"
                p={1.5}
            >
                <Box flexGrow={1}>
                    News Title
                </Box>
                <Box>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={props.onAddNewsClick}
                    >
                        <AddIcon fontSize="large" htmlColor="#FFF" />
                    </IconButton>
                </Box>
            </ListHeaderContainer>
            <ScrollBox>
                <InlineSearchBox>
                    <TextField
                        className="round-border1"
                        fullWidth
                        size="small"
                        label="Search"
                        variant="outlined"
                        onChange={props.onNewsSearch}
                    />
                </InlineSearchBox>
                {props.loading ?
                    <ListContainerBox>
                        <CircularProgress />
                    </ListContainerBox>
                :
                    <Box py={1} px={2}>
                        <MenuList>
                            {props.news.length > 0 ?
                                <>
                                    {map(props.news, (item) => 
                                        <MenuItem
                                            onClick={() => props.onNewsClick(item.id)}
                                            key={item.id}
                                            style={{ fontWeight: props.activeNewsId === item.id ? 'bold' : 'normal' }}
                                        >
                                            {`${item.title}`}
                                            <ListToolContainer>
                                                <ListToolButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    props.onDeleteNewsClick(item.id)
                                                }}>
                                                    <Delete htmlColor="#000" />
                                                </ListToolButton>
                                            </ListToolContainer>
                                        </MenuItem>
                                    )}
                                </>
                                :
                                <Box textAlign="center">No News Data</Box>
                            }
                        </MenuList>
                    </Box>
                }
            </ScrollBox>
        </ListBox>
    )
}