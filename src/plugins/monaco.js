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
      fontSize: 16,
      links: false,
      formatOnPaste: true,
      formatOnType: true,
      overviewRulerBorder: false, // 是否应围绕概览标尺绘制边框
      renderLineHighlight: 'all', // 当前行突出显示方式
      scrollBeyondLastLine: false, // 设置编辑器是否可以滚动到最后一行之后
      multiCursorModifier: 'ctrlCmd',
      guides: {
        indentation: false,
      },
      scrollbar: {
        verticalScrollbarSize: 0,
        horizontalScrollbarSize: 12,
      },
      tabSize: 4,
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