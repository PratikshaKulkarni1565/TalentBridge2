import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const EMOJIS = ["😊", "🎉", "🔥", "👏", "💡", "🚀", "❤️", "👍"];

const RichTextEditor = ({ onContentChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || "What's on your mind?" }),
    ],
    onUpdate({ editor }) {
      onContentChange(editor.getHTML(), editor.getText());
    },
  });

  if (!editor) return null;

  return (
    <div className="rich-editor-wrapper">
      <div className="rich-editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "active" : ""}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "active" : ""}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "active" : ""}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "active" : ""}>• List</button>
        <div className="emoji-picker">
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => editor.chain().focus().insertContent(e).run()} className="emoji-btn">{e}</button>
          ))}
        </div>
      </div>
      <EditorContent editor={editor} className="rich-editor-content" />
    </div>
  );
};

export default RichTextEditor;
