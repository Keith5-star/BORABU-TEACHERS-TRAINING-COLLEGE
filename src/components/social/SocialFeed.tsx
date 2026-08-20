'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SocialPost {
  id: string;
  platform: 'x' | 'facebook';
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
    pageUrl: string;
  };
  content: string;
  date: string;
  timestamp: number;
  likes: number;
  shares: number;
  comments: number;
  tags: string[];
  image?: string;
  postUrl: string;
}

export default function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'x' | 'facebook'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const fetchSocialPosts = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/social-feed');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error('Failed to fetch social feed:', err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSocialPosts();
  }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const filteredPosts = posts.filter((p) => {
    if (platformFilter === 'all') return true;
    return p.platform === platformFilter;
  });

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header with Title and Platform Channel Toggles */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                background: 'var(--primary-navy)',
                color: 'var(--accent-gold)',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Live Social Stream
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
              • Synced from Official Channels
            </span>
          </div>
          <h3 style={{ fontSize: '20px', color: 'var(--text-dark)', margin: 0 }}>
            Official Updates from X & Facebook
          </h3>
        </div>

        {/* Action Controls & Platform Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => setPlatformFilter('all')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: platformFilter === 'all' ? 'var(--primary-navy)' : 'transparent',
                color: platformFilter === 'all' ? 'white' : 'var(--text-main)',
                transition: 'all 0.15s ease',
              }}
            >
              All Feeds
            </button>
            <button
              onClick={() => setPlatformFilter('x')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: platformFilter === 'x' ? '#000000' : 'transparent',
                color: platformFilter === 'x' ? 'white' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X / Twitter
            </button>
            <button
              onClick={() => setPlatformFilter('facebook')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: platformFilter === 'facebook' ? '#1877F2' : 'transparent',
                color: platformFilter === 'facebook' ? 'white' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchSocialPosts(true)}
            disabled={refreshing}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ display: 'inline-block', transform: refreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s ease' }}>
              🔄
            </span>
            {refreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)', fontSize: '14px' }}>
          Fetching latest social posts...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-light)', fontSize: '13.5px' }}>
          No posts available for the selected channel.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const currentLikes = post.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={post.id}
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                {/* Author Info & Platform Badge */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          position: 'relative',
                          border: '2px solid var(--border-light)',
                        }}
                      >
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-dark)' }}>
                            {post.author.name}
                          </span>
                          {post.author.verified && (
                            <span style={{ color: '#1D9BF0', fontSize: '13px' }} title="Verified Official Account">
                              ✓
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                          {post.author.handle} • {post.date}
                        </div>
                      </div>
                    </div>

                    {/* Platform Tag */}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: post.platform === 'x' ? '#000000' : '#1877F2',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {post.platform === 'x' ? (
                        <>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          Post
                        </>
                      ) : (
                        <>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Update
                        </>
                      )}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '14px', whiteSpace: 'pre-line' }}>
                    {post.content}
                  </p>

                  {/* Optional Attached Media */}
                  {post.image && (
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '180px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        marginBottom: '14px',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <Image
                        src={post.image}
                        alt="Attached media"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                {/* Post Footer with Engagement Stats & Direct Action Link */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12.5px',
                    color: 'var(--text-light)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <button
                      onClick={() => toggleLike(post.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isLiked ? '#E0245E' : 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12.5px',
                        padding: 0,
                      }}
                    >
                      <span>{isLiked ? '❤️' : '🤍'}</span>
                      <span>{currentLikes}</span>
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🔄</span>
                      <span>{post.shares}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>💬</span>
                      <span>{post.comments}</span>
                    </span>
                  </div>

                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: post.platform === 'x' ? 'var(--text-dark)' : '#1877F2',
                      fontWeight: '700',
                      fontSize: '12.5px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                    }}
                  >
                    View on {post.platform === 'x' ? 'X' : 'Facebook'} &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Community Connect Bar */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          border: '1px solid var(--border-light)',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
          <strong>Follow Borabu TTC on Social Media:</strong> Connect with students, alumni, and faculty.
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="https://x.com/BorabuTTC"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: '6px',
              background: '#000000',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Follow @BorabuTTC
          </a>
          <a
            href="https://facebook.com/BorabuTeachersCollege"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              borderRadius: '6px',
              background: '#1877F2',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Follow on Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
