export const dynamic = 'force-dynamic';
import ReviewCard from '@/components/review/ReviewCard';
import { getAllReviews } from '@/lib/admin/reviews';
import { getDictionary } from '@/lib/getDictionary';
import type { Locale } from '@/lib/i18n';

interface ReviewsPageProps {
  params: Promise<{ lang: string }>;
}

async function getReviews(language: string) {
  try {
    const reviews = await getAllReviews({
      language,
      status: 'published',
      limit: 50,
    });
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);
  const reviews = await getReviews(lang);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{dictionary.reviewsPage.title}</h1>
        <p className="text-xl text-gray-600">
          {dictionary.reviewsPage.subtitle}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{dictionary.reviewsPage.noReviews}. {dictionary.reviewsPage.noReviewsDescription}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              slug={review.slug}
              language={review.language}
              productName={review.productName}
              productBrand={review.productBrand}
              productCategory={review.productCategory}
              heroImage={review.heroImage}
              heroImageAlt={review.heroImageAlt}
              overallRating={review.overallRating}
              excerpt={review.excerpt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: ReviewsPageProps) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.meta.reviews.title,
    description: dictionary.meta.reviews.description,
    alternates: {
      canonical: `/${lang}/reviews`,
    },
  };
}
