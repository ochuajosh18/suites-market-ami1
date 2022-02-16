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
import { Promotion } from '../../../../store/promotion/types';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';

interface PromtionListProps {
    promotions: Array<Promotion>;
    loading: boolean;
    activePromotionId: string;
    promotionSearch: string;
    onPromotionClick: (id: string) => void;
    onAddPromotionClick: () => void;
    onPromotionSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeletePromotionClick: (promotionId: string) => void;
}

export default (props: PromtionListProps) => {
    return (
        <ListBox>
            <ListHeaderContainer
                display="flex"
                p={1.5}
            >
                <Box flexGrow={1}>
                    Promo Title
                </Box>
                <Box>
                    <IconButton
                        size="small"
                        color="default"
                        onClick={props.onAddPromotionClick}
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
                        onChange={props.onPromotionSearch}
                    />
                </InlineSearchBox>
                {props.loading ?
                    <ListContainerBox>
                        <CircularProgress />
                    </ListContainerBox>
                :
                    <>
                        <Box py={1} px={2}>
                            <MenuList>
                                {map(props.promotions, (item) => 
                                    <MenuItem
                                        onClick={() => props.onPromotionClick(item.id)}
                                        key={item.id}
                                        style={{ fontWeight: props.activePromotionId === item.id ? 'bold' : 'normal' }}
                                    >
                                        {`${item.title}`}
                                        <ListToolContainer>
                                            <ListToolButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                e.stopPropagation();
                                                props.onDeletePromotionClick(item.id);
                                            }}>
                                                <Delete htmlColor="#000" />
                                            </ListToolButton>
                                        </ListToolContainer>
                                    </MenuItem>
                                )}
                            </MenuList>
                        </Box>
                    </>
                }
            </ScrollBox>
        </ListBox>
    )
}