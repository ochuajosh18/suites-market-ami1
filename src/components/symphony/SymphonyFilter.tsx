import React from 'react';
import { AutocompleteKeyPair } from '../../store/system/types';
import { Filter as FilterType } from '../../utils/filter';
import {
    SymphonyFilterContainer,
    SymphonyFilterButton,
    SymphonyFiltersContainer,
    SymphonyFilterItemsContainer,
    SymphonyActiveFiltersContainer,
    SymphonyFiltersActionsContainer,
    SymphonyFilterActionButton,
    SymphonyActiveFilter,
    SymphonyActiveFilterRemove
} from './SymphonyCommonComponents';

import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
// import makeStyles from '@material-ui/styles/makeStyles';
// import createStyles from '@material-ui/styles/createStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import map from 'lodash/map';
interface FilterProps {
    filters: Partial<FilterType>;
    activeFilters: Partial<FilterType>;
    dataLength: number;
    onReset: () => void;
    onRemoveFilter: (key: string, filter: string | Array<string> | number | undefined | AutocompleteKeyPair) => void;
    onFilterApply: () => void;
    children: JSX.Element | Array<JSX.Element> | string;
}

// const useStyles = makeStyles(() => createStyles({
//     datePicker: {
//         '& .MuiPickersDatePickerRoot-toolbar': {
//             backgroundColor: '#181E28'
//         },
//         '& .MuiPickersToolbarText-toolbarTxt': {
//             backgroundColor: '#181E28',
//             color: '#FFF'
//         },
//         '& .MuiPickersDay-daySelected': {
//             backgroundColor: '#181E28'
//         }
//     }
// }));

const Filter = (props: FilterProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;
    
    const { activeFilters, children, onFilterApply, onReset, onRemoveFilter } = props;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        event.preventDefault();
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <SymphonyFilterContainer id="filter-container" >
            <SymphonyFilterButton 
                id="symphony-filter-button"
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}
            >
                Filter
            </SymphonyFilterButton>
            <SymphonyActiveFiltersContainer>
                {map(Object.keys(activeFilters), (a) => {
                    switch(a) {
                        case 'paymentMethod': 
                            return map(activeFilters[a] as Array<string>, (paymentType: string) => (
                                <SymphonyActiveFilter className="symphony-active-filter" key={paymentType}>
                                    {`Payment: ${paymentType}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, paymentType)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                        case 'name': 
                            return map(activeFilters[a] as Array<AutocompleteKeyPair>, (o) => (
                                <SymphonyActiveFilter className="symphony-active-filter" key={o.value}>
                                    {`Name: ${o.value}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, o)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                        case 'minPrice':
                            return (
                                <SymphonyActiveFilter className="symphony-active-filter" key={`minprice-${activeFilters[a] as string}`}>
                                    {`Minimum Price: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a] as number)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            );
                        case 'maxPrice':
                            return (
                                <SymphonyActiveFilter className="symphony-active-filter"  key={`maxprice-${activeFilters[a] as string}`}>
                                    {`Maximum Price: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a] as number)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            )
                        case 'status':
                            return map(activeFilters[a] as Array<string>, (status: string) => (
                                <SymphonyActiveFilter className="symphony-active-filter" key={status}>
                                    {`Status: ${status}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, status)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                        case 'startDate':
                            return (
                                <SymphonyActiveFilter className="symphony-active-filter"  key={`startdate-${activeFilters[a] as string}`}>
                                    {`From: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a] as string)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            );
                        case 'endDate':
                            return (
                                <SymphonyActiveFilter className="symphony-active-filter" key={`enddate-${activeFilters[a] as string}`}>
                                    {`To: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a] as string)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ) 
                        case 'salespersonId':
                            return map(activeFilters[a] as Array<AutocompleteKeyPair>, (s: AutocompleteKeyPair) => (
                                <SymphonyActiveFilter className="symphony-active-filter" key={s.value}>
                                    {`Salesperson: ${s.label}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, s)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                        case 'channel':
                            return map(activeFilters[a] as Array<AutocompleteKeyPair>, (s: AutocompleteKeyPair) => (
                                <SymphonyActiveFilter className="symphony-active-filter" key={s.value}>
                                    {`Channel: ${s.label}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, s)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                    }
                })}
            </SymphonyActiveFiltersContainer>
            <Box color="#959595" fontSize="12px" display="flex" minWidth="140px" marginLeft="8px" justifyContent="flex-end">
                Showing {props.dataLength} results
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <SymphonyFiltersContainer>
                    <SymphonyFilterItemsContainer>
                        {children}
                    </SymphonyFilterItemsContainer>
                    <SymphonyFiltersActionsContainer>
                        <Box display="flex" justifyContent="space-between" width="100%">
                            <SymphonyFilterActionButton variant="outlined" onClick={handleClose}>
                                Cancel
                            </SymphonyFilterActionButton>
                            <Box>
                                <SymphonyFilterActionButton 
                                    variant="outlined" 
                                    style={{ marginRight: 12 }} 
                                    onClick={() => {
                                        onReset();
                                        handleClose();
                                    }}
                                >
                                    Reset
                                </SymphonyFilterActionButton>
                                <SymphonyFilterActionButton 
                                    onClick={() => {
                                        onFilterApply();
                                        handleClose();
                                    }}
                                >
                                    Apply
                                </SymphonyFilterActionButton>
                            </Box>
                        </Box>
                    </SymphonyFiltersActionsContainer>
                </SymphonyFiltersContainer>
            </Popover>
        </SymphonyFilterContainer>
    )
}

export default Filter;