'use client';

import Link from 'next/link';

interface HomeSEOContentProps {
  lang: string;
  dictionary: {
    homeSeo: {
      intro: {
        directAnswer?: string;
        p1: string;
        p2: string;
        p3: string;
        keyTakeaways?: {
          title: string;
          points: string[];
        };
      };
      whyTest: {
        title: string;
        directAnswer?: string;
        p1: string;
        p2: string;
        p3: string;
        comparison?: {
          title: string;
          points: string[];
        };
      };
      howItWorks: {
        title: string;
        directAnswer?: string;
        p1: string;
        p2: string;
        p3: string;
        technicalSpecs?: {
          title: string;
          specs: string[];
        };
      };
      features: {
        title: string;
        webcamTitle: string;
        webcamFeatures: string[];
        microphoneTitle: string;
        microphoneFeatures: string[];
      };
      whoUses: {
        title: string;
        remoteWorkers: { title: string; description: string };
        contentCreators: { title: string; description: string };
        students: { title: string; description: string };
        jobSeekers: { title: string; description: string };
        gamers: { title: string; description: string };
        techSupport: { title: string; description: string };
      };
      privacy: {
        title: string;
        intro: string;
        localProcessing: { title: string; description: string };
        noAccount: { title: string; description: string };
        transparent: { title: string; description: string };
        cleanup: { title: string; description: string };
      };
      compatibility: {
        title: string;
        intro: string;
        browsersTitle: string;
        browsers: string[];
        devicesTitle: string;
        devices: string[];
      };
      troubleshooting: {
        title: string;
        intro: string;
        cameraTitle: string;
        cameraIssues: string[];
        microphoneTitle: string;
        microphoneIssues: string[];
      };
      quickLinks: {
        title: string;
        webcamTitle: string;
        webcamLinks: string[];
        microphoneTitle: string;
        microphoneLinks: string[];
      };
    };
  };
}

export function HomeSEOContent({ lang, dictionary }: HomeSEOContentProps) {
  const t = dictionary.homeSeo;

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <section className="mb-16">
          {/* Direct Answer - GEO Optimized */}
          {t.intro.directAnswer && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-8">
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                {t.intro.directAnswer}
              </p>
            </div>
          )}

          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.intro.p1 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.intro.p2 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.intro.p3 }} />

          {/* Key Takeaways - GEO Optimized */}
          {t.intro.keyTakeaways && (
            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.intro.keyTakeaways.title}</h3>
              <ul className="space-y-3">
                {t.intro.keyTakeaways.points.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Why Test Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.whyTest.title}</h2>

          {/* Direct Answer - GEO Optimized */}
          {t.whyTest.directAnswer && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-8">
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                {t.whyTest.directAnswer}
              </p>
            </div>
          )}

          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.whyTest.p1 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.whyTest.p2 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.whyTest.p3 }} />

          {/* Comparison - GEO Optimized */}
          {t.whyTest.comparison && (
            <div className="bg-white border border-gray-200 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.whyTest.comparison.title}</h3>
              <ul className="space-y-3">
                {t.whyTest.comparison.points.map((point, index) => (
                  <li key={index} className="text-gray-700" dangerouslySetInnerHTML={{ __html: point }} />
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.howItWorks.title}</h2>

          {/* Direct Answer - GEO Optimized */}
          {t.howItWorks.directAnswer && (
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 mb-8">
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                {t.howItWorks.directAnswer}
              </p>
            </div>
          )}

          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.howItWorks.p1 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.howItWorks.p2 }} />
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.howItWorks.p3 }} />

          {/* Technical Specs - GEO Optimized */}
          {t.howItWorks.technicalSpecs && (
            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t.howItWorks.technicalSpecs.title}</h3>
              <div className="grid gap-3">
                {t.howItWorks.technicalSpecs.specs.map((spec, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: spec }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.features.title}</h2>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{t.features.webcamTitle}</h3>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-8">
            {t.features.webcamFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{t.features.microphoneTitle}</h3>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
            {t.features.microphoneFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </section>

        {/* Who Uses Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.whoUses.title}</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.whoUses.remoteWorkers.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.whoUses.remoteWorkers.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.whoUses.contentCreators.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.whoUses.contentCreators.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.whoUses.students.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.whoUses.students.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.whoUses.jobSeekers.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.whoUses.jobSeekers.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.whoUses.gamers.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.whoUses.gamers.description }} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.whoUses.techSupport.title}</h3>
              <p className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: t.whoUses.techSupport.description }} />
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.privacy.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.privacy.intro }} />

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.privacy.localProcessing.title}</h3>
              <p className="text-lg text-gray-700">{t.privacy.localProcessing.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.privacy.noAccount.title}</h3>
              <p className="text-lg text-gray-700">{t.privacy.noAccount.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.privacy.transparent.title}</h3>
              <p className="text-lg text-gray-700">{t.privacy.transparent.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.privacy.cleanup.title}</h3>
              <p className="text-lg text-gray-700">{t.privacy.cleanup.description}</p>
            </div>
          </div>
        </section>

        {/* Compatibility Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.compatibility.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.compatibility.intro }} />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.compatibility.browsersTitle}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.compatibility.browsers.map((browser, index) => (
                  <li key={index}>{browser}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.compatibility.devicesTitle}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.compatibility.devices.map((device, index) => (
                  <li key={index}>{device}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.troubleshooting.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t.troubleshooting.intro }} />

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.cameraTitle}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.cameraIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t.troubleshooting.microphoneTitle}</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700">
                {t.troubleshooting.microphoneIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Internal Links Footer */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.quickLinks.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.quickLinks.webcamTitle}</h3>
              <div className="flex flex-wrap gap-2">
                {t.quickLinks.webcamLinks.map((link, index) => (
                  <span key={index}>
                    <Link href={`/${lang}/free-webcam-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{link}</Link>
                    {index < t.quickLinks.webcamLinks.length - 1 && <span className="text-gray-300 ml-2">|</span>}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.quickLinks.microphoneTitle}</h3>
              <div className="flex flex-wrap gap-2">
                {t.quickLinks.microphoneLinks.map((link, index) => (
                  <span key={index}>
                    <Link href={`/${lang}/free-microphone-test`} className="text-indigo-600 hover:text-indigo-800 hover:underline">{link}</Link>
                    {index < t.quickLinks.microphoneLinks.length - 1 && <span className="text-gray-300 ml-2">|</span>}
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
