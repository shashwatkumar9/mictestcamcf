'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { ArticleTopAd, ArticleMiddleAd, ArticleBottomAd } from '@/components/ads/ArticleAds';
import { AD_SLOT_NAMES } from '@/config/ads';

interface AffiliateLink {
  store: string;
  url: string;
  price: string;
  logo?: string;
}

interface ProductImage {
  url: string;
  alt: string;
  caption?: string;
}

interface Alternative {
  id: string;
  slug: string;
  productName: string;
  productBrand: string;
  heroImage: string | null;
  overallRating: number;
  affiliateLinks: string;
}

interface ReviewDetailProps {
  review: {
    productName: string;
    productBrand: string;
    productModel: string;
    productCategory: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string | null;
    heroImageAlt: string;
    overallRating: number;
    videoQualityRating: number | null;
    audioQualityRating: number | null;
    buildQualityRating: number | null;
    valueRating: number | null;
    fullReview: string;
    pros: string;
    cons: string;
    affiliateLinks: string;
    images: string;
    specifications: string;
  };
  alternatives?: Alternative[];
  language: string;
}

export default function ReviewDetail({ review, alternatives = [], language }: ReviewDetailProps) {
  const [pros, setPros] = useState<string[]>([]);
  const [cons, setCons] = useState<string[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});

  useEffect(() => {
    // Parse JSON fields
    try {
      setPros(JSON.parse(review.pros));
      setCons(JSON.parse(review.cons));
      setAffiliateLinks(JSON.parse(review.affiliateLinks));
      setImages(JSON.parse(review.images));
      setSpecifications(JSON.parse(review.specifications));
    } catch (error) {
      console.error('Error parsing review data:', error);
    }
  }, [review]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-2xl">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400 text-2xl">½</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300 text-2xl">★</span>
        ))}
        <span className="ml-3 text-lg text-gray-700 font-semibold">
          {rating.toFixed(1)} / 5.0
        </span>
      </div>
    );
  };

  const AffiliateBox = ({ position }: { position: 'top' | 'sticky' | 'bottom' }) => {
    if (affiliateLinks.length === 0) return null;

    // Get first affiliate link for the main buy button
    const primaryLink = affiliateLinks[0];

    return (
      <div
        className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 ${
          position === 'sticky' ? 'sticky top-24' : ''
        }`}
      >
        <h3 className="text-xl font-bold mb-4 text-center">Where to Buy</h3>

        {/* Primary Buy Button */}
        <a
          href={primaryLink.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          className="block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center font-bold py-4 px-6 rounded-lg mb-4 text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Buy Now - {primaryLink.price}
        </a>

        {affiliateLinks.length > 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center mb-3">Also available at:</p>
            {affiliateLinks.slice(1).map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="block bg-white hover:bg-blue-50 border-2 border-blue-300 rounded-lg p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {link.logo && (
                      <div className="mb-2">
                        <Image src={link.logo} alt={link.store} width={80} height={30} />
                      </div>
                    )}
                    <div className="font-semibold text-gray-900">{link.store}</div>
                    <div className="text-xl font-bold text-blue-600">{link.price}</div>
                  </div>
                  <div className="ml-4">
                    <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                      Buy →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TopAlternativesBox = () => {
    if (alternatives.length === 0) return null;

    // Show up to 5 alternatives
    const displayAlternatives = alternatives.slice(0, 5);

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 sticky top-[calc(24rem+6rem)]">
        <h3 className="text-xl font-bold mb-4 text-center">✨ Top Alternatives</h3>

        <div className="space-y-4">
          {displayAlternatives.map((alt) => {
            let altAffiliateLinks: AffiliateLink[] = [];
            try {
              altAffiliateLinks = JSON.parse(alt.affiliateLinks);
            } catch (e) {}

            return (
              <div key={alt.id} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  {alt.heroImage && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={alt.heroImage}
                        alt={alt.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm mb-1 truncate">
                      {alt.productBrand} {alt.productName}
                    </h4>
                    <div className="flex items-center mb-2 text-xs">
                      {[...Array(Math.round(alt.overallRating))].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      <span className="ml-1 text-gray-600">({alt.overallRating.toFixed(1)})</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/${language}/reviews/${alt.slug}`}
                        className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded font-semibold transition-colors"
                      >
                        Review
                      </Link>
                      {altAffiliateLinks.length > 0 && (
                        <a
                          href={altAffiliateLinks[0].url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold transition-colors"
                        >
                          Buy
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Ad */}
      <ArticleTopAd slot={AD_SLOT_NAMES.REVIEW_TOP_SECTION} />

      {/* Hero Section */}
      <div className="mb-8">
        {review.heroImage && (
          <div className="relative h-96 rounded-xl overflow-hidden mb-6">
            <Image
              src={review.heroImage}
              alt={review.heroImageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="text-sm text-gray-500 uppercase mb-2">
          {review.productCategory} Review
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{review.heroTitle}</h1>

        <p className="text-xl text-gray-600 mb-6">{review.heroSubtitle}</p>

        <div className="flex items-center gap-6 mb-6">
          {renderStars(review.overallRating)}
        </div>
      </div>

      {/* Top Alternatives Section */}
      {alternatives.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            🔥 Top Alternatives to Consider
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternatives.map((alt) => {
              let altAffiliateLinks: AffiliateLink[] = [];
              try {
                altAffiliateLinks = JSON.parse(alt.affiliateLinks);
              } catch (e) {}

              return (
                <div key={alt.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow">
                  {alt.heroImage && (
                    <div className="relative h-32 mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={alt.heroImage}
                        alt={alt.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-lg mb-2">
                    {alt.productBrand} {alt.productName}
                  </h3>
                  <div className="flex items-center mb-3">
                    {renderStars(alt.overallRating)}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/${language}/reviews/${alt.slug}`}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-center py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      View Review
                    </Link>
                    {altAffiliateLinks.length > 0 && (
                      <a
                        href={altAffiliateLinks[0].url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Affiliate Box - Top (Mobile) */}
      <div className="block lg:hidden mb-8">
        <AffiliateBox position="top" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pros and Cons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Pros & Cons</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros */}
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">✓</span> Pros
                </h3>
                <ul className="space-y-2">
                  {pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center gap-2">
                  <span className="text-2xl">✗</span> Cons
                </h3>
                <ul className="space-y-2">
                  {cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Ratings */}
          {(review.videoQualityRating ||
            review.audioQualityRating ||
            review.buildQualityRating ||
            review.valueRating) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Detailed Ratings</h2>

              <div className="space-y-4">
                {review.videoQualityRating && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Video Quality</span>
                      <span className="text-yellow-600 font-bold">
                        {review.videoQualityRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{ width: `${(review.videoQualityRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {review.audioQualityRating && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Audio Quality</span>
                      <span className="text-yellow-600 font-bold">
                        {review.audioQualityRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{ width: `${(review.audioQualityRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {review.buildQualityRating && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Build Quality</span>
                      <span className="text-yellow-600 font-bold">
                        {review.buildQualityRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{ width: `${(review.buildQualityRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {review.valueRating && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Value for Money</span>
                      <span className="text-yellow-600 font-bold">
                        {review.valueRating.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-400 h-3 rounded-full"
                        style={{ width: `${(review.valueRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Review Content */}
          <div className="bg-white rounded-lg shadow-md p-6 prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(review.fullReview),
              }}
            />
          </div>

          {/* Middle Ad */}
          <ArticleMiddleAd slot={AD_SLOT_NAMES.REVIEW_MIDDLE_SECTION} />

          {/* Product Images */}
          {images.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Product Images</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-gray-600 text-center">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {Object.keys(specifications).length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Technical Specifications</h2>

              <div className="divide-y">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="py-3 flex justify-between">
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Box - Bottom (Mobile) */}
          <div className="block lg:hidden">
            <AffiliateBox position="bottom" />
          </div>

          {/* Bottom Ad */}
          <ArticleBottomAd slot={AD_SLOT_NAMES.REVIEW_BOTTOM_SECTION} />
        </div>

        {/* Sidebar - Sticky Affiliate Box (Desktop) */}
        <div className="hidden lg:block">
          <AffiliateBox position="sticky" />
          <div className="mt-6">
            <TopAlternativesBox />
          </div>
        </div>
      </div>
    </div>
  );
}
