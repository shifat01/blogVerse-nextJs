
'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const RichTextEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            })
        ],

        content: value || '',

        immediatelyRender: false,

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', {
                emitUpdate: false
            })
        }
    }, [editor, value])

    if (!editor) {
        return (
            <div className='min-h-60 rounded-xl border border-gray-200 p-4 text-sm text-gray-400'>
                Loading editor...
            </div>
        )
    }

    const buttonClass = (active = false) =>
        `rounded-lg px-3 py-2 text-sm font-semibold transition ${
            active
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
        }`

    const toolbarButton = (
        label,
        action,
        active = false,
        title = label
    ) => (
        <button
            key={label}
            type='button'
            title={title}
            aria-label={title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={action}
            className={buttonClass(active)}
        >
            {label}
        </button>
    )

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href || ''
        const url = window.prompt('Enter link URL', previousUrl)

        if (url === null) return

        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({
            href: url.trim()
        }).run()
    }

    return (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-gray-400'>

            {/* Toolbar */}
            <div className='flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2'>

                {toolbarButton(
                    'H1',
                    () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                    editor.isActive('heading', { level: 1 }),
                    'Heading 1'
                )}

                {toolbarButton(
                    'H2',
                    () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                    editor.isActive('heading', { level: 2 }),
                    'Heading 2'
                )}

                {toolbarButton(
                    'H3',
                    () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                    editor.isActive('heading', { level: 3 }),
                    'Heading 3'
                )}

                <span className='mx-1 h-6 w-px bg-gray-300' />

                {toolbarButton(
                    'B',
                    () => editor.chain().focus().toggleBold().run(),
                    editor.isActive('bold'),
                    'Bold'
                )}

                {toolbarButton(
                    'I',
                    () => editor.chain().focus().toggleItalic().run(),
                    editor.isActive('italic'),
                    'Italic'
                )}

                {toolbarButton(
                    'U',
                    () => editor.chain().focus().toggleUnderline().run(),
                    editor.isActive('underline'),
                    'Underline'
                )}

                {toolbarButton(
                    'S',
                    () => editor.chain().focus().toggleStrike().run(),
                    editor.isActive('strike'),
                    'Strikethrough'
                )}

                <span className='mx-1 h-6 w-px bg-gray-300' />

                {toolbarButton(
                    '• List',
                    () => editor.chain().focus().toggleBulletList().run(),
                    editor.isActive('bulletList'),
                    'Bullet list'
                )}

                {toolbarButton(
                    '1. List',
                    () => editor.chain().focus().toggleOrderedList().run(),
                    editor.isActive('orderedList'),
                    'Numbered list'
                )}

                {toolbarButton(
                    'Quote',
                    () => editor.chain().focus().toggleBlockquote().run(),
                    editor.isActive('blockquote'),
                    'Blockquote'
                )}

                {toolbarButton(
                    'Link',
                    setLink,
                    editor.isActive('link'),
                    'Insert link'
                )}

                <span className='mx-1 h-6 w-px bg-gray-300' />

                {toolbarButton(
                    'Undo',
                    () => editor.chain().focus().undo().run(),
                    false,
                    'Undo'
                )}

                {toolbarButton(
                    'Redo',
                    () => editor.chain().focus().redo().run(),
                    false,
                    'Redo'
                )}
            </div>

            {/* Editable content */}
            <EditorContent
                editor={editor}
                className='rich-text-content px-4 py-3 text-gray-800'
            />

            <style jsx global>{`
                .rich-text-content .tiptap {
                    min-height: 240px;
                    outline: none;
                    overflow-wrap: anywhere;
                }

                .rich-text-content .tiptap p {
                    margin: 0.75rem 0;
                    line-height: 1.8;
                }

                .rich-text-content .tiptap h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    line-height: 1.25;
                    margin: 1.25rem 0 0.75rem;
                }

                .rich-text-content .tiptap h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.35;
                    margin: 1rem 0 0.5rem;
                }

                .rich-text-content .tiptap h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 1rem 0 0.5rem;
                }

                .rich-text-content .tiptap ul {
                    list-style: disc;
                    padding-left: 1.5rem;
                    margin: 0.75rem 0;
                }

                .rich-text-content .tiptap ol {
                    list-style: decimal;
                    padding-left: 1.5rem;
                    margin: 0.75rem 0;
                }

                .rich-text-content .tiptap blockquote {
                    border-left: 4px solid #d1d5db;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: #6b7280;
                }

                .rich-text-content .tiptap a {
                    color: #2563eb;
                    text-decoration: underline;
                }

                .rich-text-content .tiptap p.is-editor-empty:first-child::before {
                    content: 'Start writing your blog here...';
                    color: #9ca3af;
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
            `}</style>
        </div>
    )
}

export default RichTextEditor