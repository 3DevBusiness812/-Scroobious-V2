import { GoTrashcan, GoPaintcan } from "react-icons/go";
import {
  StrikethroughIcon,
  ItalicIcon,
  BoldIcon,
  ListUnorderedIcon,
  ListOrderedIcon,
  CodeIcon,
} from "@primer/octicons-react";

import { useCallback } from "react";
import isHotkey from "is-hotkey";
import { Editable, useSlate, Slate, ReactEditor } from "slate-react";
import {
  Editor,
  Transforms,
  Descendant,
  Element as SlateElement,
  type BaseEditor,
} from "slate";

import { Button, Icon, Toolbar } from "./components";
import { useStore } from "../../../../state";
import Popover from "~/components/Popover";
import { HistoryEditor } from "slate-history";

const HOTKEYS: Record<string, string> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+shift+x": "strikethrough",
  "mod+shift+C": "code",
  "mod+shift+7": "numbered-list",
  "mod+shift+8": "bulleted-list",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

type TRichTextEditorProps = {
  editor: BaseEditor & ReactEditor & HistoryEditor;
};

const RichTextEditor = ({ editor }: TRichTextEditorProps) => {
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const selectedAnnotation = useStore((state) => state.selectedAnnotation);

  return (
    <div className="w-full relative">
      <Slate
        editor={editor}
        value={initialValue}
      >
        <Toolbar>
          <div className="flex w-full justify-between">
            <div className="flex justify-start space-x-1">
              <MarkButton
                format="bold"
                icon={<BoldIcon className="w-4 h-4" />}
                Help={() => (
                  <Popover x="center" y="top">
                    <span className="space-y-1">
                      <span className="opacity-90 text-center block whitespace-nowrap">
                        Bold
                      </span>
                      <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          ⌘
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          B
                        </span>
                      </span>
                    </span>
                  </Popover>
                )}
              />
              <MarkButton
                format="italic"
                icon={<ItalicIcon className="w-4 h-4" />}
                Help={() => (
                  <Popover x="center" y="top">
                    <span className="space-y-1">
                      <span className="opacity-90 text-center block whitespace-nowrap">
                        Italic
                      </span>
                      <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          ⌘
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          I
                        </span>
                      </span>
                    </span>
                  </Popover>
                )}
              />

              <MarkButton
                format="strikethrough"
                icon={<StrikethroughIcon className="w-4 h-4" />}
                Help={() => (
                  <Popover x="center" y="top">
                    <span className="space-y-1">
                      <span className="opacity-90 text-center block whitespace-nowrap">
                        Strikethrough
                      </span>
                      <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          ⌘
                        </span>
                        <span className="w-9 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          Shift
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          X
                        </span>
                      </span>
                    </span>
                  </Popover>
                )}
              />

              <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />
              <BlockButton
                format="numbered-list"
                icon={<ListOrderedIcon className="w-4 h-4" />}
                Help={() => (
                  <Popover x="center" y="top">
                    <span className="space-y-1">
                      <span className="opacity-90 text-center block whitespace-nowrap">
                        Ordered List
                      </span>
                      <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          ⌘
                        </span>
                        <span className="w-9 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          Shift
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          7
                        </span>
                      </span>
                    </span>
                  </Popover>
                )}
              />
              <BlockButton
                format="bulleted-list"
                icon={<ListUnorderedIcon className="w-4 h-4" />}
                Help={() => (
                  <Popover x="center" y="top">
                    <span className="space-y-1">
                      <span className="opacity-90 text-center block whitespace-nowrap">
                        Bulleted List
                      </span>
                      <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          ⌘
                        </span>
                        <span className="w-9 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          Shift
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          8
                        </span>
                      </span>
                    </span>
                  </Popover>
                )}
              />

              <div className="px-1 after:content-[''] after:w-px after:block after:h-5 after:bg-gray-300" />

              <MarkButton
                format="code"
                icon={<CodeIcon className="w-4 h-4" />}
                Help={() => (
                  <Popover x="center" y="top">
                    <span className="space-y-1">
                      <span className="opacity-90 text-center block whitespace-nowrap">
                        Code
                      </span>
                      <span className="flex text-xs items-center justify-center opacity-75 text-center space-x-1">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          ⌘
                        </span>
                        <span className="w-9 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          Shift
                        </span>
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-sm">
                          C
                        </span>
                      </span>
                    </span>
                  </Popover>
                )}
              />
            </div>
          </div>
        </Toolbar>
        <div className="w-full max-h-64 overflow-auto overflow-x-hidden text-sm text-gray-700">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={`${
              selectedAnnotation
                ? "Start typing your feedback…"
                : "Select or add new feedback"
            }`}
            className="px-4 py-5 pt-14 text-sm"
            spellCheck
            autoFocus
            readOnly={!selectedAnnotation}
            onKeyDown={async (event) => {
              for (const hotkey in HOTKEYS) {
                const mark = HOTKEYS[hotkey];
                const hKey = isHotkey(hotkey, event);
                if (
                  isHotkey(hotkey, event as any) &&
                  mark &&
                  LIST_TYPES.includes(mark)
                ) {
                  event.preventDefault();
                  toggleBlock(editor, mark);
                } else if (isHotkey(hotkey, event as any)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark!);
                }
              }
            }}
          />
        </div>
      </Slate>
    </div>
  );
};

const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      // @ts-ignore
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      // @ts-ignore
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor);
  // @ts-ignore
  return marks ? marks[format] === true : false;
};

// @ts-ignore
export const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          className="text-lg italic font-medium text-gray-700"
          style={style}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul className="ml-2 pl-4 list-disc" style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 className="text-3xl font-samibold" style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 className="text-lg font-samibold" style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol className="ml-2 pl-4 list-decimal" style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

// @ts-ignore
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

  if (leaf.strikethrough) {
    children = <span className="line-through">{children}</span>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon, Help }: any) => {
  const editor = useSlate();
  return (
    <span className="relative group text-xs pointer-events-auto">
      <Button
        active={isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )}
        onMouseDown={(event: MouseEvent) => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
      >
        <span className="text-lg flex items-center">{icon}</span>
      </Button>
      {Help && <Help />}
    </span>
  );
};

const MarkButton = ({ format, icon, Help }: any) => {
  const editor = useSlate();
  return (
    <span className="relative group text-xs pointer-events-auto">
      <Button
        active={isMarkActive(editor, format)}
        onMouseDown={(event: MouseEvent) => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
      >
        <Icon>{icon}</Icon>
      </Button>
      {Help && <Help />}
    </span>
  );
};

const initialValue: Descendant[] = [
  {
    // @ts-ignore
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default RichTextEditor;
