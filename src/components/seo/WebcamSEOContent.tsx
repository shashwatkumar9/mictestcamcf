'use client';

import Link from 'next/link';

interface WebcamSEOContentProps {
  lang: string;
  dictionary: {
    webcamSeo: {
      intro: { p1: string; p2: string };
      howToUse: { title: string; intro: string; steps: string[] };
      advancedFeatures?: {
        title: string;
        intro: string;
        mirrorMode: { title: string; description: string };
        digitalZoom: { title: string; description: string };
        brightnessContrast: { title: string; description: string };
        gridOverlay: { title: string; description: string };
        videoFilters: { title: string; description: string };
        videoMetrics: { title: string; description: string };
        advancedControls: { title: string; description: string };
        backgroundBlur: { title: string; description: string };
        motionDetection: { title: string; description: string };
        faceDetection: { title: string; description: string };
        sideBySide: { title: string; description: string };
      };
      videoQuality: {
        title: string;
        intro: string;
        settings: {
          '240p': { title: string; description: string };
          '360p': { title: string; description: string };
          '480p': { title: string; description: string };
          '720p': { title: string; description: string };
          '1080p': { title: string; description: string };
          '1440p'?: { title: string; description: string };
          '4K'?: { title: string; description: string };
          '8K'?: { title: string; description: string };
        };
        tip: string;
      };
      frameRate: {
        title: string;
        intro: string;
        rates: {
          '15fps': { title: string; description: string };
          '30fps': { title: string; description: string };
          '60fps': { title: string; description: string };
        };
        tip: string;
      };
      lighting: {
        title: string;
        intro: string;
        tips: {
          position: { title: string; description: string };
          soft: { title: string; description: string };
          flicker: { title: string; description: string };
          color: { title: string; description: string };
        };
        tip: string;
      };
      types: {
        title: string;
        builtIn: { title: string; description: string };
        usb: { title: string; description: string };
        streaming: { title: string; description: string };
        dslr: { title: string; description: string };
        tip: string;
      };
      troubleshooting: {
        title: string;
        intro: string;
        blackScreen: { title: string; issues: string[] };
        blurry: { title: string; issues: string[] };
        colors: { title: string; issues: string[] };
        choppy: { title: string; issues: string[] };
      };
      platforms: {
        title: string;
        zoom: { title: string; description: string };
        teams: { title: string; description: string };
        meet: { title: string; description: string };
        streaming: { title: string; description: string };
        discord: { title: string; description: string };
      };
      relatedTools: {
        title: string;
        alsoTry: string;
        alsoTryLinks: string[];
        onThisPage: string;
        onThisPageLinks: string[];
      };
    };
  };
}

export function WebcamSEOContent({ lang, dictionary }: WebcamSEOContentProps) {
  const t = dictionary.webcamSeo;

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.intro.p1 }} />
          <p className="text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.intro.p2 }} />
        </section>

        {/* How to Use Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.howToUse.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{t.howToUse.intro}</p>

          <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700">
            {t.howToUse.steps.map((step, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
            ))}
          </ol>
        </section>

        {/* Advanced Features Section */}
        {t.advancedFeatures && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.advancedFeatures.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.intro }} />

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.mirrorMode.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.mirrorMode.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.digitalZoom.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.digitalZoom.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.brightnessContrast.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.brightnessContrast.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.gridOverlay.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.gridOverlay.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.videoFilters.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.videoFilters.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.videoMetrics.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.videoMetrics.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.advancedControls.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.advancedControls.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.backgroundBlur.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.backgroundBlur.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.motionDetection.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.motionDetection.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.faceDetection.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.faceDetection.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.sideBySide.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.sideBySide.description }} />
              </div>
            </div>
          </section>
        )}

        {/* Video Quality Settings */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.videoQuality.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.videoQuality.intro }} />

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['240p'].title}</h3>
              <p className="text-gray-700">{t.videoQuality.settings['240p'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['360p'].title}</h3>
              <p className="text-gray-700">{t.videoQuality.settings['360p'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['480p'].title}</h3>
              <p className="text-gray-700">{t.videoQuality.settings['480p'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['720p'].title}</h3>
              <p className="text-gray-700">{t.videoQuality.settings['720p'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['1080p'].title}</h3>
              <p className="text-gray-700">{t.videoQuality.settings['1080p'].description}</p>
            </div>

            {t.videoQuality.settings['1440p'] && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['1440p'].title}</h3>
                <p className="text-gray-700">{t.videoQuality.settings['1440p'].description}</p>
              </div>
            )}

            {t.videoQuality.settings['4K'] && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['4K'].title}</h3>
                <p className="text-gray-700">{t.videoQuality.settings['4K'].description}</p>
              </div>
            )}

            {t.videoQuality.settings['8K'] && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">{t.videoQuality.settings['8K'].title}</h3>
                <p className="text-gray-700">{t.videoQuality.settings['8K'].description}</p>
              </div>
            )}
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: t.videoQuality.tip }} />
        </section>

        {/* Frame Rate Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.frameRate.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.frameRate.intro }} />

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.frameRate.rates['15fps'].title}</h3>
              <p className="text-gray-700">{t.frameRate.rates['15fps'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.frameRate.rates['30fps'].title}</h3>
              <p className="text-gray-700">{t.frameRate.rates['30fps'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.frameRate.rates['60fps'].title}</h3>
              <p className="text-gray-700">{t.frameRate.rates['60fps'].description}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: t.frameRate.tip }} />
        </section>

        {/* Lighting Tips */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.lighting.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{t.lighting.intro}</p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.lighting.tips.position.title}</h3>
              <p className="text-lg text-gray-700">{t.lighting.tips.position.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.lighting.tips.soft.title}</h3>
              <p className="text-lg text-gray-700">{t.lighting.tips.soft.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.lighting.tips.flicker.title}</h3>
              <p className="text-lg text-gray-700">{t.lighting.tips.flicker.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.lighting.tips.color.title}</h3>
              <p className="text-lg text-gray-700">{t.lighting.tips.color.description}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: t.lighting.tip }} />
        </section>

        {/* Types of Webcams */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.types.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.builtIn.title}</h3>
              <p className="text-lg text-gray-700">{t.types.builtIn.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.usb.title}</h3>
              <p className="text-lg text-gray-700">{t.types.usb.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.streaming.title}</h3>
              <p className="text-lg text-gray-700">{t.types.streaming.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.dslr.title}</h3>
              <p className="text-lg text-gray-700">{t.types.dslr.description}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: t.types.tip }} />
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.troubleshooting.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.troubleshooting.intro }} />

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.blackScreen.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.blackScreen.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.blurry.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.blurry.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.colors.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.colors.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.choppy.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.choppy.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Platform Testing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.platforms.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.platforms.zoom.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.platforms.zoom.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.platforms.teams.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.platforms.teams.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.platforms.meet.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.platforms.meet.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.platforms.streaming.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.platforms.streaming.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.platforms.discord.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.platforms.discord.description }} />
            </div>
          </div>
        </section>

        {/* Internal Links Footer */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.relatedTools.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.relatedTools.alsoTry}</h3>
              <div className="flex flex-wrap gap-2">
                <Link href={`/${lang}`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[0]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-microphone-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[1]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-microphone-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[2]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-microphone-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[3]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-microphone-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[4]}</Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.relatedTools.onThisPage}</h3>
              <div className="flex flex-wrap gap-2">
                {t.relatedTools.onThisPageLinks.map((link, index) => (
                  <span key={index}>
                    <span className="text-gray-600">{link}</span>
                    {index < t.relatedTools.onThisPageLinks.length - 1 && <span className="text-gray-300 ml-2">|</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
