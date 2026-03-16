import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Creating sample webcam review...');

  const sampleReview = {
    slug: 'logitech-c920-pro-hd-webcam-review',
    language: 'en',
    status: 'published',

    // Basic Info
    productName: 'C920 Pro HD Webcam',
    productCategory: 'webcam',
    productBrand: 'Logitech',
    productModel: 'C920',

    // Hero Section
    heroTitle: 'Logitech C920 Pro HD Webcam Review: Still the Best Value in 2026?',
    heroSubtitle:
      'After years on the market, we test if the Logitech C920 still holds up as the go-to webcam for streamers, remote workers, and content creators.',
    heroImage: 'https://images.unsplash.com/photo-1593376893114-1aed528d80cf?w=1200&h=600&fit=crop',
    heroImageAlt: 'Logitech C920 Pro HD Webcam on desk setup',

    // Ratings
    overallRating: 4.5,
    videoQualityRating: 4.3,
    audioQualityRating: 4.0,
    buildQualityRating: 4.8,
    valueRating: 4.9,

    // Content
    excerpt:
      'The Logitech C920 continues to be one of the best value webcams on the market, offering 1080p video quality, reliable autofocus, and stereo microphones at an affordable price point. Perfect for video calls, streaming, and content creation.',

    fullReview: `
      <h2>Introduction</h2>
      <p>The Logitech C920 Pro HD Webcam has been a staple in the webcam market for years, and for good reason. Despite being released several years ago, it continues to offer excellent value for money and reliable performance that meets the needs of most users.</p>

      <h2>Video Quality</h2>
      <p>The C920 captures video at 1080p resolution at 30fps, which is more than adequate for video conferencing, streaming, and content creation. The image is sharp, colors are accurate, and the autofocus works reliably even in changing lighting conditions.</p>

      <p>In well-lit environments, the video quality is exceptional. However, performance does drop in low-light situations, which is common for webcams in this price range. The automatic light correction helps compensate somewhat, but you'll still want good lighting for the best results.</p>

      <h2>Audio Quality</h2>
      <p>The built-in stereo microphones are surprisingly good for a webcam. They provide clear audio with decent noise reduction, making them suitable for casual video calls. However, serious streamers and content creators will want to invest in a dedicated microphone for professional-quality audio.</p>

      <h2>Build Quality & Design</h2>
      <p>The C920 features a solid plastic construction that feels durable and well-made. The universal clip fits securely on monitors, laptops, and tripods. The camera can tilt up and down, allowing you to adjust the angle for the perfect framing.</p>

      <h2>Software & Compatibility</h2>
      <p>The Logitech Capture software is intuitive and offers various settings for adjusting brightness, contrast, and other video parameters. The webcam is plug-and-play on both Windows and Mac, with no drivers required for basic functionality. It's also compatible with all major video conferencing platforms including Zoom, Microsoft Teams, Google Meet, and Skype.</p>

      <h2>Who Should Buy This?</h2>
      <ul>
        <li>Remote workers needing reliable video call quality</li>
        <li>Beginning streamers on a budget</li>
        <li>Students attending online classes</li>
        <li>Content creators looking for a solid backup camera</li>
      </ul>

      <h2>Final Verdict</h2>
      <p>The Logitech C920 remains one of the best value webcams you can buy in 2026. While it may not have all the latest features found in newer models, its combination of reliable 1080p video quality, good audio, solid build, and competitive pricing make it an excellent choice for most users. Unless you specifically need 4K resolution or advanced features, the C920 is hard to beat.</p>
    `,

    // Pros and Cons
    pros: JSON.stringify([
      'Excellent 1080p video quality at 30fps',
      'Reliable autofocus and light correction',
      'Surprisingly good built-in stereo microphones',
      'Solid, durable build quality',
      'Wide compatibility with all major platforms',
      'Great value for money',
      'Easy plug-and-play setup',
      'Tripod mount included',
    ]),

    cons: JSON.stringify([
      'No 4K resolution option',
      'Performance drops in low light',
      'Fixed 30fps (no 60fps option)',
      'Built-in privacy shutter would be nice',
      'Microphones not suitable for professional streaming',
      'Cable could be longer',
    ]),

    // Affiliate Links
    affiliateLinks: JSON.stringify([
      {
        store: 'Amazon',
        url: 'https://amazon.com/logitech-c920',
        price: '$69.99',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      },
      {
        store: 'Best Buy',
        url: 'https://bestbuy.com/logitech-c920',
        price: '$74.99',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg',
      },
      {
        store: 'Logitech Official',
        url: 'https://logitech.com/c920',
        price: '$79.99',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg',
      },
    ]),

    // Product Images
    images: JSON.stringify([
      {
        url: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=600&fit=crop',
        alt: 'Logitech C920 front view',
        caption: 'Front view showing the lens and stereo microphones',
      },
      {
        url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
        alt: 'Logitech C920 on monitor',
        caption: 'The universal clip securely attaches to monitors and laptops',
      },
      {
        url: 'https://images.unsplash.com/photo-1611095562259-e3e4e25c8a8f?w=800&h=600&fit=crop',
        alt: 'Video quality sample',
        caption: 'Sample 1080p video quality in good lighting',
      },
      {
        url: 'https://images.unsplash.com/photo-1629552849048-4e8f6940e4d4?w=800&h=600&fit=crop',
        alt: 'Setup example',
        caption: 'Example setup for streaming and video calls',
      },
    ]),

    // Specifications
    specifications: JSON.stringify({
      'Video Resolution': '1080p (1920 x 1080) at 30fps',
      'Field of View': '78 degrees diagonal',
      'Lens Type': 'Full HD glass lens',
      Autofocus: 'Yes',
      'Focus Range': '7 cm to infinity',
      'Built-in Microphones': 'Dual stereo microphones',
      'Cable Length': '1.5 meters (5 feet)',
      'Mounting Options': 'Universal clip, tripod mount',
      'Compatibility': 'Windows 7 or later, macOS 10.10 or later',
      'USB Type': 'USB-A 2.0',
      Dimensions: '9.4 x 4.3 x 7.1 cm',
      Weight: '162 grams',
    }),

    // SEO
    metaTitle: 'Logitech C920 Pro HD Webcam Review 2026 - Still Worth It?',
    metaDescription:
      'Comprehensive review of the Logitech C920 Pro HD Webcam. Find out if this popular 1080p webcam is still the best value choice for video calls, streaming, and content creation in 2026.',
    focusKeyword: 'logitech c920 review',

    // Metadata
    author: 'admin',
    publishedAt: new Date(),
  };

  // Create the review
  const review = await prisma.review.create({
    data: sampleReview,
  });

  console.log('✅ Sample review created successfully!');
  console.log(`Review ID: ${review.id}`);
  console.log(`Slug: ${review.slug}`);
  console.log(`\nView at: http://localhost:3001/en/reviews/${review.slug}`);
}

main()
  .catch((e) => {
    console.error('Error creating sample review:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
