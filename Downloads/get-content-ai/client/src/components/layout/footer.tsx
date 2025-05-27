import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="/about" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">About</Link>
            <Link href="/help" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Help</Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">Terms</Link>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Get Content AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
