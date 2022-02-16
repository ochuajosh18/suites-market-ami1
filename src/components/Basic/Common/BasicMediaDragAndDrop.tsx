import React from 'react';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { DndProvider, } from 'react-dnd';
import { useDropzone } from 'react-dropzone';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import update from 'immutability-helper';
// import isEmpty from 'lodash/isEmpty';
// import map from 'lodash/map';

export default () => {
    const [cards, setCards] = React.useState(
        // map(selectedSKUData.media, (img, i) => {
        //     return {
        //         id: parseInt(i),
        //         text: img,
        //     };
        // }),
    );
    const {
        getRootProps,
        getInputProps,
        open: openDropzone,
        isDragActive,
    } = useDropzone({
        accept: 'image/jpeg, image/png, image/gif, .pdf, .mp4, .m4v',
        noClick: true,
        noKeyboard: true,
        onDrop: (acceptedFiles) => {
            let totalLength = acceptedFiles.length;

            // if (!isEmpty(selectedSKUData.media)) {
            //     totalLength += selectedSKUData.media.length;
            // }

            // if (totalLength > 7) {
            //     alert('Select up to 7 files only.');
            //     return;
            // }

            // const uploadCallback = (returnData: any) => {
            //     setCards(
            //         map(
            //             [...selectedSKUData.media, ...returnData.media],
            //             (img, i) => {
            //                 return {
            //                     id: i,
            //                     text: img,
            //                 };
            //             },
            //         ),
            //     );
            // };
            // props.UploadImage(acceptedFiles, uploadCallback);
        },
    });

    const moveCard = React.useCallback(
        (dragIndex: number, hoverIndex: number) => {
            // const dragCard = cards[dragIndex];

            // let temp = update(cards, {
            //     $splice: [
            //         [dragIndex, 1],
            //         [hoverIndex, 0, dragCard],
            //     ],
            // });

            // setCards(temp);

            // props.ReorderImage(_.map(temp, (c) => c.text));
        },
        // eslint-disable-next-line
        [cards]
    );

    const renderCard = (card: { id: number; text: string }, index: number) => {
        return (
            <GridListTile cols={1}>
                {/* <CustomCard
                    key={card.id}
                    index={index}
                    id={card.id}
                    text={card.text}
                    moveCard={moveCard}
                    imageClick={_onClick_Image}
                    imageDelete={_onClick_ImageDelete}
                /> */}
            </GridListTile>
        );
    };

    return (
        // @ts-ignore
        // eslint-disable-next-line
        <DndProvider backend={HTML5Backend} context={window}>
        <GridList cols={5}>
            {/* {cards.map((card, i) =>
                renderCard(card, i),
            )} */}
            <GridListTile cols={1}>
                {/* <Paper elevation={1} className={classes.paper}>
                    <div className={classes.addImage}>
                        <IconButton onClick={openDropzone}>
                            <AddCircleOutlineIcon fontSize="large" />
                        </IconButton>
                    </div>
                </Paper> */}
            </GridListTile>
        </GridList>
        </DndProvider>
    )
}