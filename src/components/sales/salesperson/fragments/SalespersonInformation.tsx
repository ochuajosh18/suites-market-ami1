import React from 'react';
import { GenericMedia } from '../../../../store/system/types';
import { ContactNumber, Salesperson, DynamicSalesSalespersonInput } from '../../../../store/salesperson/types';
import { Field } from '../../../../store/fields/types';

// symphony components
import {
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonyViewContentContainer,
    SymphonyViewCommonInfoContainer,
    SymphonyViewInputContainer,
    DecoratedPopoverButton,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer,
    SymphonySectionHeaderSubTitleContainer
} from '../../../symphony/SymphonyCommonComponents'
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

import SymphonyInput from '../../../symphony/SymphonyInput';
import SalespersonContactInput from './SalespersonContactInput';
import SalesAuxMenu from '../../common/SalesAuxMenu';
import SymphonyMediaInput from '../../../symphony/SymphonyMediaInput';
import SymphonyModuleFieldRenderer from '../../../symphony/SymphonyModuleFieldRenderer';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

// util
import moment from 'moment';
import map from 'lodash/map';
// import find from 'lodash/find';

interface SalespersonInformationProps {
    salesperson: Salesperson;
    fields: Array<Field>;
    sections: Array<string>;
    onSalespersonInformationInput: (field: string, value: string | number | boolean | [number, number] | GenericMedia | ContactNumber | DynamicSalesSalespersonInput | Array<GenericMedia> | undefined) => void;
    onDeleteClick: (id: string) => void;
}

const SalespersonInformation = (props: SalespersonInformationProps) => {
    const { salesperson, fields, sections, onSalespersonInformationInput, onDeleteClick } = props;
    const refs = sections.map(() => React.createRef<HTMLElement>());
    // const cRef = React.useRef<HTMLElement>(null);
    const [tab, setTab] = React.useState(sections[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (target && sections.includes(target)) {
            setTab(target);
        }
    });

    return (
        <SymphonyViewContentContainer height="calc(100vh - 130px)!important">
            <SymphonyViewTabsContainer width="172px!important">
                <SymphonyViewTabs
                    id="salesperson-common-information-tabs"
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
            <SymphonyViewCommonInfoContainer onScroll={onScroll} height="calc(100vh - 176px)!important">
            {map(sections, (s, i) => {
                return (
                    <Box key={`${s}-section`}>
                        <SymphonySectionHeaderContainer key={s} style={{ justifyContent: 'space-between' }} innerRef={refs[i]}>
                            <SymphonySectionHeaderTitleContainer>     
                                {s}
                                {i === 0 && salesperson.id && 
                                    <SymphonySectionHeaderSubTitleContainer>
                                        Last edited on {moment(salesperson.dateUpdated as string).format('DD.MM.YYYY [at] hh:mmA')}
                                    </SymphonySectionHeaderSubTitleContainer>
                                } 
                            </SymphonySectionHeaderTitleContainer>
                            {i === 0 && salesperson.id &&
                                <SalesAuxMenu>
                                    <DecoratedPopoverButton
                                        id="salesperson-delete-btn"
                                        style={{ color: '#FF4D4D' }}
                                        endIcon={<Icon className="fa fa-trash-alt" />}
                                        onClick={() => onDeleteClick(salesperson.id)}
                                    >
                                        Delete
                                    </DecoratedPopoverButton>
                                </SalesAuxMenu>
                            }
                        </SymphonySectionHeaderContainer>
                        <SymphonyModuleFieldRenderer
                            fields={fields}
                            section={s}
                            entity={salesperson}
                            onEntityInput={onSalespersonInformationInput}
                        />
                        <SymphonyViewInputContainer>
                        <SymphonyMediaInput
                            mediaList={salesperson.avatar ? [salesperson.avatar] : []}
                            imageOnly={true}
                            imageOnlyHeader="Salesperson Photo"
                            imageOnlyAddText={salesperson.avatar ? 'Change Photo' : 'Add Photo'}
                            onMediaInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files) {
                                    onSalespersonInformationInput('avatar', { ...salesperson.avatar, file: e.target.files[0] } as GenericMedia);
                                }
                            }}
                        />
                        {/* <SymphonyInput
                            id="salesperson-firstname-input"
                            type="text"
                            label="First Name"
                            value={salesperson.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                onSalespersonInformationInput('firstName', e.target.value);
                            }}
                        />
                        <SymphonyInput
                            id="salesperson-lastname-input"
                            type="text"
                            label="Last Name"
                            value={salesperson.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                onSalespersonInformationInput('lastName', e.target.value);
                            }}
                        />
                        <SymphonyInput
                            id="salesperson-displayid-input"
                            type="text"
                            label="ID"
                            value={salesperson.displayId as string || ''}
                            disabled={true}
                        /> */}
                        <SalespersonContactInput
                            key={`salesperson-contact-inputs${salesperson.id}`}
                            contacts={salesperson.contactNumber}
                            onContactInput={(data) => {
                                onSalespersonInformationInput('contactNumber', data);
                            }}
                        />
                        {/* <SymphonyInput
                            id="salesperson-address-input"
                            type="text"
                            label="Address"
                            value={salesperson.address as string || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                onSalespersonInformationInput('address', e.target.value);
                            }}
                        />
                        <SymphonyInput
                            id="salesperson-email-input"
                            type="text"
                            label="Email"
                            value={salesperson.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                onSalespersonInformationInput('email', e.target.value);
                            }}
                        /> */}
                        {!salesperson.id &&
                            <>
                                <SymphonyInput
                                    id="salesperson-password-input"
                                    type="password"
                                    label="Password"
                                    value={salesperson.password || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        onSalespersonInformationInput('password', e.target.value);
                                    }}
                                />
                                <SymphonyInput
                                    id="salesperson-confirmpassword-input"
                                    type="password"
                                    label="Confirm Password"
                                    value={salesperson.confirmedPassword || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                        onSalespersonInformationInput('confirmedPassword', e.target.value);
                                    }}
                                />
                            </>
                        }
                        {/* <SymphonyInput
                            id="salesperson-status-input"
                            type="radio"
                            label="Status"
                            value={salesperson.isActive}
                            radioTrueText="Active"
                            radioFalseText="Inactive"
                            onRadioButtonChange={(val) => {
                                onSalespersonInformationInput('isActive', val);
                            }}
                        /> */}
                    </SymphonyViewInputContainer>
                    </Box>
                )
            })}
                {/* <SymphonySectionHeaderContainer style={{ justifyContent: 'space-between' }} innerRef={cRef}>
                    <SymphonySectionHeaderTitleContainer>
                        Salesperson Information
                        {salesperson.id &&
                            <SymphonySectionHeaderSubTitleContainer>
                                Last edited on {moment(salesperson.dateUpdated as string).format('DD.MM.YYYY [at] hh:mmA')}
                            </SymphonySectionHeaderSubTitleContainer>
                        }
                    </SymphonySectionHeaderTitleContainer>
                    {salesperson.id &&
                        <SalesAuxMenu>
                            <DecoratedPopoverButton
                                id="salesperson-delete-btn"
                                style={{ color: '#FF4D4D' }}
                                endIcon={<Icon className="fa fa-trash-alt" />}
                                onClick={() => onDeleteClick(salesperson.id)}
                            >
                                Delete
                            </DecoratedPopoverButton>
                        </SalesAuxMenu>
                    }
                </SymphonySectionHeaderContainer> */}
                {/* Inputs */}
                
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default SalespersonInformation;