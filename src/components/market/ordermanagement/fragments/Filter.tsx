import React from 'react';
import { OrderManagementFilter } from '../../../../store/ordermanagement/types';
import { AutocompleteKeyPair } from '../../../../store/system/types';

import {
    SymphonyFilterContainer,
    SymphonyFilterButton,
    SymphonyFiltersContainer,
    SymphonyFilterItemsContainer,
    SymphonyActiveFiltersContainer,
    SymphonyFiltersActionsContainer,
    SymphonyFilterActionButton,
    SymphonyTextField,
    SymphonyInputGridContainer,
    SymphonyInputLabelGridContainer,
    SymphonyInputGridItemContainer,
    SymphonyActiveFilter,
    SymphonyActiveFilterRemove
} from '../../../symphony/SymphonyCommonComponents';
import SymphonyInput from '../../../symphony/SymphonyInput';

import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Popover from '@material-ui/core/Popover';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateRangeRoundedIcon from '@material-ui/icons/DateRangeRounded';
import RemoveIcon from '@material-ui/icons/Remove';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { SYMPHONY_SECONDARY_COLOR_DARK, SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

import moment from 'moment';
import map from 'lodash/map';
import filter from 'lodash/filter';

interface FilterProps {
    filters: Partial<OrderManagementFilter>;
    activeFilters: Partial<OrderManagementFilter>;
    onFilterInput: (key: string, value: string | Array<string> | number | Array<number>) => void;
    onOrderInput: (key: string, value: string | Array<string> | number | Array<number> | { }) => void;
    onReset: () => void;
    onRemoveFilter: (key: string, filter: string | number | undefined) => void;
    onFilterApply: () => void;
    isHistory: boolean;
    priceMin: number;
    priceMax: number;
    currency: string;
}

const useStyles = makeStyles(() => createStyles({
    datePicker: {
        '& .MuiPickersDatePickerRoot-toolbar': {
            backgroundColor: SYMPHONY_SECONDARY_COLOR_DARK
        },
        '& .MuiPickersToolbarText-toolbarTxt': {
            backgroundColor: SYMPHONY_SECONDARY_COLOR_DARK,
            color: '#FFF'
        },
        '& .MuiPickersDay-daySelected': {
            backgroundColor: SYMPHONY_PRIMARY_COLOR
        }
    }
}));

const Filter = (props: FilterProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;
    
    const { filters, activeFilters, isHistory, priceMin, priceMax, onFilterInput, onFilterApply, onReset, onRemoveFilter } = props;
    const { status, paymentMethod, minPrice, maxPrice, startDate, endDate } = filters;
    const { datePicker } = useStyles();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        event.preventDefault();
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <SymphonyFilterContainer id="filter-container">
            <SymphonyFilterButton 
                id="order-filter-button"
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}
            >
                Filter
            </SymphonyFilterButton>
            <SymphonyActiveFiltersContainer>
                {map(Object.keys(activeFilters), (a) => {
                    switch(a) {
                        case 'paymentMethod': 
                            return map(activeFilters[a], (paymentType: string) => (
                                <SymphonyActiveFilter key={paymentType}>
                                    {`Payment: ${paymentType}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, paymentType)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                        case 'minPrice':
                            return (
                                <SymphonyActiveFilter>
                                    {`Minimum Price: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a])}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            );
                        case 'maxPrice':
                            return (
                                <SymphonyActiveFilter>
                                    {`Maximum Price: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a])}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            )
                        case 'status':
                            return map(activeFilters[a], (status: string) => (
                                <SymphonyActiveFilter key={status}>
                                    {`Status: ${status}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, status)}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ));
                        case 'startDate':
                            return (
                                <SymphonyActiveFilter>
                                    {`From: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a])}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            );
                        case 'endDate':
                            return (
                                <SymphonyActiveFilter>
                                    {`To: ${activeFilters[a]}`}
                                    <SymphonyActiveFilterRemove className="remove-filter-button"  onClick={() => onRemoveFilter(a, activeFilters[a])}>
                                        <Icon className="fa fa-times" style={{ fontSize: 12, color: '#FFF' }} />
                                    </SymphonyActiveFilterRemove>
                                </SymphonyActiveFilter>
                            ) 
                    }
                })}
            </SymphonyActiveFiltersContainer>
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
                        <Box display="flex" flexDirection="column">
                            <SymphonyInput
                                key="order-filter-payment-radio"
                                id="order-filter-payment-radio"
                                type="radiolist"
                                label="Payment"
                                value=""
                                radioListValues={paymentMethod ? paymentMethod : []}
                                radioListItems={['Credit Card', 'Online Banking', 'COD']}
                                onRadioListInput={(val: string | AutocompleteKeyPair) => {
                                    if (paymentMethod) {
                                        onFilterInput('paymentMethod', paymentMethod.includes(val as string) ? filter(paymentMethod, (s) => s !== val as string) : [...paymentMethod, val as string]);
                                    }
                                    else {
                                        onFilterInput('paymentMethod', [val as string]);
                                    }
                                    
                                }}
                            />
                            {!isHistory &&
                                <SymphonyInput
                                    id="order-filter-status-radio"
                                    key="order-filter-status-radio"
                                    type="radiolist"
                                    label="Order Status"
                                    value=""
                                    radioListValues={status ? status : []}
                                    radioListItems={['Unpaid', 'Paid', 'Ready To Ship', 'Pending', 'Shipped', 'Delivered']}
                                    onRadioListInput={(val: string | AutocompleteKeyPair) => {
                                        if (status) {
                                            onFilterInput('status', status.includes(val as string) ? filter(status, (s) => s !== val as string) : [...status, val as string]);
                                        }
                                        else {
                                            onFilterInput('status', [val as string]);
                                        }
                                        
                                    }}
                                />
                            }
                            
                                <SymphonyInput
                                    id="order-filter-pricerange-slider"
                                    key="order-filter-pricerange-slider"
                                    type="slider"
                                    label="Price Range"
                                    value=""
                                    sliderValue={minPrice && maxPrice ? [minPrice, maxPrice] : [priceMin,priceMax]}
                                    sliderMin={priceMin}
                                    sliderMax={priceMax}
                                    sliderOnChange={(e: any, val: number | Array<number>) => {
                                        const min = (val as Array<number>)[0];
                                        const max = (val as Array<number>)[1];
                                        if (min !== minPrice)
                                            onFilterInput('minPrice', (val as Array<number>)[0]);
                                        if (max !== maxPrice)
                                            onFilterInput('maxPrice', (val as Array<number>)[1]);
                                    }}
                                    currency={props.currency}
                                />
                            
                            <SymphonyInputGridContainer container={true}>
                                <SymphonyInputLabelGridContainer className="symphony-input-label">Order Date Range</SymphonyInputLabelGridContainer>
                                <SymphonyInputGridItemContainer item={true} xs={12}>
                                    <KeyboardDatePicker 
                                    fullWidth={true}
                                    value={startDate ? moment(startDate, 'DD/MM/YYYY') : null} 
                                    onChange={(date, value) => {
                                        onFilterInput('startDate', value as string)
                                    }} 
                                    format="DD/MM/YYYY"
                                    TextFieldComponent={(props) =>
                                        <SymphonyTextField
                                            {...props}
                                            placeholder="Start Date"    
                                            value={props.value}
                                        />
                                    }
                                    maxDate={endDate ? moment(endDate, 'DD/MM/YYYY') : undefined}
                                    keyboardIcon={<DateRangeRoundedIcon />}
                                    KeyboardButtonProps={{ style: { padding: 2 }}}
                                    DialogProps={{ className: datePicker }}
                                    clearable={true}
                                />
                                <RemoveIcon style={{ marginRight: 16 }} htmlColor="#A1A1A1" />
                                <KeyboardDatePicker 
                                    fullWidth={true}
                                    value={endDate ? moment(endDate, 'DD/MM/YYYY') : null} 
                                    onChange={(date, value) => {
                                        onFilterInput('endDate', value as string)
                                    }} 
                                    format="DD/MM/YYYY"
                                    TextFieldComponent={(props) =>
                                        <SymphonyTextField
                                            {...props}
                                            placeholder="End Date"
                                            value={props.value}
                                        />
                                    }
                                    minDate={startDate ? moment(startDate, 'DD/MM/YYYY') : undefined}
                                    keyboardIcon={<DateRangeRoundedIcon />}
                                    KeyboardButtonProps={{ style: { padding: 2 }}}
                                    DialogProps={{ className: datePicker }}
                                    clearable={true}
                                />
                                </SymphonyInputGridItemContainer>
                            </SymphonyInputGridContainer>
                            <Box display="flex" flexDirection="row">
                                
                            </Box>
                        </Box>
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