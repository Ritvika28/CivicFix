import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function S3Image({
  src,
  alt,
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=800&q=80"
}) {
  const [imgUrl, setImgUrl] = useState(src || fallbackSrc);

  useEffect(() => {
    let isMounted = true;
    async function resolveUrl() {
      if (!src) {
        setImgUrl(fallbackSrc);
        return;
      }
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
        setImgUrl(src);
        return;
      }
      try {
        if (api.getDownloadUrl) {
          const presigned = await api.getDownloadUrl(src);
          if (isMounted && presigned) {
            setImgUrl(presigned);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to resolve S3 download URL:', err);
      }
      if (isMounted) setImgUrl(fallbackSrc);
    }

    resolveUrl();
    return () => { isMounted = false; };
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgUrl}
      alt={alt || 'Issue image'}
      className={className}
      onError={() => {
        if (imgUrl !== fallbackSrc) setImgUrl(fallbackSrc);
      }}
    />
  );
}
