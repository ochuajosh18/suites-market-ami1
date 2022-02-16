import React from 'react';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';
import { Tier1Type, Tier2Type } from '../../../store/product/types';
import { DynamicBasicPromotionType } from '../../../store/promotion/types';

import Box from '@material-ui/core/Box';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import LinearProgress from '@material-ui/core/LinearProgress';

import { CustomTreeItem, BasicCategoryInputSelectedBox} from './BasicCommonComponents';

interface BasicTreeViewProps {
    tierOneCategories: Array<Tier1Type>;
    tierTwoCategories: Array<Tier2Type>;
    tierThreeCategories: Array<string>;
    fetchTierTwoCategories: (h1: string) => void;
    fetchTierThreeCategories: (h1: string, h2: string) => void;
    selectedTierOne?: string;
    selectedTierTwo?: string 
    selectedTierThree?: string;
    basicInputState: (input: { [name: string]: DynamicBasicPromotionType }) => void;
}

export default (props: BasicTreeViewProps) => {
    const [ expanded, setExpanded ] = React.useState(['']);
    const [ selectedTierOne, setSelectedTier1 ] = React.useState('');
    const [ selectedTierTwo, setSelectedTier2 ] = React.useState('');

    React.useEffect(() => {
        let tier1Index = findIndex(props.tierOneCategories, (tier1) => tier1.h1 === props.selectedTierOne);
        let tier2Index = findIndex(props.tierTwoCategories, (tier2) => tier2.h2 === props.selectedTierTwo);
        let tier3Index = findIndex(props.tierThreeCategories, (tier3) => tier3 === props.selectedTierThree);
        setSelectedTier1(typeof props.selectedTierOne === 'undefined' ? '' : props.selectedTierOne);
        setSelectedTier2(typeof props.selectedTierTwo === 'undefined' ? '' : props.selectedTierTwo);
        if(tier1Index > -1 && tier2Index > -1 && tier3Index > -1) {
            setExpanded([`${tier1Index}${props.selectedTierOne}_h1`, `${tier2Index}${props.selectedTierTwo}_h2`,`${tier3Index}${props.selectedTierThree}_h3`])
        } else if(tier1Index > -1 && tier2Index > -1) {
            setExpanded([`${tier1Index}${props.selectedTierOne}_h1`, `${tier2Index}${props.selectedTierTwo}_h2`])
        } else if(tier1Index > -1) {
            setExpanded([`${tier1Index}${props.selectedTierOne}_h1`])
        }
    }, [])

    return (
        <>
            <BasicCategoryInputSelectedBox>
                <Box style={{ marginRight: 8 }}>Selected: </Box>
                <Box>
                    {props.selectedTierOne ? props.selectedTierOne : '-'}
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {props.selectedTierTwo &&
                        <>
                            <ChevronRightIcon />
                            {props.selectedTierTwo}
                        </>
                    }
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {props.selectedTierThree &&
                        <>
                            <ChevronRightIcon />
                            {props.selectedTierThree}
                        </>
                    }
                </Box>
            </BasicCategoryInputSelectedBox>
            <TreeView
                style={{  
                    maxHeight: '400px',
                    maxWidth: '100%',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    overflowY: 'auto',
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black',
                    padding: '8px 0px'
                }}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                selected={expanded}
            >
                    {map(props.tierOneCategories, (tier1, tier1Index) => {
                        if(tier1.hasSubCategory) {
                            return (
                                <CustomTreeItem 
                                    nodeId={`${tier1Index}${tier1.h1}_h1`} 
                                    label={tier1.h1} 
                                    style={{ paddingLeft: 10 }} 
                                    onIconClick={(e) => e.preventDefault()}
                                    onLabelClick={() => {
                                        setSelectedTier1(tier1.h1)
                                        setExpanded([`${tier1Index}${tier1.h1}_h1`])
                                        props.basicInputState({ 
                                            'tierTwoCategories' : [] as Array<Tier1Type>, 
                                            'tierThreeCategories' : [] as Array<Tier2Type> , 
                                            'selectedTierOneCategory' : tier1.h1, 
                                            'selectedTierTwoCategory' : '', 
                                            'selectedTierThreeCategory' : '', 
                                            'hasSubCategory' : true 
                                        })
                                        props.fetchTierTwoCategories(tier1.h1)
                                    }}
                                >
                                    {
                                        props.tierTwoCategories.length === 0 && selectedTierOne === tier1.h1 &&
                                        <LinearProgress variant="determinate" />
                                    }
                                    {
                                        selectedTierOne === tier1.h1 && 
                                        map(props.tierTwoCategories, (tier2, tier2Index) => {
                                            if(tier2.hasSubCategory) {
                                                return (
                                                    <CustomTreeItem 
                                                        nodeId={`${tier2Index}${tier2.h2}_h2`} 
                                                        label={tier2.h2} 
                                                        onIconClick={(e) => e.preventDefault()}
                                                        onLabelClick={() =>{
                                                            setSelectedTier2(tier2.h2);
                                                            setExpanded([`${tier1Index}${tier1.h1}_h1`, `${tier2Index}${tier2.h2}_h2`])
                                                            props.basicInputState({ 'tierThreeCategories' : [], 'selectedTierTwoCategory' : tier2.h2, 'selectedTierThreeCategory' : '', hasSubCategory: true })
                                                            props.fetchTierThreeCategories(tier1.h1, tier2.h2)
                                                        }}
                                                    >
                                                        {
                                                            props.tierThreeCategories.length === 0 && selectedTierTwo === tier2.h2 &&
                                                            <LinearProgress variant="determinate" />
                                                        }
                                                        {
                                                            selectedTierTwo === tier2.h2 && 
                                                            map(props.tierThreeCategories, (tier3, tier3Index) => {
                                                                return (
                                                                    <TreeItem 
                                                                        nodeId={`${tier3Index}${tier3}_h3`} 
                                                                        label={tier3} 
                                                                        style={{ paddingLeft: 10 }} 
                                                                        onIconClick={(e) => e.preventDefault()}
                                                                        onLabelClick={() => {
                                                                            setExpanded([`${tier1Index}${tier1.h1}_h1`, `${tier2Index}${tier2.h2}_h2`, `${tier3Index}${tier3}_h3`])
                                                                            props.basicInputState({ 'tierThreeCategories' : [], 'selectedTierThreeCategory' : tier3 })
                                                                            props.fetchTierThreeCategories(tier1.h1, tier2.h2)
                                                                        }}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </CustomTreeItem>
                                                )
                                            } else {
                                                return (
                                                    <CustomTreeItem 
                                                        nodeId={`${tier2Index}${tier2.h2}_h2`} 
                                                        label={tier2.h2} 
                                                        style={{ paddingLeft: 10 }} 
                                                        onLabelClick={() => {
                                                            setExpanded([`${tier1Index}${tier1.h1}_h1`, `${tier2Index}${tier2.h2}_h2`])
                                                            props.basicInputState({ 'tierThreeCategories' : [], 'selectedTierTwoCategory' : tier2.h2, 'selectedTierThreeCategory' : '', hasSubCategory: false })
                                                        }}
                                                    />
                                                )
                                            }
                                        })
                                    }
                                </CustomTreeItem>
                            )
                        } else {
                            return (
                                <CustomTreeItem 
                                    nodeId={`${tier1Index}${tier1.h1}_h1`} 
                                    label={tier1.h1} 
                                    style={{ paddingLeft: 10 }} 
                                    onLabelClick={() => {
                                        setExpanded([`${tier1Index}${tier1.h1}_h1`])
                                        props.basicInputState({ 
                                            'tierTwoCategories' : [], 
                                            'tierThreeCategories' : [], 
                                            'selectedTierOneCategory' : tier1.h1, 
                                            'selectedTierTwoCategory' : '', 
                                            'selectedTierThreeCategory' : '', 
                                            'hasSubCategory' : false 
                                        })
                                    }}
                                />
                            )
                        }
                    })}
            </TreeView>
        </>
    )
}