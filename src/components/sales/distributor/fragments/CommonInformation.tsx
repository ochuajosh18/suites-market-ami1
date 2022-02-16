import React from 'react';
import { Distributor, DynamicDistributorType } from '../../../../store/distributor/types';
import { GenericMedia } from '../../../../store/system/types';
import { Salesperson } from '../../../../store/salesperson/types';
import { Field } from '../../../../store/fields/types';

// symphony components
import {
    SymphonyViewTabs,
    SymphonyViewTab,
    SymphonyViewTabsContainer,
    SymphonyViewContentContainer,
    SymphonyViewCommonInfoContainer,
    DecoratedPopoverButton,
    SymphonySectionHeaderContainer,
    SymphonySectionHeaderTitleContainer,
    SymphonySectionHeaderSubTitleContainer
} from '../../../symphony/SymphonyCommonComponents'

import SalesAuxMenu from '../../common/SalesAuxMenu';
import SymphonyModuleFieldRenderer from '../../../symphony/SymphonyModuleFieldRenderer';
import { SYMPHONY_PRIMARY_COLOR } from '../../../symphony/Colors';

// material
import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';

// hooks
import useScrollableTabs from '../../../symphony/hooks/useScrollableTabs';

// util
import moment from 'moment';
import map from 'lodash/map';

interface CommonInformationProps {
    distributor: Distributor;
    salespersons: Array<Salesperson>;
    fields: Array<Field>;
    sections: Array<string>;
    onCommonInformationInput: (field: string, value: string | number | boolean | [number, number] | GenericMedia | Array<GenericMedia> | DynamicDistributorType | undefined) => void;
    onDeleteClick: (id: string) => void;
}

const CommonInformation = (props: CommonInformationProps) => {
    const { distributor, salespersons, onCommonInformationInput, onDeleteClick, sections, fields} = props;
    const refs = sections.map(() => React.createRef<HTMLElement>());
    const [tab, setTab] = React.useState(sections[0]);
    const [onTabClick, onScroll] = useScrollableTabs(refs, (target: string) => {
        if (target) {
            setTab(target as string);
        }
    });

    return (
        <SymphonyViewContentContainer>
            <SymphonyViewTabsContainer>
                <SymphonyViewTabs
                    id="distributor-common-information-tabs"
                    orientation="vertical"
                    value={tab}
                    TabIndicatorProps={{ style: { width: 4, backgroundColor: SYMPHONY_PRIMARY_COLOR }}}
                >
                    {map(sections, (s, i) => {
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
            <SymphonyViewCommonInfoContainer onScroll={onScroll}>
            {map(sections, (s, i) => {
                return (
                    <Box key={`${s}-section`}>
                        <SymphonySectionHeaderContainer key={s} style={{ justifyContent: 'space-between' }} innerRef={refs[i]}>
                            <SymphonySectionHeaderTitleContainer>     
                                {s}
                                {i === 0 && distributor.id && 
                                    <SymphonySectionHeaderSubTitleContainer>
                                        Last edited on {moment(distributor.dateUpdated as string).format('DD.MM.YYYY [at] hh:mmA')}
                                    </SymphonySectionHeaderSubTitleContainer>
                                } 
                            </SymphonySectionHeaderTitleContainer>
                            {i === 0 && distributor.id &&
                                <SalesAuxMenu>
                                    <DecoratedPopoverButton
                                        id="distributor-delete-btn"
                                        style={{ color: '#FF4D4D' }}
                                        endIcon={<Icon className="fa fa-trash-alt" />}
                                        onClick={() => onDeleteClick(distributor.id)}
                                    >
                                        Delete
                                    </DecoratedPopoverButton>
                                </SalesAuxMenu>
                            }
                        </SymphonySectionHeaderContainer>
                        <SymphonyModuleFieldRenderer
                            fields={fields}
                            section={s}
                            entity={distributor}
                            onEntityInput={onCommonInformationInput}
                            customEntityList={salespersons}
                            customEntityType="SALESPERSONS"
                        />
                    </Box>
                )
            })}
            </SymphonyViewCommonInfoContainer>
        </SymphonyViewContentContainer>
    )
}

export default CommonInformation;