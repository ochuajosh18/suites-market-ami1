// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

(global as any).document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
});

(global as any).document.execCommand = () => jest.fn();
(global as any).document.getSelection = () => {
    return undefined;
}

(global as any).google = {
    maps: {
        LatLngBounds: () => ({
            extend: () => { },
        }),
        MapTypeId: {
            ROADMAP: 'rdmap',
            SATELLITE: 'stllte'
        },
        ControlPosition: {
            BOTTOM_CENTER: 'BC',
            BOTTOM_LEFT: 'BL',
            BOTTOM_RIGHT: 'BR',
            LEFT_BOTTOM: 'LB',
            LEFT_CENTER: 'LC',
            LEFT_TOP: 'LT',
            RIGHT_BOTTOM: 'RB',
            RIGHT_CENTER: 'RC',
            RIGHT_TOP: 'RT',
            TOP_CENTER: 'TC',
            TOP_LEFT: 'TL',
            TOP_RIGHT: 'TR',            
        },
        Size: function (w, h) {},
        Data: class {
            setStyle() {}
            addListener() {}
            setMap() {}
        }
    }
};