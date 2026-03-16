'use client';

import Link from 'next/link';

interface MicrophoneSEOContentProps {
  lang: string;
  dictionary: {
    microphoneSeo: {
      intro: { p1: string; p2: string; p3?: string };
      howToTest: { title: string; intro: string; steps: string[] };
      advancedFeatures?: {
        title: string;
        intro: string;
        inputGain: { title: string; description: string };
        noiseSuppression: { title: string; description: string };
        echoCancellation: { title: string; description: string };
        autoGainControl: { title: string; description: string };
        realtimeMeter: { title: string; description: string };
        frequencySpectrum: { title: string; description: string };
        sideBySide: { title: string; description: string };
        snrMeasurement: { title: string; description: string };
      };
      audioLevels: {
        title: string;
        intro: string;
        green: { title: string; description: string };
        yellow: { title: string; description: string };
        red: { title: string; description: string };
        peak: { title: string; description: string };
        rms: { title: string; description: string };
      };
      frequencySpectrum: {
        title: string;
        intro: string;
        low: { title: string; description: string };
        mid: { title: string; description: string };
        high: { title: string; description: string };
        tip: string;
      };
      sampleRates: {
        title: string;
        intro: string;
        rates: {
          '22khz': { title: string; description: string };
          '44khz': { title: string; description: string };
          '48khz': { title: string; description: string };
        };
        tip: string;
      };
      types: {
        title: string;
        builtIn: { title: string; description: string };
        usb: { title: string; description: string };
        headset: { title: string; description: string };
        condenser: { title: string; description: string };
        dynamic: { title: string; description: string };
        tip: string;
      };
      bestPractices: {
        title: string;
        distance: { title: string; description: string };
        popFilter: { title: string; description: string };
        background: { title: string; description: string };
        acoustics: { title: string; description: string };
        positioning: { title: string; description: string };
      };
      troubleshooting: {
        title: string;
        noAudio: { title: string; issues: string[] };
        quiet: { title: string; issues: string[] };
        distorted: { title: string; issues: string[] };
        echo: { title: string; issues: string[] };
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

export function MicrophoneSEOContent({ lang, dictionary }: MicrophoneSEOContentProps) {
  const t = dictionary.microphoneSeo;

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <section className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.intro.p1 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.intro.p2 }} />
          {t.intro.p3 && <p className="text-lg text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.intro.p3 }} />}
        </section>

        {/* How to Test Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.howToTest.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.howToTest.intro }} />

          <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700">
            {t.howToTest.steps.map((step, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
            ))}
          </ol>
        </section>

        {/* Advanced Microphone Features Section */}
        {t.advancedFeatures && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.advancedFeatures.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.intro }} />

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.inputGain.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.inputGain.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.noiseSuppression.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.noiseSuppression.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.echoCancellation.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.echoCancellation.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.autoGainControl.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.autoGainControl.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.realtimeMeter.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.realtimeMeter.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.frequencySpectrum.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.frequencySpectrum.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.sideBySide.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.sideBySide.description }} />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.advancedFeatures.snrMeasurement.title}</h3>
                <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.advancedFeatures.snrMeasurement.description }} />
              </div>
            </div>
          </section>
        )}

        {/* Audio Levels Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.audioLevels.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.audioLevels.intro }} />

          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-900">{t.audioLevels.green.title}</h3>
              <p className="text-gray-700">{t.audioLevels.green.description}</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-900">{t.audioLevels.yellow.title}</h3>
              <p className="text-gray-700">{t.audioLevels.yellow.description}</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-900">{t.audioLevels.red.title}</h3>
              <p className="text-gray-700">{t.audioLevels.red.description}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.audioLevels.peak.title}</h3>
              <p className="text-lg text-gray-700">{t.audioLevels.peak.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.audioLevels.rms.title}</h3>
              <p className="text-lg text-gray-700">{t.audioLevels.rms.description}</p>
            </div>
          </div>
        </section>

        {/* Frequency Spectrum */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.frequencySpectrum.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.frequencySpectrum.intro }} />

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.frequencySpectrum.low.title}</h3>
              <p className="text-gray-700">{t.frequencySpectrum.low.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.frequencySpectrum.mid.title}</h3>
              <p className="text-gray-700">{t.frequencySpectrum.mid.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.frequencySpectrum.high.title}</h3>
              <p className="text-gray-700">{t.frequencySpectrum.high.description}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6">{t.frequencySpectrum.tip}</p>
        </section>

        {/* Sample Rates */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.sampleRates.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">{t.sampleRates.intro}</p>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.sampleRates.rates['22khz'].title}</h3>
              <p className="text-gray-700">{t.sampleRates.rates['22khz'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.sampleRates.rates['44khz'].title}</h3>
              <p className="text-gray-700">{t.sampleRates.rates['44khz'].description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t.sampleRates.rates['48khz'].title}</h3>
              <p className="text-gray-700">{t.sampleRates.rates['48khz'].description}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: t.sampleRates.tip }} />
        </section>

        {/* Types of Microphones */}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.headset.title}</h3>
              <p className="text-lg text-gray-700">{t.types.headset.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.condenser.title}</h3>
              <p className="text-lg text-gray-700">{t.types.condenser.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.types.dynamic.title}</h3>
              <p className="text-lg text-gray-700">{t.types.dynamic.description}</p>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: t.types.tip }} />
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.bestPractices.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.bestPractices.distance.title}</h3>
              <p className="text-lg text-gray-700">{t.bestPractices.distance.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.bestPractices.popFilter.title}</h3>
              <p className="text-lg text-gray-700">{t.bestPractices.popFilter.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.bestPractices.background.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.bestPractices.background.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.bestPractices.acoustics.title}</h3>
              <p className="text-lg text-gray-700">{t.bestPractices.acoustics.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.bestPractices.positioning.title}</h3>
              <p className="text-lg text-gray-700">{t.bestPractices.positioning.description}</p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.troubleshooting.title}</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.noAudio.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.noAudio.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.quiet.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.quiet.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.distorted.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.distorted.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.echo.title}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.echo.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
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
                <Link href={`/${lang}/free-webcam-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[1]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-webcam-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[2]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-webcam-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[3]}</Link>
                <span className="text-gray-300">|</span>
                <Link href={`/${lang}/free-webcam-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{t.relatedTools.alsoTryLinks[4]}</Link>
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
