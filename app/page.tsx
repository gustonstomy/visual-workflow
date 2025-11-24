import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Workflow,
  CloudIcon,
  Code2,
  Mail,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Workflow className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">
              Visual Workflow
            </span>
          </div>
          <Link href="/workflows">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Automate Everything</span>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Build Powerful Workflows
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Without Writing Code
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Create automation flows with triggers, data sources, logic blocks,
            and actions. Connect your services and automate your daily tasks in
            minutes.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/workflows">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                Create Your First Workflow
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Visual Builder</CardTitle>
              <CardDescription className="text-slate-400">
                Drag and drop nodes to create workflows. Connect triggers, data
                sources, logic, and actions visually.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <CloudIcon className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Data Integration</CardTitle>
              <CardDescription className="text-slate-400">
                Connect to weather APIs, GitHub, calendars, and custom HTTP
                endpoints to fetch data.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-white">Smart Execution</CardTitle>
              <CardDescription className="text-slate-400">
                Execute workflows with intelligent data flow, error handling,
                and conditional logic.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Example Use Cases
          </h2>
          <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            Build workflows for daily briefings, social media automation, GitHub
            digests, and more
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 text-purple-400" />
                  <CardTitle className="text-white">Daily Briefing</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                  Combine weather data, calendar events, and reminders into a
                  daily email/SMS briefing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-400">
                  Schedule → Weather → Calendar → Email
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Github className="w-8 h-8 text-blue-400" />
                  <CardTitle className="text-white">GitHub Digest</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                  Generate weekly summaries of commits, issues, and PRs across
                  your projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-400">
                  Schedule → GitHub → Transform → Email
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Automate?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Start building your first workflow today. No credit card required.
          </p>
          <Link href="/workflows">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-slate-400">
          <p>
            Visual Workflow Builder - Create powerful automations without code
          </p>
        </div>
      </footer>
    </div>
  );
}
