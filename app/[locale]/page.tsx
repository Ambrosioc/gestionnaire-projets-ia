import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6" />
          <span className="ml-2 text-lg font-semibold">AI Project Manager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            {t('auth.login')}
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            {t('auth.register')}
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Projects with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your freelance workflow with AI-powered project management. Get smart task suggestions,
                  automated summaries, and intelligent prioritization.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button>{t('auth.register')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-center">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Sparkles className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get intelligent task suggestions and project insights powered by AI.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <CheckCircle className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Smart Task Management</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Organize and prioritize tasks with AI-assisted categorization.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Clock className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Time Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track project progress and get automated time management insights.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 AI Project Manager. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}