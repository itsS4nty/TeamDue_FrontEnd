import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {socket} from '../../helpers/createSocket';
import { ToastContainer, Slide } from 'react-toastify';
import {showToast} from '../../helpers/toast';
import { SessionRequest } from '../toasts/sessionRequest/SessionRequest'
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  Text
} from 'slate';

export const TextEditor = () => {
    const editor = useMemo(() => withReact(createEditor()), []);
    const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
    const [value, setValue] = useState([{
        children: [{ text: 'Testing' }],
    }]);
    const changeText = (data) => {
        setValue(data);
        console.log(data)
    }
    return (
        <div className='textEditor'>
   
            <Slate editor={editor} value={value} onChange={(v) => changeText(v) }>
                <Editable
                    spellCheck
                    autoFocus
                    renderElement={renderElement}
                    onKeyDown={event => {
                    if (!event.ctrlKey) {
                        return
                    }

                    switch (event.key) {
                        // When "`" is pressed, keep our existing code block logic.
                        case '`': {
                        event.preventDefault()
                        const [match] = Editor.nodes(editor, {
                            match: n => n.type === 'code',
                        })
                        Transforms.setNodes(
                            editor,
                            { type: match ? 'paragraph' : 'code' },
                            { match: n => Editor.isBlock(editor, n) }
                        )
                        break
                        }

                        // When "B" is pressed, bold the text in the selection.
                        case 'b': {
                            console.log('hola ento')
                        event.preventDefault()
                        Transforms.setNodes(
                            editor,
                            { bold: true },
                            // Apply it to text nodes, and split the text node up if the
                            // selection is overlapping only part of it.
                            { match: n => Text.isText(n), split: true }
                        )
                        break
                        }
                    }
                    }}
                />
            </Slate>
        </div>
        
    )
}


const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}
const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}