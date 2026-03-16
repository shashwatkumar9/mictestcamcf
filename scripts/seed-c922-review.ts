import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Creating Logitech C922 Pro Stream review...');

  const review = await prisma.review.create({
    data: {
      slug: 'logitech-c922-pro-stream-webcam-review',
      language: 'en',
      status: 'published',
      productName: 'C922 Pro Stream',
      productCategory: 'webcam',
      productBrand: 'Logitech',
      productModel: 'C922',
      heroTitle: 'Logitech C922 Pro Stream Webcam Review',
      heroSubtitle: 'A professional streaming webcam with 1080p 30fps or 720p 60fps recording, background replacement, and superior low-light performance',
      heroImage: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=600&fit=crop',
      heroImageAlt: 'Logitech C922 Pro Stream Webcam',
      overallRating: 4.6,
      videoQualityRating: 4.7,
      audioQualityRating: 4.3,
      buildQualityRating: 4.5,
      valueRating: 4.5,
      fullReview: `
        <h2>Introduction</h2>
        <p>The Logitech C922 Pro Stream is designed specifically for content creators and streamers who demand reliable, high-quality video output. This webcam builds upon the success of the C920 with enhanced features tailored for streaming on platforms like Twitch, YouTube, and Facebook Gaming.</p>

        <h2>Video Quality</h2>
        <p>The C922 offers versatile recording options: 1080p at 30fps for maximum quality or 720p at 60fps for smooth, fluid motion - perfect for gaming streams where fast action needs to be captured clearly. The autofocus and light correction work seamlessly to maintain image quality across varying conditions.</p>

        <h2>Streaming Features</h2>
        <p>What sets the C922 apart is the included Personify ChromaCam background replacement technology. This software allows streamers to replace their background without a green screen, making it incredibly convenient for bedroom or small-space streamers.</p>

        <h2>Low-Light Performance</h2>
        <p>The improved low-light performance compared to the C920 is noticeable. The sensor and optics work together to produce cleaner images in dimly lit environments, reducing grain and maintaining color accuracy even when lighting isn't optimal.</p>

        <h2>Audio</h2>
        <p>Dual omnidirectional microphones capture stereo audio, though serious streamers will likely prefer a dedicated microphone for professional-quality voice recording.</p>

        <h2>Build & Compatibility</h2>
        <p>The build quality is solid with an adjustable clip-on mount and tripod thread. It works flawlessly with OBS, XSplit, Streamlabs, and all major streaming software. Compatible with Windows 10/11 and macOS 10.10+.</p>

        <h2>Verdict</h2>
        <p>The Logitech C922 Pro Stream is an excellent choice for streamers and content creators. The 60fps capability at 720p and background replacement features justify the slightly higher price over the C920. If streaming is your primary use case, the C922 is worth the investment.</p>
      `,
      excerpt: 'Professional streaming webcam with 60fps capability, background replacement, and excellent low-light performance. Perfect for Twitch and YouTube streamers.',
      pros: JSON.stringify([
        '1080p 30fps or 720p 60fps recording options',
        'Excellent low-light performance',
        'Background replacement software included',
        'Smooth autofocus and light correction',
        '78-degree field of view',
        'Works with all major streaming platforms',
        'Sturdy adjustable mount with tripod thread',
      ]),
      cons: JSON.stringify([
        'More expensive than C920',
        'Built-in microphones adequate but not exceptional',
        'Background replacement requires decent CPU',
        'No 4K support',
        'Privacy shutter not included',
      ]),
      affiliateLinks: JSON.stringify([
        {
          store: 'Amazon',
          url: 'https://amazon.com/logitech-c922',
          price: '$99.99',
        },
        {
          store: 'Best Buy',
          url: 'https://bestbuy.com/logitech-c922',
          price: '$99.99',
        },
        {
          store: 'Logitech Official',
          url: 'https://logitech.com/c922',
          price: '$99.99',
        },
      ]),
      images: JSON.stringify([
        {
          url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop',
          alt: 'Logitech C922 Pro Stream front view',
          caption: 'The C922 features a sleek black design',
        },
        {
          url: 'https://images.unsplash.com/photo-1587825140471-5b8f0c0e0ff1?w=800&h=600&fit=crop',
          alt: 'C922 on monitor mount',
          caption: 'Versatile mounting options',
        },
      ]),
      specifications: JSON.stringify({
        'Max Resolution': '1920x1080 (1080p)',
        'Frame Rate': '30fps @ 1080p, 60fps @ 720p',
        'Field of View': '78 degrees',
        'Focus Type': 'Autofocus',
        'Microphones': 'Dual omnidirectional',
        'Connection': 'USB 2.0/3.0',
        'Mount': 'Adjustable clip + tripod thread',
        'Compatibility': 'Windows 10/11, macOS 10.10+',
        'Cable Length': '5 feet (1.5m)',
        'Dimensions': '3.74 x 1.65 x 2.28 inches',
        'Weight': '5.6 oz (162g)',
      }),
      metaTitle: 'Logitech C922 Pro Stream Webcam Review - 60fps Streaming Camera',
      metaDescription: 'Comprehensive review of the Logitech C922 Pro Stream webcam. 1080p/60fps streaming, background replacement, low-light performance. Perfect for Twitch & YouTube.',
      focusKeyword: 'logitech c922 review',
      author: 'MicTestCam Team',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Created review:', review.slug);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
