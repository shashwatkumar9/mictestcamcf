'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ReviewCardProps {
  slug: string;
  language: string;
  productName: string;
  productBrand: string;
  productCategory: string;
  heroImage: string | null;
  heroImageAlt: string;
  overallRating: number;
  excerpt: string;
}

export default function ReviewCard({
  slug,
  language,
  productName,
  productBrand,
  productCategory,
  heroImage,
  heroImageAlt,
  overallRating,
  excerpt,
}: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">½</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <Link href={`/${language}/reviews/${slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {heroImage && (
          <div className="relative h-48 bg-gray-200">
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="text-sm text-gray-500 mb-2">{productCategory}</div>

          <h3 className="text-xl font-bold mb-2">
            {productBrand} {productName}
          </h3>

          <div className="mb-3">{renderStars(overallRating)}</div>

          <p className="text-gray-600 line-clamp-3 mb-4">{excerpt}</p>

          <div className="text-blue-600 font-medium hover:text-blue-800">
            Read Full Review →
          </div>
        </div>
      </div>
    </Link>
  );
}
