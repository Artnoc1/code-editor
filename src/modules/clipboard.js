/**
 * 
 * @param {string} action 
 */
function clipboardAction(action) {
    const clipboard = cordova.plugins.clipboard;
    const editor = editorManager.editor;
    const selectedText = editor.getCopyText();
    switch (action) {
        case 'copy':
            if (selectedText) {
                clipboard.copy(selectedText);
                acodeEditor.updateControls();
                plugins.toast.showShortBottom('copied to clipboard');
            }
            break;
        case 'cut':
            if (selectedText) {
                clipboard.copy(selectedText);
                const ranges = editor.selection.getAllRanges();
                ranges.map(range => {
                    editor.remove(range);
                });
                acodeEditor.updateControls();
                plugins.toast.showShortBottom('copied to clipboard');
            }
            break;

        case 'paste':
            clipboard.paste(text => {
                editor.execCommand('paste', text);
                acodeEditor.updateControls();
            });
            break;

        case 'select all':
            editor.selectAll();
            setTimeout(() => {
                acodeEditor.controls.start.remove();
                acodeEditor.controls.end.remove();
            }, 0);
            break;
    }
    editor.focus();
}

export default clipboardAction;