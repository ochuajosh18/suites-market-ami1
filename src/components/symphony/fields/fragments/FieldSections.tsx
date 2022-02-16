import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Field, FieldDialogType, FieldSection as Section } from '../../../../store/fields/types';

// local
import { 
    FieldSectionsContainer,
    FieldInstructionContainer,
    
} from './FieldsComponents';
import FieldSection from './FieldSection';

import map from 'lodash/map';
import find from 'lodash/find';

interface FieldSectionsProps {
    sections: Array<Section>;
    onSectionNameEdit: (old: string, newVal: string) => void;
    onFieldEditClick: (field: Field, type: FieldDialogType) => void;
    onFieldDeleteClick: (field: Field) => void;
    onDeleteSectionClick: (sectionName: string) => void;
    onOpenClick: (sectionName: string) => void;
    openSections: Array<string>;
}

const FieldSections = (props: FieldSectionsProps) => {
    const { sections, openSections, onSectionNameEdit, onFieldEditClick, onFieldDeleteClick, onDeleteSectionClick , onOpenClick} = props;
    return (
        <FieldSectionsContainer id="field-section-container">
            <FieldInstructionContainer>
                Drag or reposition the elements here to make changes.
            </FieldInstructionContainer>
            <Droppable 
                droppableId="sections-droppable"
                isDropDisabled={openSections.length > 0}
                renderClone={(provided) => {
                    const section = find(sections, (s) => s.name.toLowerCase() === provided.draggableProps['data-rbd-draggable-id'].split('-')[0].replace(/_+/g, ' ').toLowerCase() );
                    return (<div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        {section &&
                             <FieldSection 
                                key={section.name.replace(/ +/g, '_').toLowerCase()}
                                sectionName={section.name}
                                fields={section.fields}
                                onSectionNameEdit={onSectionNameEdit}
                                onFieldEditClick={onFieldEditClick}
                                onFieldDeleteClick={onFieldDeleteClick}
                                onDeleteSectionClick={onDeleteSectionClick}
                                onOpenClick={onOpenClick}
                                open={false}
                            />
                        }
                    </div>
                    )
                }}
            >
                {(provided, snapshot) => {
                    return (
                    <div ref={provided.innerRef}>
                        {map(sections, (s, i) => (
                            <Draggable
                                key={`${s.name.replace(/ +/g, '_').toLowerCase()}-draggable`}
                                draggableId={`${s.name.replace(/ +/g, '_').toLowerCase()}-draggable`}
                                index={i}
                                isDragDisabled={openSections.length > 0}
                            >
                                {(provided) => {
                                    return (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <FieldSection 
                                                key={s.name.replace(/ +/g, '_').toLowerCase()}
                                                sectionName={s.name}
                                                fields={s.fields}
                                                onSectionNameEdit={onSectionNameEdit}
                                                onFieldEditClick={onFieldEditClick}
                                                onFieldDeleteClick={onFieldDeleteClick}
                                                onDeleteSectionClick={onDeleteSectionClick}
                                                onOpenClick={onOpenClick}
                                                open={openSections.includes(s.name)}
                                            />
                                        </div>
                                    )
                                }}
                            </Draggable>   
                        ))}
                        {provided.placeholder}
                    </div>
                )}}
            </Droppable>
           
        </FieldSectionsContainer>
    )
}

export default FieldSections;