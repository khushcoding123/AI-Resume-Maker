'use client'

import Link from 'next/link'
import {
  FiCheckCircle,
  FiClock,
  FiLayout,
  FiShield,
  FiZap,
} from 'react-icons/fi'

const features = [
  {
    icon: <FiZap />,
    title: 'AI Writing Assistance',
    description:
      'Generate tailored summaries, bullets, and job-specific phrasing in seconds.',
  },
  {
    icon: <FiLayout />,
    title: 'Elegant Templates',
    description:
      'Switch across modern, classic, and creative layouts without touching design tools.',
  },
  {
    icon: <FiShield />,
    title: 'ATS-Ready Output',
    description:
      'Built-in ATS scoring highlights gaps so your resume gets seen by recruiters.',
  },
]

const steps = [
  {
    title: 'Tell us about you',
    description:
      'Fill in your experience, education, and skills through guided sections.',
  },
  {
    title: 'Let AI polish it',
    description:
      'Use the AI Assistant and Agent to tailor copy, expand bullets, or match a job description.',
  },
  {
    title: 'Export & Apply',
    description:
      'Download a polished PDF instantly or keep iterating with live preview tweaks.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-40">
          <div className="h-64 w-64 rounded-full bg-primary-200/60 blur-3xl" />
        </div>

        <header className="container mx-auto flex items-center justify-between px-4 py-6">
          <p className="text-2xl font-bold text-primary-700">AI Resume Maker</p>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <Link href="#features" className="hover:text-gray-900">
              Product
            </Link>
            <Link href="#how-it-works" className="hover:text-gray-900">
              How it works
            </Link>
            <Link
              href="/builder"
              className="rounded-full bg-primary-600 px-4 py-2 text-white transition hover:bg-primary-700"
            >
              Launch Builder
            </Link>
          </div>
        </header>

        <section className="container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700">
              <FiCheckCircle /> The fastest path to a standout resume
            </span>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Craft a memorable resume with AI guidance and instant previews.
            </h1>
            <p className="text-lg text-gray-600">
              From first draft to final PDF, every part of the experience stays
              in one clean workspace. No templates to wrestle with, no blank
              page dread—just focused writing assisted by smart tooling.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/builder"
                className="rounded-full bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-primary-700"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="rounded-full border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 transition hover:border-primary-200 hover:text-primary-700"
              >
                See Features
              </a>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <div>
                <p className="text-3xl font-bold text-gray-900">5,000+</p>
                <p>Resumes created</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">2 min</p>
                <p>Average to first draft</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">98%</p>
                <p>ATS compatibility</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-200 via-white to-primary-50 blur-2xl" />
            <div className="relative rounded-3xl border border-white/50 bg-white/90 p-6 shadow-2xl backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    LIVE PREVIEW
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    Modern Template
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Ready to export
                </span>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900">
                    Sofia Patel
                  </p>
                  <p>Product Designer · Seattle, WA</p>
                  <p className="mt-2 text-gray-500">
                    Blends research, delightful experiences, and systems
                    thinking to ship software loved by millions.
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500">
                    EXPERIENCE
                  </p>
                  <p className="font-semibold text-gray-900">
                    Lead Product Designer · StatusHQ
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      Defined AI-powered job workflows that improved recruiter
                      response rates by 38%.
                    </li>
                    <li>
                      Partnered with PMs to roll out a refreshed design system
                      across 4 product surfaces.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        id="features"
        className="container mx-auto grid gap-6 px-4 py-16 md:grid-cols-3"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-md"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section
        id="how-it-works"
        className="bg-gray-50 py-16 text-gray-900 shadow-inner"
      >
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase text-primary-600">
              How it works
            </p>
            <h2 className="text-3xl font-bold">
              Build confidently in three simple steps
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <span className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-lg font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-16 lg:grid-cols-2">
        <div className="rounded-3xl border border-primary-100 bg-primary-50/60 p-8">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-700">
            <FiClock /> Built for speed
          </div>
          <h3 className="text-3xl font-bold text-primary-900">
            Launch to offer faster with workflow superpowers.
          </h3>
          <p className="mt-4 text-base text-primary-800">
            The editor, preview, templates, and AI guidance all live side by
            side so you can see every change in real time. Switch contexts less,
            do your best work more.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-primary-900">
            <li className="flex items-start gap-3">
              <FiCheckCircle className="mt-1 text-primary-600" />
              ATS score tracker with actionable feedback.
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="mt-1 text-primary-600" />
              AI Agent chat to apply bigger edits across the resume.
            </li>
            <li className="flex items-start gap-3">
              <FiCheckCircle className="mt-1 text-primary-600" />
              One-click PDF export with print-perfect typography.
            </li>
          </ul>
          <div className="mt-8">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-8 py-3 text-white shadow-lg transition hover:bg-primary-700"
            >
              Get Started
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900">
            Why people choose AI Resume Maker
          </h3>
          <div className="mt-6 space-y-6 text-sm text-gray-600">
            <blockquote className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              “The Get Started button whisked me into the builder instantly. I
              finished a whole resume in a single sitting and the AI Agent fixed
              my tone to match PM roles.”
              <p className="mt-3 font-semibold text-gray-900">
                — Maya Chen, Product Manager
              </p>
            </blockquote>
            <blockquote className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              “Having the editor and preview side by side with ATS scoring is
              game-changing. The UI feels consistent from the homepage to the
              builder, which keeps me focused.”
              <p className="mt-3 font-semibold text-gray-900">
                — Devin Moore, Software Engineer
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-8 text-sm text-gray-500">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4">
          <p>© {new Date().getFullYear()} AI Resume Maker. All rights reserved.</p>
          <Link
            href="/builder"
            className="rounded-full border border-primary-100 px-5 py-2 text-primary-700 transition hover:bg-primary-50"
          >
            Get Started
          </Link>
        </div>
      </footer>
    </main>
  )
}
