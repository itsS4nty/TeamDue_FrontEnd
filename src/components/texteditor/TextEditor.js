import React, { useCallback, useMemo, useState, useEffect } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";
import { ToastContainer, Slide } from 'react-toastify';
import axios from 'axios';
import {socket} from '../../helpers/createSocket';
import { Button, Icon, Toolbar } from "./components";
import {showToast} from '../../helpers/toast';
import { SessionRequest } from '../toasts/sessionRequest/SessionRequest'
import {cookies} from '../../helpers/createCookies';
import { FilterCenterFocusTwoTone } from "@material-ui/icons";
var idSessionRoom = '', fileId = '', fileName = '';
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+'": "code"
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

export const TextEditor = (props) => {
  // sessionStorage.getItem('content')
  const [value, setValue] = useState(JSON.parse(sessionStorage.getItem('content')) || initialValue);
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  useEffect(() => {
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    console.log(params.get('roomId'));
    idSessionRoom = params.get('roomId');
    fileId = params.get('fileId');
    fileName = params.get('fileName');
  }, []);
  useEffect(() => {
    if(!cookies.get('loggedIn')) props.history.push('/login');
    socket.on('new-text', (data) => {
      if(data.user !== cookies.get('username')) setValue(data);
    });
    socket.emit('pedir-texto', {
      usuario: cookies.get('username'),
      nombre: fileName.split('.')[0]
    })
    socket.emit("refresh-page", cookies.get('username'));
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);
    if(!params.get('button')) socket.emit("join-room", {roomId: idSessionRoom, usuario: cookies.get('username')});
  }, [props.history]);
  return (
    <div className="textEditor">
        <Slate editor={editor} value={value} onChange={value =>  setValue(value)}>
        <Toolbar>
            &nbsp;
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        </Toolbar>
        <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Introduce aquí el texto..."
            spellCheck
            autoFocus
            onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
                }
            }
            }}
            onKeyUp={(e) => {
                console.log(value);
                setTimeout(() => {
                  console.log(fileName)
                    socket.emit('new-text', {data: value, idRoom: idSessionRoom, user: cookies.get('username'), nombre: fileName});
                }, 100);
            }}
        />
        </Slate>
    </div>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

var initialValue = [{
    type: 'paragraph',
    children: [{ text: ' '}],
}];