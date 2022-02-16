import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { withStyles } from '@material-ui/styles';

interface CKEditorOutlinedInputProps {
    idKey?: string;
    value: string;
    onChange: (evt: any | unknown) => void;
    forceBlackBorder?: boolean;
}

const EditorMaterialInput = withStyles(
    () => ({
        root: {
            '& .ck': {
                width: '100%',
                outline: 'none',
                border: 'none!important',
                boxShadow: 'none!important',
                minHeight: 150,
                maxHeight: 150,
                '& div': {
                    border: 'none'
                }
            },
            '& fieldset.MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root:hover.MuiOutlinedInput-notchedOutline': {
                border: '1px solid #E5E5E5!important',
                borderRadius: 5,
            }
        }
    })
)(OutlinedInput);

export default (props: CKEditorOutlinedInputProps) => {
    let inputRef = React.createRef<any>();
    const [focused, setFocused] = React.useState(false);
    // eslint-disable-next-line
    React.useEffect(() => {
        if (focused) {
            inputRef.current.querySelector("div").focus();
            document.execCommand('selectAll', false, undefined);
            const selection = document.getSelection();
            if (selection) {
                selection.collapseToEnd();
            }
        }
        // eslint-disable-next-line
    }, [focused])
    const toggleFocus = () => {
        setFocused(true);
    }
    return (
        <EditorMaterialInput
            ref={inputRef}
            className="round-border2"
            fullWidth
            margin="dense"
            required
            placeholder="Type description"
            value={props.value}
            onChange={props.onChange}
            onFocus={toggleFocus}
            multiline
            rows={16}
            inputComponent={() => {
                if (focused) {
                    return <CKEditor
                        // @ts-ignore
                        name="ckeditor"
                        editor={InlineEditor}
                        data={props.value}
                        onBlur={(evt, editor) => { props.onChange(editor.getData()); setFocused(false) }}
                        config={{
                            toolbar: ['bold', 'italic', '|', 'numberedList', 'bulletedList', 'heading', 'undo', 'redo'],
                        }}
                    />
                }
                return <div 
                    dangerouslySetInnerHTML={{ __html: props.value}} 
                    className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-view"
                    style={{ height: 150, overflowY: 'auto', width: '100%', padding: '0px 9px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }} 
                    contentEditable
                    onFocus={toggleFocus} />
            }}
        />
    )
}