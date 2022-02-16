import React from 'react';
import { Field, FieldDialogType } from '../../../../store/fields/types';
import { Droppable, Draggable } from 'react-beautiful-dnd';

// global
import {
    DecoratedPopoverButton
} from '../../SymphonyCommonComponents'

import { 
    FieldSectionContainer,
    FieldSectionNameContainer,
    FieldSectionsBlock,
    FieldSectionsBlockAuxContainer,
    FieldsDraggablePlaceholderContainer
} from './FieldsComponents';
import FieldAuxMenu from './FieldSectionAux';
import FieldRow from './FieldRow';

// material
import Collapse from '@material-ui/core/Collapse'; 
import Icon from '@material-ui/core/Icon'; 
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'; 
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

// util
import map from 'lodash/map';
import find from 'lodash/find';

interface FieldSectionProps {
    sectionName: string;
    fields: Array<Field>;
    onSectionNameEdit: (old: string, newVal: string) => void;
    onFieldEditClick: (field: Field, type: FieldDialogType) => void;
    onFieldDeleteClick: (field: Field) => void;
    onDeleteSectionClick: (sectionName: string) => void;
    onOpenClick: (sectionName: string) => void;
    open: boolean;
}

const FieldSection = (props: FieldSectionProps) => {
    const [sectionNameEditing, setSectionNameEditing] = React.useState(false);
    const [sectionNameEditValue, setSectionNameEditValue] = React.useState('');
    const { sectionName, fields, open, onSectionNameEdit, onFieldEditClick, onFieldDeleteClick, onDeleteSectionClick, onOpenClick } = props;

    const onSectionEditDone = (e: React.FocusEvent<HTMLInputElement>) => {
        onSectionNameEdit(sectionName, e.currentTarget.value);
        setSectionNameEditing(false);
    }

    const onSectionEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSectionNameEditValue(e.target.value);
    }

    return (
        <FieldSectionsBlock id={`field-section-${sectionName.replace(/ +/g, '_').toLowerCase()}`}>
            <FieldSectionContainer onClick={() => onOpenClick(sectionName)}>
                <FieldSectionNameContainer 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSectionNameEditValue(sectionName);
                        setSectionNameEditing(true);
                        setTimeout(() => {
                            document.getElementById(`${sectionName}-edit`)?.focus();
                        }, 100)
                    }}
                >
                    {sectionNameEditing ? 
                        <input 
                            value={sectionNameEditValue} 
                            onChange={onSectionEdit} 
                            onBlur={onSectionEditDone}
                            id={`${sectionName}-edit`}
                            style={{ 
                                paddingLeft: '0px !important',
                                textAlign: 'left',
                                fontWeight: 'bold',
                                width: '100%', 
                                fontSize: 20, 
                                border: 'none', 
                                background: 'none', 
                                backgroundColor: 'transparent',
                            }} 
                        />
                    : sectionName}
                </FieldSectionNameContainer>
                {!open ? <KeyboardArrowDownIcon htmlColor="#5E6A7E" /> : <KeyboardArrowUpIcon htmlColor="#5E6A7E" />}
            </FieldSectionContainer>
            <Collapse in={open}>
            {open &&
                <Droppable
                isDropDisabled={!open}
                droppableId={`${sectionName.replace(/ +/g, '_').toLowerCase()}-droppable_section`} 
                renderClone={(provided) => {
                    const field = find(fields, { name: provided.draggableProps['data-rbd-draggable-id'].split('-')[0] });
                    return (<div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {field &&
                            <FieldRow
                                key={field.title}
                                field={field}
                                index={0}
                                title={field.title}
                                type={field.type}
                                editable={!field.isDefault}
                                badgeless={true}
                                onFieldEditClick={onFieldEditClick}
                                onFieldDeleteClick={onFieldDeleteClick}
                            />
                        }
                    </div>
                    )
                }}
            >
                {(provided, snapshot) => (
                    <div 
                        ref={provided.innerRef} 
                        style={{ 
                            height: fields.length > 0 ? fields.length * 50 + (snapshot.isDraggingOver && !snapshot.draggingFromThisWith ? 50 : 0) : 50 
                        }}
                    >
                        {map(fields, (f, i) => (
                            <Draggable 
                                key={`${f.name}-draggable`}
                                draggableId={`${f.name}-draggable`}
                                index={i}
                                isDragDisabled={!open}
                            >   
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <FieldRow
                                            key={f.title}
                                            field={f}
                                            index={i+1}
                                            title={f.title}
                                            type={f.type}
                                            editable={!f.isDefault}
                                            onFieldEditClick={onFieldEditClick}
                                            onFieldDeleteClick={onFieldDeleteClick}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {fields.length === 0 &&
                            <FieldsDraggablePlaceholderContainer>
                                Drop here to place field
                            </FieldsDraggablePlaceholderContainer>
                        }
                        {provided.placeholder}
                    </div>
                )}
                </Droppable>
            }
            
            </Collapse>
            <FieldSectionsBlockAuxContainer>
                <FieldAuxMenu>
                    <DecoratedPopoverButton
                        id="field-section-delete-btn"
                        style={{ color: '#FF4D4D' }}
                        endIcon={<Icon className="fa fa-trash-alt" />}
                        onClick={() => onDeleteSectionClick(sectionName)}
                    >
                        Delete
                    </DecoratedPopoverButton>
                </FieldAuxMenu>
            </FieldSectionsBlockAuxContainer>
        </FieldSectionsBlock>
    )
}

export default FieldSection;