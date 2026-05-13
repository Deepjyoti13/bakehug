'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#menu', label: 'Menu' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
      scrolled
        ? 'bg-warm-50/95 dark:bg-warm-900/95 backdrop-blur-md border-warm-200 dark:border-warm-800 shadow-sm'
        : 'bg-warm-50 dark:bg-warm-900 border-warm-200/60 dark:border-warm-900'
    }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image src="/logo.png" alt="BakeHug" width={120} height={48} className="h-11 w-auto object-contain" priority />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="relative group text-[13px] font-medium text-warm-700 dark:text-warm-300 hover:text-warm-500 dark:hover:text-warm-500 transition-colors">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-warm-500 group-hover:w-full transition-all duration-250 ease-out rounded-full" />
              </Link>
            ))}
            <div className="w-px h-4 bg-warm-200 dark:bg-warm-700" />
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button onClick={() => setOpen(!open)} aria-label="Menu"
              className="w-8 h-8 flex flex-col items-center justify-center gap-[5px]">
              <span className={`block w-5 h-[1.5px] bg-warm-700 dark:bg-warm-200 rounded-full transition-all duration-250 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-warm-700 dark:bg-warm-200 rounded-full transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-warm-700 dark:bg-warm-200 rounded-full transition-all duration-250 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-warm-200 dark:border-warm-800 bg-warm-50 dark:bg-warm-900 px-5 py-5 space-y-4">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm font-medium text-warm-700 dark:text-warm-300 hover:text-warm-500 dark:hover:text-warm-500 transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
