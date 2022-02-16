import React, { RefObject } from 'react';

/**
 * @author: Jerome Cortez - OPSolutions
 * @description: 
 * 
 * Hook that allows a tab to control the scroll while creating a controlled scrollable container
 * 
 * To use, the structure of your tabs must be in a **sibling relationship with your container**
 * 
 * The structure of your targets must follow the **Container -> Title Container** relationship  
 * 
 * Such that inside your title container exists the value of your **tab**
 * 
 * @param targets Instances of your scrollable targets
 * @param onTargetVisible Action to take when target is visible
 * @returns An array containing the tab action[0] and on scroll behaviour[1]
 */
const useScrollableTabs = (
    targets: Array<RefObject<HTMLElement>>,
    onTargetVisible: (target: string) => void
) => {
    return [
        (e: React.MouseEvent<HTMLButtonElement>) => { // tab click manager
            e.stopPropagation();
            e.preventDefault();
            if (e.currentTarget) {
                const tabText = e.currentTarget.childNodes[0].childNodes[0].nodeValue || '';
                for (const i in targets) {
                    // scroll into view
                    const t = targets[i];
                    if (t && t.current) {
                        let targetText = '';
                        for (const n of t.current.childNodes[0].childNodes) { // search text nodes in your title container
                            if (n.nodeType === Node.TEXT_NODE) {
                                targetText = n.nodeValue as string;
                                break;
                            }
                        }

                        if (targetText === tabText) {       
                            // decides based on the height of the content where to sroll                     
                            const { nextElementSibling } = t.current;
                            let block: ScrollLogicalPosition = 'start'
                            let inline: ScrollLogicalPosition = 'end';
                            if (nextElementSibling) {
                                const { height  } = nextElementSibling.getBoundingClientRect();
                                if (height < 200) {
                                    inline = 'center';
                                    block = 'center';
                                }
                            }
                            
                            t.current.scrollIntoView({ behavior: 'smooth', block, inline });
                            break;
                        }
                    }
                }
            }
        },
        (e: React.UIEvent<HTMLElement>) => { // scrollable container controller
            e.stopPropagation(); // clean scroll
            const { scrollHeight, scrollTop, clientHeight } = e.currentTarget; // infer container type as generic
            const adjustedScrollValue = scrollTop + clientHeight; // calculate scrollY value plus the alpha (offset)
            const isAtEnd = scrollHeight === adjustedScrollValue;
            for (const i in targets) {
                const t = targets[i]; // section header
                if (t && t.current) {
                    // const { previousElementSibling } = t.current;
                    // const prevElementClientHeight = previousElementSibling ? previousElementSibling.clientHeight + 23  : 0 // 23 is the height of the section header
                    const { top } = t.current.getBoundingClientRect();
                    const currentElementScrollTop = top - e.currentTarget.getBoundingClientRect().top + 23;
                    
                    if (isAtEnd && targets[targets.length - 1].current) { // trigger last since this is at the end of the container
                        onTargetVisible(targets[targets.length - 1].current!.id);
                        return;
                    }
                    
                    if (adjustedScrollValue >= currentElementScrollTop) {
                        let targetText = '';
                        for (const n of t.current.childNodes[0].childNodes) { // search text nodes in your title container
                            if (n.nodeType === Node.TEXT_NODE && currentElementScrollTop > 0) { 
                                targetText = n.nodeValue as string;
                                onTargetVisible(targetText); // set target value
                                return;
                            }
                        }   
                    }
                    else {
                        // roll back
                        const prevTarget = targets[parseInt(i) - 1];
                        if (prevTarget && prevTarget.current) {
                            onTargetVisible(prevTarget.current.id); // set target value
                            return;
                        }
                    }
                    
                }
            }
        }
    ]
    
}

export default useScrollableTabs;