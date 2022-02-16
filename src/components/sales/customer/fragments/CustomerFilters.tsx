import React from 'react';
import { Filter } from '../../../../utils/filter';
import SymphonyInput from '../../../symphony/SymphonyInput';
import Box from '@material-ui/core/Box';
import lFilter from 'lodash/filter';
import uniqBy from 'lodash/uniqBy';

interface KeyPair { label: string, value: string };
interface CustomerFiltersProps {
    filter: Partial<Filter>;
    onFilterInput: (key: string, value: string | Array<string> | number | Array<number>) => void;
    channels: Array<KeyPair>;
    salespersons: Array<KeyPair>;
}

const CustomerFilters = (props: CustomerFiltersProps) => {
    const { onFilterInput, filter, channels, salespersons } = props;
    return (
        <Box display="flex" flexDirection="column">
            <SymphonyInput
                id="customer-salesperson-name-filter"
                type="freeinput"
                value={filter.salespersonId ? filter.salespersonId as Array<string> : []}
                label="Salesperson Name"
                autocompleteOptions={salespersons}
                onfreeAutocompleteChange={(e: React.ChangeEvent<{}>, v: Array<unknown>) => {
                    if (v) {
                        onFilterInput('salespersonId',v as Array<string>);
                    }
                }}
            />
            <SymphonyInput
                id="customer-channel-filter"
                type="freeinput"
                value={filter.channel ? filter.channel as Array<string> : []}
                label="Channel"
                autocompleteOptions={
                    uniqBy(
                        lFilter(channels, (c) => c.label && c.value ) as Array<KeyPair>,
                        (i: KeyPair) => i.value
                    )
                }
                onfreeAutocompleteChange={(e: React.ChangeEvent<{}>, v: Array<unknown>) => {
                    if (v) {
                        onFilterInput('channel', v as Array<string>);
                    }
                }}
            />
        </Box>
    )
}

export default CustomerFilters;