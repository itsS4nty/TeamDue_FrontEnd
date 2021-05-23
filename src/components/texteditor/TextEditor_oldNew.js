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
import {cookies} from '../../helpers/createCookies';

export const TextEditor = (props) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: ' ', code: true}],
    },
  ])
  
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'italic':
        return <ItalicElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])
  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, []);
  useEffect(() => {
    if(!cookies.get('loggedIn')) props.history.push('/login');
    socket.on('new-text', (data) => {
      setValue(data);
    });
    socket.emit("refresh-page", cookies.get('username'));
  }, [props.history])
  const changeText = (data) => {
    setValue(data);
  }
  return (
    <div className='textEditor'>
      <Slate editor={editor} value={value} onChange={value => changeText(value)}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          // Replace the `onKeyDown` logic with our new commands.
          switch (event.key) {
            case "'": {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }
            case 'b': {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
            case 'i': {
              event.preventDefault();
              CustomEditor.toggleItalicMark(editor);
              break;
            }
            default : {
              console.log("No tendría que llegar aquí");
              break;
            }
          }
        }}
        onKeyUp={(e) => {
          setTimeout(() => {
            socket.emit('new-text', value);
          }, 100);
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
const ItalicElement = props => {
  return (
    <pre {...props.attributes}>
      <em>{props.children}</em>
    </pre>
  )
}
const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}
const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}



const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    });
    return !!match;
  },
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    });
    return !!match;
  },
  isItalicBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'italic',
    });
    return !!match;
  },
  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
   );
  },
  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    );
  },
  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'italic' },
      { match: n => Editor.isBlock(editor, n) }
   );
  },
}