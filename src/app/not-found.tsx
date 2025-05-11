'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Home, RefreshCw, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate loading when clicking "Try Again"
  const handleTryAgain = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Random glitch effect for the 404 text
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchOffset({
          x: Math.random() * 10 - 5,
          y: Math.random() * 10 - 5,
        });
        setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 200);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="mx-auto w-full max-w-lg">
        <div className="relative flex flex-col gap-8 overflow-hidden p-6 md:flex-row">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full blur-3xl" />
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full blur-3xl" />

          {/* Not Found Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 flex max-w-md flex-col justify-center"
          >
            <div className="relative mb-6">
              <motion.div
                style={{ x: glitchOffset.x, y: glitchOffset.y }}
                className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-8xl font-bold text-transparent"
              >
                404
              </motion.div>
              <motion.div
                style={{ x: -glitchOffset.x, y: -glitchOffset.y }}
                className="absolute top-0 left-1 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-8xl font-bold text-transparent opacity-50"
              >
                404
              </motion.div>
              <div className="absolute -top-1 -left-1 text-8xl font-bold text-zinc-800">404</div>
            </div>

            <h1 className="mb-3 text-3xl font-bold text-white">Oops! Page Not Found</h1>
            <p className="mb-6 text-lg text-zinc-400">The post you&apos;re looking for seems to have vanished into the digital void.</p>

            <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600">
                  <span className="font-medium text-white">S</span>
                </div>
                <div>
                  <p className="font-medium text-white">Socially</p>
                  <p className="text-xs text-zinc-500">@socially • just now</p>
                </div>
              </div>
              <p className="text-zinc-300">Looking for something? Try searching or check your URL.</p>

              <div className="relative mt-4">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <Search className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search Socially..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-zinc-700 bg-zinc-800 py-2 pr-4 pl-10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="border-none bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg shadow-purple-900/20 hover:from-purple-500 hover:to-purple-600"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>

              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-700/50"
                onClick={handleTryAgain}
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Trying...' : 'Try Again'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
