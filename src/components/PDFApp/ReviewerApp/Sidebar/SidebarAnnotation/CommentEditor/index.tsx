import { type ReactEditor } from "slate-react";
import { type HistoryEditor } from "slate-history";
import { type BaseEditor } from "slate";
import RichTextEditor from "./RichTextEditor";

type TCommentEditorProps = {
  editor: BaseEditor & ReactEditor & HistoryEditor;
};

export default function CommentEditor({ editor }: TCommentEditorProps) {
  return (
    <div className="w-full cursor-auto pt-2">
      <div className="rounded-sm shadow-sm z-10 border bg-white border-gray-300 focus-within:shadow-md focus-within:border-gray-400 relative">
        <RichTextEditor editor={editor} />
      </div>
    </div>
  );
}
