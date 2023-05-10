import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'

export default function useMonaco(language = 'javascript') {
  let monacoEditor = null
  let initReadOnly = false
  const updateVal = async (val) => {
    monacoEditor?.setValue(val)
    setTimeout(async () => {
      initReadOnly && monacoEditor?.updateOptions({ readOnly: false })
      await monacoEditor?.getAction('editor.action.formatDocument').run()
      initReadOnly && monacoEditor?.updateOptions({ readOnly: true })
    }, 0)
  }

  const createEditor = (el, editorOption = {}) => {
    if (monacoEditor) {
      return
    }
    initReadOnly = !!editorOption.readOnly
    monacoEditor = el && monaco.editor.create(el, {
      language,
      minimap: { enabled: false },
      multiCursorModifier: 'ctrlCmd',
      scrollbar: {
        verticalScrollbarSize: 12,
        horizontalScrollbarSize: 12,
      },
      tabSize: 2,
      automaticLayout: true, // 自适应宽高
      ...editorOption
    })
    return monacoEditor
  }
  const onFormatDoc = () => {
    monacoEditor?.getAction('editor.action.formatDocument').run()
  }
  const updateLanguage = (language) => {
    setTimeout(async () => {
      monaco.editor.setModelLanguage(monacoEditor.getModel(), language)
    }, 0)
  }

  return {
    updateVal,
    updateLanguage,
    getEditor: () => monacoEditor,
    createEditor,
    onFormatDoc
  }
}