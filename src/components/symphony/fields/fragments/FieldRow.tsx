import React from 'react';
import { Field, FieldDialogType } from '../../../../store/fields/types';

import {
    FieldDraggableContainer,
    FieldBadge,
    FieldDetailsContainer,
    FieldEditButton,
    DraggableFieldDeleteContainer,
    DraggableFieldDeleteIconContainer
} from './FieldsComponents';

// material
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';

import find from 'lodash/find';
import FIELD_TYPES from '../fields.json';

interface FieldRowProps {
    field: Field;
    index: string | number;
    title: string;
    type: string;
    editable: boolean;
    badgeless?: boolean;
    onFieldEditClick: (field: Field, type: FieldDialogType) => void;
    onFieldDeleteClick: (field: Field) => void;
}

const FieldRow = (props: FieldRowProps) => {
    const { field, index, title, type, editable, badgeless, onFieldEditClick, onFieldDeleteClick } = props;
    const fType = find(FIELD_TYPES, { value: type }); 
    const id = field.title.replace(/ +/g, '_').toLowerCase();
    return (
        <FieldDraggableContainer className="draggable-field" id={id} key={title}>
            {editable &&
                <DraggableFieldDeleteContainer className="field-aux" onClick={() => onFieldDeleteClick(field)}>
                    <DraggableFieldDeleteIconContainer>
                        <Icon className="fa fa-trash-alt" style={{ fontSize: 16, color: '#FF4D4D' }} />
                    </DraggableFieldDeleteIconContainer>
                </DraggableFieldDeleteContainer>
            }
            {!badgeless && <FieldBadge>{index}</FieldBadge>}
            <FieldDetailsContainer style={{ marginLeft: !badgeless ? 12 : 0 }}>
                <IconButton style={{ padding: 0, marginLeft: 5, marginRight: 5  }}>
                    <DragIndicatorIcon htmlColor="#C6C6C6"  />
                </IconButton>
                <Grid container={true}>
                    <Grid item={true} xs={6}>
                        {title}
                    </Grid>
                    <Grid item={true} xs={5} style={{ fontSize: 10, color: '#C6C6C6' }}>
                        {fType ? fType.label : type}
                    </Grid>
                    <Grid item={true} xs={1}>
                        {editable && 
                            <FieldEditButton id={`${id}-edit-btn`} onClick={() => onFieldEditClick(field, 'UPDATE')}>
                                Edit
                            </FieldEditButton>
                        }
                    </Grid>
                </Grid>
            </FieldDetailsContainer>
        </FieldDraggableContainer>
    )
}

export default FieldRow;