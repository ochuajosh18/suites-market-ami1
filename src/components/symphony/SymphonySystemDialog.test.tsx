import React from 'react';
import { shallow } from 'enzyme';
import SymphonySystemDialog from './SymphonySystemDialog';

it('Renders the system dialog', () => {
    const wrapper = shallow(
        <SymphonySystemDialog 
            visible={false}
            onCloseAction={() => {}}
            simpleDialog={true}
            maxWidth="lg"
            content={<div id="test-system-dialog-content">test</div>}
        />
    );

    expect(wrapper.find('#test-system-dialog-content')).toHaveLength(1);
});