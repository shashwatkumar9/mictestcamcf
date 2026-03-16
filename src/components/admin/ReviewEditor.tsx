'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/lib/i18n';

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

interface ReviewEditorProps {
  reviewId?: string;
}

export default function ReviewEditor({ reviewId }: ReviewEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Basic fields
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('webcam');
  const [productBrand, setProductBrand] = useState('');
  const [productModel, setProductModel] = useState('');
  const [slug, setSlug] = useState('');
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState('draft');

  // Hero section
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroImageAlt, setHeroImageAlt] = useState('');

  // Ratings
  const [overallRating, setOverallRating] = useState(4.5);
  const [videoQualityRating, setVideoQualityRating] = useState(4.5);
  const [audioQualityRating, setAudioQualityRating] = useState(4.5);
  const [buildQualityRating, setBuildQualityRating] = useState(4.5);
  const [valueRating, setValueRating] = useState(4.5);

  // Content
  const [fullReview, setFullReview] = useState('');
  const [excerpt, setExcerpt] = useState('');

  // Pros and Cons
  const [pros, setPros] = useState<string[]>(['']);
  const [cons, setCons] = useState<string[]>(['']);

  // Affiliate Links
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    { store: '', url: '', price: '', logo: '' },
  ]);

  // Images
  const [images, setImages] = useState<ProductImage[]>([
    { url: '', alt: '', caption: '' },
  ]);

  // Specifications
  const [specifications, setSpecifications] = useState<Record<string, string>>({});
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');

  useEffect(() => {
    if (reviewId) {
      fetchReview();
    }
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/reviews/${reviewId}`);
      if (!response.ok) throw new Error('Failed to fetch review');

      const review = await response.json();

      // Set basic fields
      setProductName(review.productName);
      setProductCategory(review.productCategory);
      setProductBrand(review.productBrand);
      setProductModel(review.productModel);
      setSlug(review.slug);
      setLanguage(review.language);
      setStatus(review.status);

      // Hero
      setHeroTitle(review.heroTitle);
      setHeroSubtitle(review.heroSubtitle);
      setHeroImage(review.heroImage || '');
      setHeroImageAlt(review.heroImageAlt);

      // Ratings
      setOverallRating(review.overallRating);
      setVideoQualityRating(review.videoQualityRating || 0);
      setAudioQualityRating(review.audioQualityRating || 0);
      setBuildQualityRating(review.buildQualityRating || 0);
      setValueRating(review.valueRating || 0);

      // Content
      setFullReview(review.fullReview);
      setExcerpt(review.excerpt);

      // Parse JSON fields
      setPros(JSON.parse(review.pros));
      setCons(JSON.parse(review.cons));
      setAffiliateLinks(JSON.parse(review.affiliateLinks));
      setImages(JSON.parse(review.images));
      setSpecifications(JSON.parse(review.specifications));

      // SEO
      setMetaTitle(review.metaTitle);
      setMetaDescription(review.metaDescription);
      setFocusKeyword(review.focusKeyword);
    } catch (error) {
      console.error('Error fetching review:', error);
      alert('Failed to load review');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slugText = productName || heroTitle || 'review';
    const generated = slugText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = {
        productName,
        productCategory,
        productBrand,
        productModel,
        slug,
        language,
        status,
        heroTitle,
        heroSubtitle,
        heroImage: heroImage || null,
        heroImageAlt,
        overallRating,
        videoQualityRating: videoQualityRating || null,
        audioQualityRating: audioQualityRating || null,
        buildQualityRating: buildQualityRating || null,
        valueRating: valueRating || null,
        fullReview,
        excerpt,
        pros: JSON.stringify(pros.filter(p => p.trim())),
        cons: JSON.stringify(cons.filter(c => c.trim())),
        affiliateLinks: JSON.stringify(affiliateLinks.filter(l => l.store && l.url)),
        images: JSON.stringify(images.filter(i => i.url)),
        specifications: JSON.stringify(specifications),
        metaTitle,
        metaDescription,
        focusKeyword,
      };

      const url = reviewId ? `/api/admin/reviews/${reviewId}` : '/api/admin/reviews';
      const method = reviewId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save review');
      }

      alert('Review saved successfully!');
      router.push('/admin/reviews');
    } catch (error: any) {
      console.error('Error saving review:', error);
      alert(error.message || 'Failed to save review');
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for array fields
  const addPro = () => setPros([...pros, '']);
  const removePro = (index: number) => setPros(pros.filter((_, i) => i !== index));
  const updatePro = (index: number, value: string) => {
    const updated = [...pros];
    updated[index] = value;
    setPros(updated);
  };

  const addCon = () => setCons([...cons, '']);
  const removeCon = (index: number) => setCons(cons.filter((_, i) => i !== index));
  const updateCon = (index: number, value: string) => {
    const updated = [...cons];
    updated[index] = value;
    setCons(updated);
  };

  const addAffiliateLink = () =>
    setAffiliateLinks([...affiliateLinks, { store: '', url: '', price: '', logo: '' }]);
  const removeAffiliateLink = (index: number) =>
    setAffiliateLinks(affiliateLinks.filter((_, i) => i !== index));
  const updateAffiliateLink = (index: number, field: keyof AffiliateLink, value: string) => {
    const updated = [...affiliateLinks];
    updated[index] = { ...updated[index], [field]: value };
    setAffiliateLinks(updated);
  };

  const addImage = () => setImages([...images, { url: '', alt: '', caption: '' }]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, field: keyof ProductImage, value: string) => {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  };

  const addSpecification = () => {
    if (specKey && specValue) {
      setSpecifications({ ...specifications, [specKey]: specValue });
      setSpecKey('');
      setSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const updated = { ...specifications };
    delete updated[key];
    setSpecifications(updated);
  };

  if (loading) {
    return <div className="text-center py-8">Loading review...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {reviewId ? 'Edit Review' : 'Create New Review'}
        </h1>
        <button
          type="button"
          onClick={() => router.push('/admin/reviews')}
          className="text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="webcam">Webcam</option>
              <option value="microphone">Microphone</option>
              <option value="headset">Headset</option>
              <option value="camera">Camera</option>
              <option value="audio-interface">Audio Interface</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Brand *</label>
            <input
              type="text"
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Model *</label>
            <input
              type="text"
              value={productModel}
              onChange={(e) => setProductModel(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Language *</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              {locales.map((locale) => (
                <option key={locale} value={locale}>
                  {localeNames[locale]} ({locale.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Hero Section</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Hero Title *</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hero Subtitle *</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hero Image URL</label>
          <input
            type="url"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hero Image Alt Text</label>
          <input
            type="text"
            value={heroImageAlt}
            onChange={(e) => setHeroImageAlt(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Ratings */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Ratings (1-5 stars)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Overall Rating *</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={overallRating}
              onChange={(e) => setOverallRating(parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Video Quality Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={videoQualityRating}
              onChange={(e) => setVideoQualityRating(parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Audio Quality Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={audioQualityRating}
              onChange={(e) => setAudioQualityRating(parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Build Quality Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={buildQualityRating}
              onChange={(e) => setBuildQualityRating(parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value Rating</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={valueRating}
              onChange={(e) => setValueRating(parseFloat(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Content</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Full Review (HTML) *</label>
          <textarea
            value={fullReview}
            onChange={(e) => setFullReview(e.target.value)}
            className="w-full border rounded px-3 py-2 font-mono text-sm"
            rows={15}
            placeholder="<h2>Introduction</h2><p>Product details...</p>"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Use HTML for rich formatting</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Excerpt *</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>
      </div>

      {/* Pros */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Pros</h2>
        {pros.map((pro, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={pro}
              onChange={(e) => updatePro(index, e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Enter a pro"
            />
            <button
              type="button"
              onClick={() => removePro(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPro}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Pro
        </button>
      </div>

      {/* Cons */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Cons</h2>
        {cons.map((con, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={con}
              onChange={(e) => updateCon(index, e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Enter a con"
            />
            <button
              type="button"
              onClick={() => removeCon(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCon}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Con
        </button>
      </div>

      {/* Affiliate Links */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Affiliate Links (Buy Options)</h2>
        {affiliateLinks.map((link, index) => (
          <div key={index} className="border p-4 rounded space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={link.store}
                onChange={(e) => updateAffiliateLink(index, 'store', e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Store name (e.g., Amazon)"
              />
              <input
                type="text"
                value={link.price}
                onChange={(e) => updateAffiliateLink(index, 'price', e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Price (e.g., $99.99)"
              />
            </div>
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateAffiliateLink(index, 'url', e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Affiliate URL"
            />
            <input
              type="url"
              value={link.logo || ''}
              onChange={(e) => updateAffiliateLink(index, 'logo', e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Store logo URL (optional)"
            />
            <button
              type="button"
              onClick={() => removeAffiliateLink(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Link
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAffiliateLink}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Affiliate Link
        </button>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Product Images</h2>
        {images.map((image, index) => (
          <div key={index} className="border p-4 rounded space-y-2">
            <input
              type="url"
              value={image.url}
              onChange={(e) => updateImage(index, 'url', e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Image URL"
            />
            <input
              type="text"
              value={image.alt}
              onChange={(e) => updateImage(index, 'alt', e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Alt text"
            />
            <input
              type="text"
              value={image.caption || ''}
              onChange={(e) => updateImage(index, 'caption', e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Caption (optional)"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Image
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Image
        </button>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Specification name (e.g., Resolution)"
          />
          <input
            type="text"
            value={specValue}
            onChange={(e) => setSpecValue(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Value (e.g., 1080p Full HD)"
          />
          <button
            type="button"
            onClick={addSpecification}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {Object.keys(specifications).length > 0 && (
          <div className="border rounded divide-y">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3">
                <div>
                  <span className="font-medium">{key}:</span> {value}
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(key)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Title *</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            maxLength={60}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meta Description *</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            maxLength={160}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {metaDescription.length}/160 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Focus Keyword *</label>
          <input
            type="text"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/reviews')}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {saving ? 'Saving...' : reviewId ? 'Update Review' : 'Create Review'}
        </button>
      </div>
    </form>
  );
}
