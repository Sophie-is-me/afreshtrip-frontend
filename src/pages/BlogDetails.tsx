import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';
import type { BlogPost } from '../types/blog';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header showToolbar showNavLinks={false} />
    <main className="px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

const ErrorMessage: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white">
      <Header showToolbar showNavLinks={false} />
      <main className="px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {t('blog.goBack')}
            </button>
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                {t('common.retry')}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const TableOfContents: React.FC<{ headings: { id: string; text: string; level: number }[] }> = ({ headings }) => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(({ id }) => document.getElementById(id));
      
      if (headingElements.length === 0) return;
      
      const scrollPosition = window.scrollY + 100;
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-20 bg-white p-4 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">{t('blog.tableOfContents')}</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 16}px` }}>
            <a
              href={`#${heading.id}`}
              className={`block py-1 text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-teal-600 font-medium'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialShareButtons: React.FC<{ url: string; title: string; description: string }> = ({ url, title, description }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'Email',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)} ${encodeURIComponent(url)}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{t('blog.sharePost')}</h3>
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full text-white ${link.color} transition-colors`}
            aria-label={t('blog.shareOn', { platform: link.name })}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
          aria-label={t('blog.copyLink')}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

const CommentSection: React.FC<{ comments: Comment[]; onAddComment: (comment: string) => void; onLikeComment: (commentId: string) => void }> = ({ comments, onAddComment, onLikeComment }) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    await onAddComment(newComment);
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">{t('blog.comments')} ({comments.length})</h3>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('blog.writeComment')}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t('blog.submitting') : t('blog.postComment')}
        </button>
      </form>
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start gap-4">
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                  <span className="ml-auto text-sm text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-sm ${comment.isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={comment.isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {comment.likes}
                  </button>
                  <button className="text-sm text-gray-500 hover:text-teal-600 transition-colors">
                    {t('blog.reply')}
                  </button>
                </div>
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-8 space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h5 className="font-medium text-sm text-gray-900">{reply.author.name}</h5>
                            <span className="ml-auto text-xs text-gray-500">{new Date(reply.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-700">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { blogPosts, updatePostStatistics, getRelatedPosts } = useBlog();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  // Calculate reading time
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Fetch blog post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const foundPost = blogPosts.find(p => p.id === id);
        if (foundPost) {
          setPost(foundPost);
          setIsLiked(foundPost.isLiked || false);
          setIsSaved(foundPost.isSaved || false);
          
          // Get related posts
          const related = getRelatedPosts(foundPost.id, foundPost.category);
          setRelatedPosts(related);
          
          // Extract headings for table of contents
          if (contentRef.current) {
            const headingElements = contentRef.current.querySelectorAll('h2, h3, h4');
            const extractedHeadings = Array.from(headingElements).map((heading, index) => ({
              id: `heading-${index}`,
              text: heading.textContent || '',
              level: parseInt(heading.tagName.substring(1))
            }));
            setHeadings(extractedHeadings);
            setShowTableOfContents(extractedHeadings.length > 0);
            
            // Add IDs to headings
            headingElements.forEach((heading, index) => {
              heading.id = `heading-${index}`;
            });
          }
          
          // Fetch comments (mock data for now)
          setComments([
            {
              id: '1',
              author: {
                name: 'John Doe',
                avatar: 'https://picsum.photos/seed/user1/100/100.jpg'
              },
              content: 'Great article! I really enjoyed reading this and learned a lot.',
              date: '2023-05-15',
              likes: 5,
              isLiked: false
            },
            {
              id: '2',
              author: {
                name: 'Jane Smith',
                avatar: 'https://picsum.photos/seed/user2/100/100.jpg'
              },
              content: 'Thanks for sharing this. I have a question about the third point...',
              date: '2023-05-16',
              likes: 2,
              isLiked: true,
              replies: [
                {
                  id: '2-1',
                  author: {
                    name: 'Blog Author',
                    avatar: 'https://picsum.photos/seed/author/100/100.jpg'
                  },
                  content: 'Great question! Let me clarify that point for you...',
                  date: '2023-05-17',
                  likes: 1,
                  isLiked: false
                }
              ]
            }
          ]);
        } else {
          setError(t('blog.blogPostNotFound'));
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError(t('blog.errorLoadingPost'));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [blogPosts, id, t, getRelatedPosts]);

  // Increment views when component mounts
  useEffect(() => {
    if (post && id) {
      updatePostStatistics(id, { views: post.views + 1 });
    }
  }, [post, id, updatePostStatistics]);

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle like
  const handleLike = () => {
    if (!post || !id) return;
    
    setIsLiked(!isLiked);
    updatePostStatistics(id, { 
      likes: isLiked ? post.likes - 1 : post.likes + 1,
      isLiked: !isLiked
    });
  };

  // Handle save
  const handleSave = () => {
    if (!post || !id) return;
    
    setIsSaved(!isSaved);
    updatePostStatistics(id, { 
      isSaved: !isSaved
    });
  };

  // Handle add comment
  const handleAddComment = async (comment: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: user.displayName || user.email || 'Anonymous',
        avatar: user.photoURL || 'https://picsum.photos/seed/default/100/100.jpg'
      },
      content: comment,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    setComments([newComment, ...comments]);
  };

  // Handle like comment
  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Retry fetching post
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={handleRetry} />;
  if (!post) return null; // Should not happen

  const currentUrl = window.location.href;
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="min-h-screen bg-white">
      <Header showToolbar showNavLinks={false} />
      
      {/* Breadcrumbs */}
      <nav className="px-8 py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                {t('common.home')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/blog" className="text-gray-500 hover:text-gray-700">
                {t('blog.blog')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium truncate max-w-xs">{post.title}</li>
          </ol>
        </div>
      </nav>

      <main className="px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button and Actions */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('blog.backToBlog')}
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label={t('blog.print')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
                aria-label={isLiked ? t('blog.unlike') : t('blog.like')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={handleSave}
                className={`p-2 rounded-full transition-colors ${isSaved ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'}`}
                aria-label={isSaved ? t('blog.unsave') : t('blog.save')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{post.author.name}</p>
                  <p>{new Date(post.date).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.views} {t('blog.views')}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes} {t('blog.likes')}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime} {t('blog.minRead')}
                </span>
              </div>
            </div>
            
            {/* Category and Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.tags && post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="mb-8">
              {post.images.map((image, index) => (
                <div key={index} className="mb-4">
                  <img
                    src={image}
                    alt={`${post.title} - Image ${index + 1}`}
                    className="w-full rounded-lg cursor-pointer"
                    onClick={() => setLightboxImage(image)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Content and Table of Contents */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div
                ref={contentRef}
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            
            {showTableOfContents && (
              <div className="lg:col-span-1">
                <TableOfContents headings={headings} />
              </div>
            )}
          </div>

          {/* Social Share */}
          <SocialShareButtons
            url={currentUrl}
            title={post.title}
            description={post.excerpt || ''}
          />

          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">{t('blog.aboutAuthor')}</h3>
            <div className="flex items-start gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-bold text-lg">{post.author.name}</h4>
                <p className="text-gray-600 mb-3">{post.author.bio || t('blog.authorBioDefault')}</p>
                <div className="flex gap-3">
                  {post.author.socialLinks?.twitter && (
                    <a
                      href={post.author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {post.author.socialLinks?.linkedin && (
                    <a
                      href={post.author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
          />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">{t('blog.relatedPosts')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {relatedPost.images.length > 0 && (
                      <img
                        src={relatedPost.images[0]}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold mb-2">{relatedPost.title}</h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                      <Link
                        to={`/blog/${relatedPost.id}`}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                      >
                        {t('blog.readMore')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Enlarged view"
            className="max-w-full max-h-full"
          />
          <button
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
            onClick={() => setLightboxImage(null)}
            aria-label={t('blog.close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 z-50"
          aria-label={t('blog.backToTop')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetails;