import { Instagram, Facebook } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500">© 2026 Acme Supply Co. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com/acme" aria-label="Instagram">
            <Instagram className="size-5" aria-hidden="true" />
          </a>
          <a href="https://facebook.com/acme" aria-label="Facebook">
            <Facebook className="size-5" aria-hidden="true" />
          </a>
          <a href="mailto:hello@acme.test" className="text-sm underline underline-offset-4">
            hello@acme.test
          </a>
        </div>
      </div>
    </footer>
  );
}
