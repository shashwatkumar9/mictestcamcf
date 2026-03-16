import { notFound } from 'next/navigation';
import ReviewDetail from '@/components/review/ReviewDetail';
import { getReviewBySlug, getAllReviews } from '@/lib/admin/reviews';

interface ReviewPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

async function getReview(slug: string, language: string) {
  try {
    const review = await getReviewBySlug(slug, language);
    if (!review || review.status !== 'published') {
      return null;
    }
    return review;
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
}

async function getAlternatives(currentReviewId: string, category: string, language: string) {
  try {
    const reviews = await getAllReviews({
      language,
      status: 'published',
      category,
      limit: 4,
    });
    return reviews.filter(r => r.id !== currentReviewId).slice(0, 3);
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    return [];
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { lang, slug } = await params;
  const review = await getReview(slug, lang);

  if (!review) {
    notFound();
  }

  const alternatives = await getAlternatives(review.id, review.productCategory, lang);

  return <ReviewDetail review={review} alternatives={alternatives} language={lang} />;
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { lang, slug } = await params;
  const review = await getReview(slug, lang);

  if (!review) {
    return {
      title: 'Review Not Found',
    };
  }

  return {
    title: review.metaTitle,
    description: review.metaDescription,
    keywords: review.focusKeyword,
    openGraph: {
      title: review.metaTitle,
      description: review.metaDescription,
      images: review.heroImage ? [{ url: review.heroImage, alt: review.heroImageAlt }] : [],
      type: 'article',
    },
    alternates: {
      canonical: `/${lang}/reviews/${slug}`,
    },
  };
}
