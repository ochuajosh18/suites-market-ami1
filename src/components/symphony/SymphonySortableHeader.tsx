import React from 'react';
import { SymphonySortableHeaderContainer } from './SymphonyCommonComponents';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

interface SymphonySortableHeaderProps {
    headerTitle: string;
    headerValue: string;
    onSortClick?: (headerValue: string, order: string) => void;
    activeSort?: string;
    activeSortOrder?: string;
}

const SymphonySortableHeader = (props: SymphonySortableHeaderProps) => {
    const { headerTitle, headerValue, activeSort, activeSortOrder, onSortClick } = props;
    return (
        <SymphonySortableHeaderContainer 
            id={`${headerValue}-sortable`}
            onClick={() => {
                if (onSortClick) {
                    onSortClick(headerValue, !activeSortOrder ||  headerValue !== activeSort ? 'ASC' : activeSortOrder === 'ASC'? 'DESC' : '')  
                }
            }}
        >
            {headerTitle}
            {onSortClick &&
                <>
                    {activeSort ?
                        <>
                            {(activeSort === headerValue) &&
                                <>
                                    {activeSortOrder === 'ASC' ? 
                                        <KeyboardArrowDownIcon />
                                    :
                                        <KeyboardArrowUpIcon />
                                    }
                                </>
                            }
                        </>
                    :
                        <KeyboardArrowDownIcon />
                    }
                </>
            }
        </SymphonySortableHeaderContainer>
    )
}

export default SymphonySortableHeader;