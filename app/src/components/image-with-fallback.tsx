
'use client';

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';
import { Package } from 'lucide-react';

interface ImageWithFallbackProps extends ImageProps {
  fallback?: React.ReactNode;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, fallback, ...rest } = props;
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const defaultFallback = (
    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
      <Package className="h-8 w-8" />
    </div>
  );

  if (error || !src) {
    return fallback || defaultFallback;
  }

  return (
    <Image
      src={src}
      onError={() => setError(true)}
      {...rest}
    />
  );
}
