'use client';

import { useEffect, useRef, useState } from 'react';
import type { AdSlotName as AdSlotNameType } from '@/config/ads';

export type { AdSlotNameType as AdSlotName };

interface AdSlotProps {
  slot: AdSlotNameType;
  className?: string;
  label?: string;
}

/**
 * AdSlot Component
 *
 * Fetches and renders an ad slot from the database.
 * If no ad code is configured, the component returns null (nothing rendered).
 */
export function AdSlot({ slot, className = '', label }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);
  const [adCode, setAdCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdCode() {
      try {
        const response = await fetch(`/api/ads/${slot}`);
        const data = await response.json();
        if (data.ad && data.ad.adCode) {
          setAdCode(data.ad.adCode);
        }
      } catch (error) {
        console.error('Failed to fetch ad code:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdCode();
  }, [slot]);

  useEffect(() => {
    if (!adCode || !containerRef.current || isLoaded.current || loading) {
      return;
    }

    // Insert ad code into the container
    const container = containerRef.current;
    const range = document.createRange();
    const fragment = range.createContextualFragment(adCode);
    container.appendChild(fragment);

    // Execute any scripts in the ad code
    const scripts = container.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = script.textContent;
      script.parentNode?.replaceChild(newScript, script);
    });

    isLoaded.current = true;
  }, [adCode, loading]);

  // Don't render anything if ad is not configured
  if (loading || !adCode) {
    return null;
  }

  return (
    <div className={`ad-slot ${className}`}>
      {label && (
        <div className="text-xs text-gray-400 text-center mb-2 uppercase tracking-wide">
          {label}
        </div>
      )}
      <div
        ref={containerRef}
        className="flex items-center justify-center min-h-[100px] bg-gray-50 border border-gray-200 rounded-lg"
      />
    </div>
  );
}
