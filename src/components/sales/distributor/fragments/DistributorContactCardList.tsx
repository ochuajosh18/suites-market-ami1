import React from 'react';
import { CustomerContact } from '../../../../store/customer/types';
import { Distributor } from '../../../../store/distributor/types';
import { GenericMedia } from '../../../../store/system/types';
// local
import {
    CustomerContactContainer,
    CustomerContactCardContainer,
    CustomerContactCard,
    CustomerContactImageContainer,
    CustomerContactAddContainer,
    CustomerContactDescriptionContainer,
    CustomerContactAuxContainer,
    CustomerContactAuxIconButton,
    CustomerContactCardAvatar
} from '../../customer/fragments/CustomerComponents';
import CardAux from '../../common/CardAux';

// symphony
import {
    
} from '../../../symphony/SymphonyCommonComponents';

// global
import {
    DecoratedPopoverButton
} from '../../common/SalesCommonComponents';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import StarIcon from '@material-ui/icons/Star';
import PersonIcon from '@material-ui/icons/Person';

import map from 'lodash/map';

interface DistributorContactCardListProps {
    contacts: Array<CustomerContact>;
    activeDistributor: Distributor;
    onContactClick: (id: string) => void;
    onAddContactClick: () => void;
    onDeleteContactClick: (id: string) => void;
}

const VariantCards = ({ contacts, onContactClick, onAddContactClick, onDeleteContactClick }: DistributorContactCardListProps) => {
    const onCardClick = React.useCallback(onContactClick, []);

    return (
        <CustomerContactContainer>
            <CustomerContactCardContainer>
                {map(contacts, (contact) => {
                    const { id, avatar } = contact;
                    const logo = avatar ? (avatar as GenericMedia).path : '';
                    return (
                        <CustomerContactCard id={`distributor-contact-${id}`} key={id}>
                            <CustomerContactImageContainer onClick={() => onCardClick(id as string)}>
                                {logo ?
                                    <CustomerContactCardAvatar
                                        src={logo}
                                    />
                                :
                                    <CustomerContactCardAvatar>
                                        <PersonIcon />
                                    </CustomerContactCardAvatar>
                                }
                            </CustomerContactImageContainer>
                            <CustomerContactDescriptionContainer
                                onClick={() => onCardClick(id as string)}
                            >
                                <Box fontSize="16px" marginBottom="4px">{contact.name}</Box>
                                <Box fontSize="12px" marginBottom="2px" color="#969696">{contact.email || ''}</Box>
                                <Box fontSize="12px" marginBottom="2px" color="#969696">{contact.phoneNumber || ''}</Box>
                            </CustomerContactDescriptionContainer>
                            <CustomerContactAuxContainer>
                                <Box display="inline-flex">
                                    <CustomerContactAuxIconButton>
                                        {contact.isPrimary ?
                                            <StarIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                                        :
                                            <></>
                                        }
                                    </CustomerContactAuxIconButton>
                                    <CardAux>
                                        <DecoratedPopoverButton
                                            id={`distributor-contact-delete-${id}`}
                                            style={{ color: '#FF4D4D' }}
                                            endIcon={<Icon className="fa fa-trash-alt" />}
                                            onClick={() => onDeleteContactClick(id as string)}
                                        >
                                            Delete
                                        </DecoratedPopoverButton>
                                    </CardAux>
                                </Box>
                            </CustomerContactAuxContainer>
                        </CustomerContactCard>
                    )
                })}
                <CustomerContactCard 
                    id="product-variant-add-btn" 
                    className="add-variant-card"
                    onClick={onAddContactClick}
                >
                    <CustomerContactAddContainer>
                        <AddCircleIcon htmlColor={SYMPHONY_PRIMARY_COLOR} />
                        New Contact
                    </CustomerContactAddContainer>
                </CustomerContactCard>
            </CustomerContactCardContainer>
        </CustomerContactContainer>
    )
}

export default VariantCards;