import React from 'react';
import { Salesperson } from '../../../../store/salesperson/types';
import { AutocompleteKeyPair } from '../../../../store/system/types';
import { ICustomer } from '../../../../store/customer/types';
import {
    DistributorDialog,
    DistributorDialogTitle,
    DistributorDialogContent,
    DistributorDialogActions,
    DistributorDialogGrid,
    DistributorDialogActionButton
} from './DistributorComponents';

import SymphonyInput from '../../../symphony/SymphonyInput';
import { toastWarning } from '../../../../modules/Toast';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import map from 'lodash/map';
import find from 'lodash/find';
import filter from 'lodash/filter';

interface DistributorCustomerDialogProps {
    customers: Array<ICustomer>;
    salespersons: Array<Salesperson>
    open: boolean;
    onTagClick: (customerId: string) => void;
    onClose: () => void;
}

const DistributorCustomerDialog = (props: DistributorCustomerDialogProps) => {
    const { customers, salespersons, open, onTagClick, onClose } = props;
    type DropdownType = ICustomer | null;
    const [customer, setCustomer] = React.useState<DropdownType>(null);
    const sr: Salesperson | undefined = customer ? find(salespersons, { id: customer.salespersonId }) : undefined;
    return (
        <DistributorDialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth="xs"
        >
            <DistributorDialogTitle>Assign Customer</DistributorDialogTitle>
            <DistributorDialogContent>
                <SymphonyInput
                    type="searchabledropdown"
                    value={customer ? customer.id : ''}
                    label="Customer"
                    autocompleteOptions={filter(map(customers, (c) => ({ label: c.name, value: c.id })), (c) => Boolean(c.label && c.value))}
                    onAutocompleteChange={(e: React.ChangeEvent<{}>, v: AutocompleteKeyPair | null) => {
                        if(v && v.value) {
                            const cus = find(customers, { id: v.value });
                            if (cus) setCustomer(cus);
                        }
                        else setCustomer(null);
                    }}
                />
                {customer && 
                    <Box display="flex" flexDirection="column">
                        <Grid container={true}>
                            <DistributorDialogGrid item={true} xs={4} style={{ fontWeight: 'bold' }}>
                                Name:
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={8} style={{ color: '#A2A2A2' }}>
                                {customer.name}
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={4} style={{ fontWeight: 'bold' }}>
                                ID:
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={8} style={{ color: '#A2A2A2' }}>
                                {customer.displayId}
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={4} style={{ fontWeight: 'bold' }}>
                                Channel:
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={8} style={{ color: '#A2A2A2' }}>
                                {customer.channel}
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={4} style={{ fontWeight: 'bold' }}>
                                Email:
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={8} style={{ color: '#A2A2A2' }}>
                                {customer.email}
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={4} style={{ fontWeight: 'bold' }}>
                                Number:
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={8} style={{ color: '#A2A2A2' }}>
                                {customer.contactNumber}
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={4} style={{ fontWeight: 'bold' }}>
                                Salesperson:
                            </DistributorDialogGrid>
                            <DistributorDialogGrid item={true} xs={8} style={{ color: '#A2A2A2' }}>
                                {sr ? `${sr.firstName} ${sr.lastName}` : ''}
                            </DistributorDialogGrid>
                        </Grid>
                    </Box>
                }
            </DistributorDialogContent>
            <DistributorDialogActions>
                <DistributorDialogActionButton
                    onClick={onClose}
                    variant="outlined"
                >
                    Cancel
                </DistributorDialogActionButton>
                <DistributorDialogActionButton
                    onClick={() => {
                        if (customer) {
                            onTagClick(customer.id);
                        }
                        else {
                            toastWarning('Select a customer to assign');
                        }
                    }}
                >
                    Assign
                </DistributorDialogActionButton>
            </DistributorDialogActions>
        </DistributorDialog>
    )
}

export default DistributorCustomerDialog;