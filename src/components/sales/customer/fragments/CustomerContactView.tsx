import React from 'react';
import { CustomerContact, DynamicBasicCustomerInput } from '../../../../store/customer/types';
import { Field } from '../../../../store/fields/types';

// global
import {
    SymphonyViewContentContainer,
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer,
    DecoratedPopoverButton,
    SymphonyBackButton,
    SymphonyViewInfoContainer,
    SymphonyAuxContainer,
    SymphonyNamedAuxButton
} from '../../../symphony/SymphonyCommonComponents';

import SymphonyModuleFieldRenderer from '../../../symphony/SymphonyModuleFieldRenderer';
import SalesAuxMenu from '../../common/SalesAuxMenu';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarBorder';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

import map from 'lodash/map';

interface CustomerContactViewProps {
    contact: CustomerContact;
    newCustomer: boolean;
    numberOfContacts?: number;
    fields: Array<Field>;
    sections: Array<string>;
    onDeleteContactClick: (id: string) => void;
    onContactInput: (field: string, value: DynamicBasicCustomerInput) => void;
    onBackClick: () => void;
}

const CustomerContactView = (props: CustomerContactViewProps) => {
    
    const { contact, newCustomer, numberOfContacts, sections, fields, onDeleteContactClick, onContactInput, onBackClick } = props; // props destructure
    const refs = [...sections.map(() => React.createRef<HTMLElement>()), React.createRef<HTMLElement>()];
    const [tab, setTab] = React.useState<string>(sections[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (sections.length > 1 && target) {
            setTab(target as string);
        }
    });
    const { id, isPrimary } = contact; // contact destructure
    const onDeleteClick = React.useCallback(onDeleteContactClick, []);
    const newContact = id.length === 0;
    
    return (
        <SymphonyViewContentContainer>
            <SymphonyViewTabsContainer>
                <SymphonyViewTabs
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    {map(sections, (s) => {
                        return (
                            <SymphonyViewTab
                                key={s}
                                label={s}
                                value={s}
                                onClick={onTabClick}
                                id={`${s}-tab`}
                            />
                        )
                    })}
                </SymphonyViewTabs>
            </SymphonyViewTabsContainer>
            <SymphonyViewInfoContainer onScroll={onScroll}>
                {map(sections, (s, i) => {
                    return (
                        <Box key={`${s}-section`}>
                            <SymphonySectionHeaderContainer key={s} style={{ justifyContent: 'space-between' }} innerRef={refs[i]}>
                                <SymphonySectionHeaderTitleContainer>
                                    <Box display="flex" alignItems="center">
                                        {!newCustomer && i === 0 &&
                                            <SymphonyBackButton onClick={onBackClick}>
                                                <ArrowBackIcon />
                                            </SymphonyBackButton>
                                        }
                                        {s}
                                    </Box>
                                </SymphonySectionHeaderTitleContainer>
                                {i === 0 &&
                                
                                    <SymphonyAuxContainer>
                                        <SymphonyNamedAuxButton 
                                            onClick={() => onContactInput('isPrimary', !isPrimary)}
                                            style={{ marginRight: !newContact ? 32 : 0 }}
                                            startIcon={isPrimary || newCustomer || (numberOfContacts && numberOfContacts === 0) ? <StarIcon htmlColor={SYMPHONY_PRIMARY_COLOR} /> : <StarOutlineIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />}
                                        >
                                            Primary Contact
                                        </SymphonyNamedAuxButton>
                                        {!newContact &&
                                            <SalesAuxMenu>
                                                <DecoratedPopoverButton
                                                    id={`customer-contact-delete-${id}`}
                                                    style={{ color: '#FF4D4D' }}
                                                    endIcon={<Icon className="fa fa-trash-alt" />}
                                                    onClick={() => onDeleteClick(id as string)}
                                                >
                                                    Delete
                                                </DecoratedPopoverButton>
                                            </SalesAuxMenu>
                                        }
                                    </SymphonyAuxContainer>
                                }
                            </SymphonySectionHeaderContainer>
                            <SymphonyModuleFieldRenderer
                                fields={fields}
                                section={s}
                                entity={contact}
                                onEntityInput={onContactInput}
                            />
                        </Box>
                    )
                })}
                
            </SymphonyViewInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default CustomerContactView;