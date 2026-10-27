
'use client'

import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import RichTextEditor from '@/Components/RichTextEditor'

const EditBlog = () => {
    const { id } = useParams()
    const router = useRouter()

    const [data, setData] = useState({
        title: '',
        description: '',
        category: 'Startup'
    })

    const [image, setImage] = useState(null)
    const [currentImage, setCurrentImage] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get('/api/blog', {
                    params: { id }
                })

                const blog = response.data.blog || response.data

                if (!blog || !blog._id) {
                    toast.error('Blog not found')
                    return
                }

                setData({
                    title: blog.title || '',
                    description: blog.description || '',
                    category: blog.category || 'Startup'
                })

                setCurrentImage(blog.image || '')
            } catch (error) {
                toast.error(
                    error.response?.data?.message || 'Failed to load blog'
                )
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchBlog()
    }, [id])

    const onChangeHandler = (event) => {
        const { name, value } = event.target

        setData((previousData) => ({
            ...previousData,
            [name]: value
        }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setSaving(true)

        try {
            const formData = new FormData()

            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('category', data.category)

            if (image) {
                formData.append('image', image)
            }

            const response = await axios.put(
                `/api/blog?id=${id}`,
                formData
            )

            if (response.data.success) {
                toast.success(response.data.message || 'Blog Updated')
                router.push('/author/blogList')
            } else {
                toast.error(
                    response.data.message || 'Failed to update blog'
                )
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Failed to update blog'
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className='min-h-[70vh] flex items-center justify-center bg-gray-50 px-4'>
                <div className='w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
                    <div className='mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black' />
                    <h2 className='text-lg font-semibold text-gray-900'>
                        Loading your blog
                    </h2>
                    <p className='mt-2 text-sm text-gray-500'>
                        Please wait while we prepare the editor.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <main className='min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10 lg:py-12'>
            <div className='mx-auto max-w-5xl'>

                {/* Page heading */}
                <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        {/* <div className='mb-3 flex items-center gap-2 text-sm font-medium text-gray-500'>
                            <span>Admin</span>
                            <span>/</span>
                            <span>blogList</span>
                            <span>/</span>
                            <span className='text-gray-900'>Edit blog</span>
                        </div> */}

                        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                            Edit your blog
                        </h1>

                        <p className='mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base'>
                            Refine your story, update its details, and keep
                            your content looking its best.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={() => router.push('/author/blogList')}
                        className='inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-100'
                    >
                        <span aria-hidden='true'>←</span>
                        Back to blog list
                    </button>
                </div>

                {/* Editor card */}
                <form onSubmit={onSubmitHandler}>
                    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'>

                        {/* Card header */}
                        <div className='border-b border-gray-100 px-5 py-5 sm:px-8'>
                            <div className='flex items-start gap-4'>
                                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl text-white'>
                                    ✎
                                </div>

                                <div>
                                    <h2 className='text-lg font-semibold text-gray-900'>
                                        Blog details
                                    </h2>
                                    <p className='mt-1 text-sm text-gray-500'>
                                        Make changes to your existing post.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_0.85fr]'>

                            {/* Left: form fields */}
                            <div className='flex flex-col gap-6'>

                                <div>
                                    <label
                                        htmlFor='title'
                                        className='mb-2 block text-sm font-semibold text-gray-800'
                                    >
                                        Blog title
                                    </label>

                                    <input
                                        id='title'
                                        type='text'
                                        name='title'
                                        value={data.title}
                                        onChange={onChangeHandler}
                                        required
                                        maxLength={200}
                                        placeholder='Give your blog a clear title'
                                        className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-100'
                                    />

                                    <p className='mt-2 text-right text-xs text-gray-400'>
                                        {data.title.length}/200 characters
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor='category'
                                        className='mb-2 block text-sm font-semibold text-gray-800'
                                    >
                                        Category
                                    </label>

                                    <select
                                        id='category'
                                        name='category'
                                        value={data.category}
                                        onChange={onChangeHandler}
                                        required
                                        className='w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-100'
                                    >
                                        <option value='Startup'>Startup</option>
                                        <option value='Technology'>Technology</option>
                                        <option value='Lifestyle'>Lifestyle</option>
                                    </select>
                                </div>

                                <div>
                                    <div className='mb-2 flex items-center justify-between gap-3'>
                                        <label
                                            htmlFor='description'
                                            className='block text-sm font-semibold text-gray-800'
                                        >
                                            Blog description
                                        </label>

                                        <span className='text-xs text-gray-400'>
                                            Main content
                                        </span>
                                    </div>

                                    <RichTextEditor
                                        value={data.description}
                                        onChange={(html) =>
                                            setData((previousData) => ({
                                                ...previousData,
                                                description: html
                                            }))
                                        }
                                    />

                                    <p className='mt-2 text-xs leading-5 text-gray-400'>
                                        Review your content before saving your changes.
                                    </p>
                                </div>
                            </div>

                            {/* Right: image panel */}
                            <div>
                                <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5'>
                                    <div className='mb-4'>
                                        <h3 className='text-sm font-semibold text-gray-900'>
                                            Featured image
                                        </h3>
                                        <p className='mt-1 text-sm leading-5 text-gray-500'>
                                            This image represents your blog post.
                                        </p>
                                    </div>

                                    <div className='relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white'>
                                        {image ? (
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt='New image preview'
                                                className='h-full w-full object-cover'
                                            />
                                        ) : currentImage ? (
                                            <Image
                                                src={currentImage}
                                                alt='Current blog image'
                                                fill
                                                unoptimized
                                                className='object-cover'
                                                sizes='(max-width: 1024px) 100vw, 40vw'
                                            />
                                        ) : (
                                            <div className='px-5 text-center'>
                                                <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl'>
                                                    ▧
                                                </div>
                                                <p className='text-sm font-medium text-gray-700'>
                                                    No image available
                                                </p>
                                                <p className='mt-1 text-xs text-gray-400'>
                                                    Choose an image below.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <label
                                        htmlFor='image'
                                        className='mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-5 text-center transition hover:border-gray-500 hover:bg-gray-50'
                                    >
                                        <span className='mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-lg'>
                                            ↑
                                        </span>

                                        <span className='text-sm font-semibold text-gray-800'>
                                            Choose a new image
                                        </span>

                                        <span className='mt-1 max-w-full break-all text-xs text-gray-400'>
                                            {image
                                                ? image.name
                                                : 'PNG, JPG, WEBP or another image format'}
                                        </span>

                                        <input
                                            id='image'
                                            type='file'
                                            accept='image/*'
                                            className='sr-only'
                                            onChange={(event) =>
                                                setImage(
                                                    event.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </label>

                                    <p className='mt-3 text-xs leading-5 text-gray-500'>
                                        Leave the image unchanged to keep the
                                        current one. Selecting a new image will
                                        replace it when you update the blog.
                                    </p>

                                    {image && (
                                        <button
                                            type='button'
                                            onClick={() => setImage(null)}
                                            className='mt-3 text-sm font-medium text-red-600 transition hover:text-red-700'
                                        >
                                            Cancel new image
                                        </button>
                                    )}
                                </div>

                                <div className='mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4'>
                                    <div className='flex gap-3'>
                                        <span className='text-lg'>ⓘ</span>
                                        <div>
                                            <h4 className='text-sm font-semibold text-blue-950'>
                                                Before you publish
                                            </h4>
                                            <p className='mt-1 text-xs leading-5 text-blue-800'>
                                                Check the title, category, and
                                                image. Your changes will be saved
                                                to this blog when you click Update
                                                blog.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions */}
                        <div className='flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8'>
                            <p className='text-xs leading-5 text-gray-500'>
                                Changes are saved when you update this post.
                            </p>

                            <div className='flex flex-col-reverse gap-3 sm:flex-row'>
                                <button
                                    type='button'
                                    onClick={() => router.push('/author/blogList')}
                                    disabled={saving}
                                    className='rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
                                >
                                    Cancel
                                </button>

                                <button
                                    type='submit'
                                    disabled={saving}
                                    className='inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60'
                                >
                                    {saving && (
                                        <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' />
                                    )}

                                    {saving ? 'Updating blog...' : 'Update blog'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <p className='mt-5 text-center text-xs text-gray-400'>
                    Blog management · Edit post
                </p>
            </div>
        </main>
    )
}

export default EditBlog