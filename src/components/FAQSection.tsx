'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/getDictionary';

interface FAQSectionProps {
  dictionary: Dictionary;
}

export function FAQSection({ dictionary }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: dictionary.home.faq.q1.question, a: dictionary.home.faq.q1.answer },
    { q: dictionary.home.faq.q2.question, a: dictionary.home.faq.q2.answer },
    { q: dictionary.home.faq.q3.question, a: dictionary.home.faq.q3.answer },
    { q: dictionary.home.faq.q4.question, a: dictionary.home.faq.q4.answer },
    { q: dictionary.home.faq.q5.question, a: dictionary.home.faq.q5.answer },
    { q: dictionary.home.faq.q6.question, a: dictionary.home.faq.q6.answer },
    { q: dictionary.home.faq.q7.question, a: dictionary.home.faq.q7.answer },
    { q: dictionary.home.faq.q8.question, a: dictionary.home.faq.q8.answer },
    { q: dictionary.home.faq.q9.question, a: dictionary.home.faq.q9.answer },
    { q: dictionary.home.faq.q10.question, a: dictionary.home.faq.q10.answer },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {dictionary.home.faq.title}
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-gray-600 bg-gray-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
