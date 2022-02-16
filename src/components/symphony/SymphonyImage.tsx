import React from 'react';
// import your default here
import DefaultPic from '../../assets/images/logos/logo@2x.png';

interface SymphonyImageProps {
    src: string
    alt?: string;
    style?: React.CSSProperties;
}
const SymphonyImage = (props: SymphonyImageProps) => {
    const [withError, setWithError] = React.useState(false);
    return (
        <img 
            src={withError ? DefaultPic : props.src} 
            alt={props.alt || ''} 
            style={withError ? { width: 32, height: 36 } : props.style} 
            onError={() => setWithError(true)}
        />
    )
}
export default SymphonyImage;