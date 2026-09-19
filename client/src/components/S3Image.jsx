import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function S3Image({
  src,
  alt,
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80"
}) {
  const isDirectUrl = (url) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
  };

  // Do not set relative S3 keys (reports/...) as initial img src to prevent immediate 404 onError triggering fallback
  const [imgUrl, setImgUrl] = useState(() => {
    if (!src) return fallbackSrc;
    if (isDirectUrl(src)) return src;
    return null;
  });

  const [loading, setLoading] = useState(() => !isDirectUrl(src) && Boolean(src));

  useEffect(() => {
    let isMounted = true;

    async function resolveUrl() {
      if (!src) {
        if (isMounted) {
          setImgUrl(fallbackSrc);
          setLoading(false);
        }
        return;
      }

      if (isDirectUrl(src)) {
        if (isMounted) {
          setImgUrl(src);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        if (api && api.getDownloadUrl) {
          const presigned = await api.getDownloadUrl(src);
          if (isMounted && presigned) {
            setImgUrl(presigned);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to resolve S3 download URL:', err);
      }

      if (isMounted) {
        setImgUrl(fallbackSrc);
        setLoading(false);
      }
    }

    resolveUrl();
    return () => { isMounted = false; };
  }, [src, fallbackSrc]);

  if (loading && !imgUrl) {
    return (
      <div className={`bg-slate-900/80 animate-pulse flex items-center justify-center text-slate-500 text-xs font-mono rounded-xl border border-slate-800 ${className || 'w-full h-48'}`}>
        Resolving image...
      </div>
    );
  }

  return (
    <img
      src={imgUrl || fallbackSrc}
      alt={alt || 'Issue image'}
      className={className}
      onError={() => {
        if (imgUrl && imgUrl !== fallbackSrc) {
          console.warn(`[S3Image] Image load error for (${imgUrl}), falling back.`);
          setImgUrl(fallbackSrc);
        }
      }}
    />
  );
}

