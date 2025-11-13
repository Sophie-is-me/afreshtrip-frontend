import React, { createContext, useContext, useState } from 'react';
import type { BlogPost } from '../types/blog';

interface BlogContextType {
  blogPosts: BlogPost[];
  getAllBlogPosts: () => BlogPost[];
  getPostById: (id: string) => BlogPost | undefined;
  getBlogPostById: (id: string) => BlogPost | undefined;
  addNewPost: (post: BlogPost) => void;
  createBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  updatePostStatistics: (id: string, stats: { views?: number; likes?: number; isLiked?: boolean; isSaved?: boolean }) => void;
  getRelatedPosts: (currentId: string, category: string, limit?: number) => BlogPost[];
  uploadImage: (file: File) => Promise<string>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

const initialBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Destinations worth going the extra mile.',
    content: `
      <p>Exploring the world has always been about discovering places that challenge our perceptions and expand our horizons. Some destinations require that extra effort, that willingness to step outside our comfort zones and embrace the unknown.</p>

      <h2>The Hidden Gems</h2>
      <p>When we talk about destinations worth going the extra mile for, we're referring to those places that aren't necessarily the most popular tourist spots, but offer experiences that are truly transformative.</p>

      <p>These locations often require more planning, longer travel times, or even some physical exertion to reach. But the rewards? Absolutely priceless.</p>

      <h2>Why the Extra Effort Matters</h2>
      <p>The journey itself becomes part of the story. The challenges we overcome along the way make the destination even more meaningful. It's not just about arriving; it's about the transformation that happens during the process.</p>

      <p>Whether it's hiking through remote trails, navigating local transportation systems, or learning to communicate in unfamiliar languages, each obstacle builds character and creates memories that last a lifetime.</p>
    `,
    excerpt: 'They describe a universe consisting of bodies moving with clockwork predictability on a stage of absolute space and time.',
    images: ['/assets/image-1.png', '/assets/image-2.png', '/assets/image-3.png'],
    author: {
      id: 'author1',
      name: 'Matt Wilson',
      avatar: '/assets/avater.png',
    },
    date: '2021-04-14',
    views: 2350,
    likes: 0,
    category: 'Travel',
    tags: ['adventure', 'exploration', 'travel tips'],
    slug: 'destinations-worth-going-extra-mile',
    isPublished: true,
    createdAt: '2021-04-14T10:00:00Z',
    updatedAt: '2021-04-14T10:00:00Z',
  },
  {
    id: '2',
    title: 'Destinations worth going the extra mile.',
    content: `
      <p>Another perspective on extraordinary travel destinations that demand commitment and reward with unforgettable experiences.</p>

      <h2>Remote Locations</h2>
      <p>Some of the most beautiful places on earth are deliberately hard to reach, preserving their pristine condition and ensuring that only the most dedicated travelers experience them.</p>
    `,
    excerpt: 'They describe a universe consisting of bodies moving with clockwork predictability on a stage of absolute space and time.',
    images: ['/assets/image-1.png'],
    author: {
      id: 'author1',
      name: 'Matt Wilson',
      avatar: '/assets/avater.png',
    },
    date: '2021-04-14',
    views: 2350,
    likes: 0,
    category: 'Travel',
    slug: 'destinations-worth-going-extra-mile-2',
    isPublished: true,
    createdAt: '2021-04-14T10:00:00Z',
    updatedAt: '2021-04-14T10:00:00Z',
  },
  {
    id: '3',
    title: 'How can you discover the most amazing hosts?',
    content: `
      <p>Finding exceptional hosts is an art that combines research, intuition, and a bit of luck. The most amazing hosts don't just provide accommodation; they become part of your travel story.</p>

      <h2>Research and Reviews</h2>
      <p>Start with thorough research. Read reviews carefully, looking for patterns in feedback about hospitality, local knowledge, and genuine connections.</p>

      <h2>Local Communities</h2>
      <p>The best hosts are often deeply connected to their local communities. They know the hidden spots, understand the culture, and can introduce you to authentic experiences.</p>
    `,
    excerpt: '',
    images: ['/assets/image-1.png'],
    author: {
      id: 'author1',
      name: 'Matt Wilson',
      avatar: '/assets/avater.png',
    },
    date: '2021-04-14',
    views: 2350,
    likes: 0,
    category: 'Travel',
    slug: 'discover-amazing-hosts',
    isPublished: true,
    createdAt: '2021-04-14T10:00:00Z',
    updatedAt: '2021-04-14T10:00:00Z',
  },
];

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);

  const getAllBlogPosts = () => blogPosts;

  const getPostById = (id: string) => blogPosts.find(p => p.id === id);

  const getBlogPostById = getPostById;

  const addNewPost = (post: BlogPost) => {
    setBlogPosts(prev => [...prev, post]);
  };

  const createBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    const newPost: BlogPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now,
    };
    addNewPost(newPost);
    return id;
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setBlogPosts(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    );
  };

  const uploadImage = async (file: File): Promise<string> => {
    // Mock upload - in real app, upload to server
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const updatePostStatistics = (id: string, stats: { views?: number; likes?: number; isLiked?: boolean; isSaved?: boolean }) => {
    setBlogPosts(prev =>
      prev.map(p => p.id === id ? { ...p, ...stats } : p)
    );
  };

  const getRelatedPosts = (currentId: string, category: string, limit: number = 3) => {
    return blogPosts
      .filter(p => p.id !== currentId && p.category === category && p.isPublished)
      .slice(0, limit);
  };

  const value = {
    blogPosts,
    getAllBlogPosts,
    getPostById,
    getBlogPostById,
    addNewPost,
    createBlogPost,
    updateBlogPost,
    updatePostStatistics,
    getRelatedPosts,
    uploadImage,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};