import React from "react";
import {
  ArrowRight,
  Zap,
  Workflow,
  Cloud,
  Code2,
  Mail,
  Github,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Workflow className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">
              Visual Workflow
            </span>
          </div>
          <Link href="/register">
            <button className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Automate Everything</span>
              </div>

              <div className="mb-6">
                <div className="inline-block bg-yellow-400/20 rounded-full px-4 py-2 mb-4">
                  <span className="text-yellow-300 text-5xl font-bold">
                    Go beyond and
                  </span>
                </div>
                <h1 className="text-6xl font-bold leading-tight mb-2">
                  create your space
                </h1>
              </div>

              <p className="text-lg text-gray-400 mb-8 max-w-lg">
                Create automation flows with triggers, data sources, logic
                blocks, and actions. Connect your services and automate your
                daily tasks in minutes.
              </p>

              <Link href="/register">
                <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors text-lg">
                  Get started
                </button>
              </Link>
            </div>

            {/* Right - Space Illustration */}
            <div className="relative h-[600px]">
              {/* Purple waves background */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 500 500" className="w-full h-full">
                  <defs>
                    <linearGradient
                      id="purpleGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>

                  {/* Layered waves */}
                  <path
                    d="M 450 50 Q 400 100 350 150 Q 300 200 250 250 Q 200 300 150 350 Q 100 400 50 450 L 500 450 L 500 0 Z"
                    fill="url(#purpleGrad)"
                    opacity="0.4"
                  />
                  <path
                    d="M 480 80 Q 430 130 380 180 Q 330 230 280 280 Q 230 330 180 380 Q 130 430 80 480 L 500 480 L 500 30 Z"
                    fill="url(#purpleGrad)"
                    opacity="0.5"
                  />
                  <path
                    d="M 500 100 Q 450 150 400 200 Q 350 250 300 300 Q 250 350 200 400 Q 150 450 100 500 L 500 500 L 500 50 Z"
                    fill="url(#purpleGrad)"
                    opacity="0.6"
                  />
                </svg>
              </div>

              {/* Central planet with rings */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 shadow-2xl">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400/50 to-transparent"></div>
                  </div>
                  {/* Ring */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-24">
                    <div
                      className="w-full h-full rounded-full border-8 border-cyan-400/60 transform rotate-12"
                      style={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)" }}
                    ></div>
                    <div
                      className="absolute inset-0 w-full h-full rounded-full border-4 border-cyan-300/40 transform rotate-12"
                      style={{ margin: "4px" }}
                    ></div>
                  </div>
                </div>

                {/* Glowing star behind planet */}
                <div className="absolute -top-20 -left-20 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -top-16 -left-16 w-24 h-24 bg-yellow-300 rounded-full blur-2xl opacity-70"></div>
              </div>

              {/* Floating planets/moons */}
              <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-purple-600 shadow-lg"></div>
              <div className="absolute top-40 right-32 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg"></div>
              <div className="absolute top-60 right-16 w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg"></div>
              <div className="absolute bottom-32 right-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg"></div>
              <div className="absolute top-32 right-48 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-600 shadow-lg"></div>

              {/* Stats */}
              <div className="absolute top-16 right-8 text-right">
                <div className="text-5xl font-bold text-white mb-1">256B+</div>
                <div className="text-sm text-gray-400">
                  Lorem ipsum dolor sit
                </div>
              </div>
              <div className="absolute bottom-24 right-8 text-right">
                <div className="text-5xl font-bold text-white mb-1">986K+</div>
                <div className="text-sm text-gray-400">
                  Lorem ipsum dolor sit
                </div>
              </div>

              {/* Small stars */}
              <div className="absolute top-32 right-64 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <div
                className="absolute bottom-40 right-72 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Visual Builder",
                desc: "Drag and drop nodes to create workflows. Connect triggers, data sources, logic, and actions visually.",
              },
              {
                icon: <Cloud className="w-6 h-6" />,
                title: "Data Integration",
                desc: "Connect to weather APIs, GitHub, calendars, and custom HTTP endpoints to fetch data.",
              },
              {
                icon: <Code2 className="w-6 h-6" />,
                title: "Smart Execution",
                desc: "Execute workflows with intelligent data flow, error handling, and conditional logic.",
              },
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Daily Briefing",
                desc: "Combine weather data, calendar events, and reminders into a daily email/SMS briefing.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-4 text-white">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Automate?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg">
              Start building your first workflow today. No credit card required.
            </p>
            <Link href="/register">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-400">
          <p>
            Visual Workflow Builder - Create powerful automations without code
          </p>
        </div>
      </footer>
    </div>
  );
}
