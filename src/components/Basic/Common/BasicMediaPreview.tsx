import React from 'react';
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { BasicNewsMedia } from '../../../store/news/types';
import { BasicProductMedia } from '../../../store/basicproduct/types';
import { BasicPromotionMedia } from '../../../store/promotion/types';

interface BasicMediaPreviewProps {
    visible: boolean;
    media?: BasicNewsMedia | BasicProductMedia | BasicPromotionMedia;
    handleClose: () => void;
}

export default ({ visible, media, handleClose}: BasicMediaPreviewProps) => {
    const ImagePreview = () => (
        <img
            src={media!.path}
            style={{ width: '100%', height: 'auto' }}
            alt=""
        />
    )

    const VideoPreview = () => (
        <video
            src={media!.path}
            style={{ width: '100%', height: 'auto' }}
            controls={true}
        />
    )

    const PdfPreview = () => (
        <iframe
            title="document-preview"
            style={{ width: '100%', minHeight: 600 }}
            src={`https://docs.google.com/gview?url=${media!.path}&embedded=true&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`}
        />
    )

    const renderMedia = (): JSX.Element => {
        if (media) {
            const { type } = media;
            const mediaType = type.toLowerCase();
            if (mediaType.indexOf('image') > -1) {
                return <ImagePreview />
            }
            else if (mediaType.indexOf('video') > -1) {
                return <VideoPreview />
            }
            else if (mediaType.indexOf('pdf') > -1) {
                return <PdfPreview />
            }
        }
        return <></>;
    }

    return (
        <Dialog
            open={visible}
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle>{media ? media.name : ''}</DialogTitle>
            <DialogContent>
                {renderMedia()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}