'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useCallback, useState } from 'react';
import TurndownService from 'turndown';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownInput, setShowMarkdownInput] = useState(false);
  const [markdownText, setMarkdownText] = useState('');
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-400 underline hover:text-indigo-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-gray-800 font-bold border border-gray-600 px-4 py-2',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-600 px-4 py-2',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-headings:text-white prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-white',
        style: 'color: #ffffff;',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const setColor = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
      setShowColorPicker(false);
    }
  }, [editor]);

  const exportToMarkdown = useCallback(() => {
    if (editor) {
      const html = editor.getHTML();
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });
      const markdown = turndownService.turndown(html);

      // Download as file
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'article.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [editor]);

  const importFromMarkdown = useCallback(() => {
    if (editor && markdownText) {
      // Simple markdown to HTML conversion
      let html = markdownText
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br />');

      editor.commands.setContent(html);
      setMarkdownText('');
      setShowMarkdownInput(false);
    }
  }, [editor, markdownText]);

  if (!editor) {
    return (
      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 min-h-[500px] animate-pulse">
        <div className="h-10 bg-gray-700 rounded mb-4" />
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-1/2" />
      </div>
    );
  }

  const colors = [
    '#ffffff', '#f87171', '#fb923c', '#fbbf24', '#a3e635',
    '#4ade80', '#2dd4bf', '#22d3ee', '#60a5fa', '#a78bfa',
    '#f472b6', '#9ca3af',
  ];

  return (
    <div className="bg-gray-900/50 border border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700 bg-gray-800/50">
        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-600">
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'p') {
                editor.chain().focus().setParagraph().run();
              } else {
                const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' :
              editor.isActive('heading', { level: 4 }) ? 'h4' :
              editor.isActive('heading', { level: 5 }) ? 'h5' :
              editor.isActive('heading', { level: 6 }) ? 'h6' : 'p'
            }
            className="px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
        </div>

        {/* Basic Formatting */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-2 0l-4 16m0 0h4" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v7a5 5 0 0010 0V4M5 20h14" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.5 11.5H6.5M12 4c-2.761 0-5 2.015-5 4.5 0 2.485 2.239 4.5 5 4.5s5 2.015 5 4.5c0 2.485-2.239 4.5-5 4.5" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Text Color & Highlight */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600 relative">
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowColorPicker(!showColorPicker)}
              isActive={showColorPicker}
              title="Text Color"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10M12 3v14M8 7l4-4 4 4" />
              </svg>
            </ToolbarButton>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 grid grid-cols-6 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight({ color: '#fbbf24' }).run()}
            isActive={editor.isActive('highlight')}
            title="Highlight"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.243 4.515l-6.738 6.737-.707 2.121-1.04 1.041 2.828 2.829 1.04-1.041 2.122-.707 6.737-6.738-4.242-4.242zm6.364 3.536a1 1 0 010 1.414l-7.778 7.778-2.122.707-1.414 1.414a1 1 0 01-1.414 0l-4.243-4.243a1 1 0 010-1.414l1.414-1.414.707-2.121 7.778-7.778a1 1 0 011.414 0l5.658 5.657z" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="Code Block"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Inline Code"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Line"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Table */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600">
          <ToolbarButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </ToolbarButton>
          {editor.isActive('table') && (
            <>
              <ToolbarButton
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                title="Add Column Before"
                small
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().addRowBefore().run()}
                title="Add Row Before"
                small
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteColumn().run()}
                title="Delete Column"
                small
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteRow().run()}
                title="Delete Row"
                small
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </ToolbarButton>
              <ToolbarButton
                onClick={() => editor.chain().focus().deleteTable().run()}
                title="Delete Table"
                small
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </ToolbarButton>
            </>
          )}
        </div>

        {/* Links & Images */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-600 relative">
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                if (editor.isActive('link')) {
                  removeLink();
                } else {
                  setShowLinkInput(!showLinkInput);
                }
              }}
              isActive={editor.isActive('link') || showLinkInput}
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </ToolbarButton>
            {showLinkInput && (
              <div className="absolute top-full left-0 mt-1 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 w-72">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm mb-2"
                  onKeyDown={(e) => e.key === 'Enter' && addLink()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={addLink}
                    className="flex-1 px-3 py-1.5 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
                  >
                    Add Link
                  </button>
                  <button
                    onClick={() => setShowLinkInput(false)}
                    className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowImageInput(!showImageInput)}
              isActive={showImageInput}
              title="Insert Image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </ToolbarButton>
            {showImageInput && (
              <div className="absolute top-full right-0 mt-1 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 w-72">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && addImage()}
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-xs text-gray-400 mb-1">Or upload file</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addImage}
                      className="flex-1 px-3 py-1.5 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
                    >
                      Add Image
                    </button>
                    <button
                      onClick={() => setShowImageInput(false)}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pl-2 border-r border-gray-600 pr-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </ToolbarButton>
        </div>

        {/* Markdown & Preview */}
        <div className="flex items-center gap-1 pl-2">
          <ToolbarButton
            onClick={() => setShowMarkdownInput(true)}
            title="Import Markdown"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={exportToMarkdown}
            title="Export to Markdown"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => setShowPreview(!showPreview)}
            isActive={showPreview}
            title="Preview"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Word count */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800/50 text-xs text-gray-500 flex justify-between">
        <span>{editor.storage.characterCount?.words?.() || content.split(/\s+/).filter(Boolean).length} words</span>
        <span>{editor.storage.characterCount?.characters?.() || content.length} characters</span>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-gray-900 border border-gray-600 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-800 border-b border-gray-600 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              className="prose prose-invert prose-headings:text-white prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base max-w-none p-8"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </div>
        </div>
      )}

      {/* Markdown Input Modal */}
      {showMarkdownInput && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowMarkdownInput(false)}>
          <div className="bg-gray-900 border border-gray-600 rounded-lg max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gray-800 border-b border-gray-600 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Import from Markdown</h3>
              <button
                onClick={() => {
                  setShowMarkdownInput(false);
                  setShowMarkdownPreview(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-400 text-sm mb-4">
                Paste your markdown content below. Supported syntax: headers (#), bold (**text**), italic (*text*), links [text](url)
              </p>
              <div className="grid grid-cols-1 gap-4">
                {/* Markdown Input */}
                <div className={showMarkdownPreview ? 'lg:grid lg:grid-cols-2 lg:gap-4' : ''}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Markdown Input</label>
                    <textarea
                      value={markdownText}
                      onChange={(e) => setMarkdownText(e.target.value)}
                      placeholder="# Your Markdown Here&#10;&#10;## Subheading&#10;&#10;**Bold text** and *italic text*"
                      className="w-full h-96 px-4 py-3 bg-gray-800 border border-gray-600 rounded text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Preview */}
                  {showMarkdownPreview && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Preview (Frontend View)</label>
                      <div className="h-96 overflow-auto bg-white border border-gray-300 rounded p-6">
                        <div
                          className="prose prose-headings:text-gray-900 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: markdownText
                              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.+?)\*/g, '<em>$1</em>')
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
                              .replace(/\n/g, '<br />')
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={importFromMarkdown}
                  disabled={!markdownText}
                  className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import to Editor
                </button>
                <button
                  onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                  disabled={!markdownText}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showMarkdownPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                <button
                  onClick={() => {
                    setMarkdownText('');
                    setShowMarkdownInput(false);
                    setShowMarkdownPreview(false);
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Toolbar Button Component
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  small = false,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title?: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        ${small ? 'p-1.5' : 'p-2'} rounded transition
        ${isActive ? 'bg-indigo-500/30 text-indigo-400' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
}
