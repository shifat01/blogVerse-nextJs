'use client'

import React, { useEffect, useState } from 'react';
import BlogItem from './BlogItem';
import axios from 'axios';

const BlogList = ({search}) => {
    const [menu, setMenu] = useState("All");
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('/api/blog');
            setBlogs(response.data.blogs);
        } catch (error) {
            console.error(
                error.response?.data?.message || "Failed to fetch blogs"
            );
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = blogs.filter((item) => {
        const matchesCategory = menu === "All" || item.category === menu;

        const matchesSearch = item.title?.toLowerCase().includes(search.trim().toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 my-8">
                {["All", "Technology", "Startup", "Lifestyle"].map((category) => (
                    <button
                        key={category}
                        onClick={() => setMenu(category)}
                        className={`py-1 px-4 rounded-sm cursor-pointer ${
                            menu === category
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-black'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Blog Results */}
            <div className="flex flex-wrap justify-around gap-1 gap-y-10 mb-16 xl:mx-24">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map((item) => (
                        <BlogItem
                            key={item._id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                            category={item.category}
                            id={item._id}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-10">
                        No blogs found. Try another search.
                    </p>
                )}
            </div>
        </div>
    );
};

export default BlogList;
