import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Quote, Undo, Redo, Strikethrough, Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none font-serif text-foreground',
      },
    },
  });

  if (!editor) return null;

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
    { icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), title: 'Strikethrough' },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code'), title: 'Code' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), title: 'Heading 2' },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }), title: 'Heading 3' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive('orderedList'), title: 'Ordered List' },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), title: 'Quote' },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false, title: 'Undo' },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false, title: 'Redo' },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-border bg-muted/30">
        {tools.map(({ icon: Icon, action, active, title }) => (
          <Button
            key={title}
            type="button"
            size="sm"
            variant={active ? 'default' : 'ghost'}
            onClick={action}
            title={title}
            className="h-7 w-7 p-0"
          >
            <Icon className="w-3.5 h-3.5" />
          </Button>
        ))}
      </div>
      {/* Editor */}
      <div className="bg-background min-h-[200px]">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}
