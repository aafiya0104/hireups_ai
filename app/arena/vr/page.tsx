'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, Maximize2, Sparkles, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const FRAME_VR_URL = 'https://framevr.io/mantasha';

export default function ArenaVRPage() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/arena" className="text-zinc-400 hover:text-white transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">CP Arena Space</p>
              <h1 className="text-xl md:text-2xl font-bold truncate">Frame VR Study Room</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Embedded in Arena
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h2 className="font-semibold">Why this room exists</h2>
            </div>
            <p className="text-sm text-zinc-400 leading-6">
              This space stays inside CP Arena so the study room feels like part of the product instead of a separate website.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
            <h2 className="font-semibold">Room actions</h2>
            <a
              href={FRAME_VR_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Open in new tab <ExternalLink className="w-4 h-4" />
            </a>
            <div className="text-xs text-zinc-500 leading-5">
              If the embedded room is blocked by the browser or the external site, use the button above as fallback.
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-semibold mb-3">How to use</h2>
            <ol className="space-y-2 text-sm text-zinc-400 list-decimal pl-5 leading-6">
              <li>Enter the room from the embedded panel.</li>
              <li>Coordinate mock interviews or problem-solving sessions.</li>
              <li>Keep the contest tab open if you’re coming from a lobby.</li>
            </ol>
          </div>
        </aside>

        <section className="min-h-[78vh] rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl shadow-cyan-950/20">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3 bg-zinc-950/80">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Maximize2 className="w-4 h-4 text-cyan-300" />
              Live embedded room
            </div>
            <div className="text-xs text-zinc-500">
              {loaded ? 'Connected' : 'Loading room...'}
            </div>
          </div>

          <div className="relative h-[calc(100%-49px)] bg-zinc-950">
            {!loaded && !failed && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/95 z-10">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-full bg-cyan-500/30" />
                  <p className="text-sm text-zinc-400">Loading Frame VR room inside CP Arena...</p>
                </div>
              </div>
            )}

            {failed ? (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div className="max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                  <h3 className="text-lg font-semibold mb-2">Embedded room unavailable</h3>
                  <p className="text-sm text-zinc-400 mb-4">
                    The external site appears to block iframe embedding in this browser. Use the fallback open button to continue.
                  </p>
                  <a
                    href={FRAME_VR_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-zinc-950 transition hover:bg-cyan-400"
                  >
                    Open Frame VR <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                title="Frame VR Study Room"
                src={FRAME_VR_URL}
                className="h-full w-full"
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
                allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-read; clipboard-write"
                sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads"
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
