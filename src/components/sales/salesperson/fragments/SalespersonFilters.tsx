import React from 'react';
import { Filter } from '../../../../utils/filter';
import SymphonyInput from '../../../symphony/SymphonyInput';
import Box from '@material-ui/core/Box';

interface KeyPair { label: string, value: string };
interface SalespersonFiltersProps {
    filter: Partial<Filter>;
    onFilterInput: (key: string, value: string | Array<string> | number | Array<number>) => void;
    salespersons: Array<KeyPair>;
}

const SalespersonFilters = (props: SalespersonFiltersProps) => {
    const { onFilterInput, filter, salespersons } = props;
    return (
        <Box display="flex" flexDirection="column">
            <SymphonyInput
                type="freeinput"
                value={filter.name ? filter.name as Array<string> : []}
                label="Salesperson Name"
                autocompleteFreeInput={false}
                autocompleteOptions={salespersons}
                onfreeAutocompleteChange={(e: React.ChangeEvent<{}>, v: Array<unknown>) => {
                    if (v) {
                        onFilterInput('name',v as Array<string>);
                    }
                }}
            />
        </Box>
    )
}

export default SalespersonFilters;