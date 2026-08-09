'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Episode, Podcast } from '@/lib/types';
import type { DiscoverySectionDefinition } from '../utils/discovery-content';
import { ContentArtwork, MediaCard, Tag } from '@/components/design-system';

function isPodcast(item: Podcast | Episode | { id: string; title: string; description: string }): item is Podcast {
  return 'rssUrl' in item;
}

function isEpisode(item: Podcast | Episode | { id: string; title: string; description: string }): item is Episode {
  return 'podcastId' in item;
}

export function DiscoverySection({ section }: { section: DiscoverySectionDefinition }) {
  const Icon = section.icon;

  return (
    <section className="rounded-[1.75rem] border border-border/80 bg-surface-secondary/70 p-4 shadow-soft sm:p-5" aria-labelledby={`${section.id}-heading`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">{section.eyebrow}</p>
          <h2 id={`${section.id}-heading`} className="text-subheading">{section.title}</h2>
          <p className="m-0 text-sm text-text-secondary">{section.description}</p>
        </div>
        {section.actionLabel ? (
          <Link href="/podcasts" className="inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:text-accent/80">
            <span>{section.actionLabel}</span>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {section.mode === 'placeholder' ? (
        <div className="rounded-[1.5rem] border border-dashed border-border/80 bg-surface-primary/90 p-5" role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-text-primary">{section.title}</h3>
              <p className="m-0 text-sm text-text-secondary">{section.placeholder}</p>
            </div>
          </div>
        </div>
      ) : null}

      {section.mode === 'podcasts' && section.items?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {section.items.map((item) => {
            const podcast = isPodcast(item) ? item : null;
            if (!podcast) {
              return null;
            }
            return <MediaCard key={podcast.id} title={podcast.title} subtitle={podcast.description || 'توضیحی برای این پادکست ثبت نشده است.'} artwork={<ContentArtwork src={podcast.artworkUrl} alt={podcast.title} ratio="landscape" />} actions={<Link href={`/podcasts/${podcast.id}`} className="button button-secondary min-h-11 justify-center text-sm" aria-label={`${podcast.title}، باز کردن پادکست`}>باز کردن</Link>} />;
          })}
        </div>
      ) : null}

      {section.mode === 'episodes' && section.items?.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {section.items.map((item) => {
            const episode = isEpisode(item) ? item : null;
            if (!episode) {
              return null;
            }
            return <MediaCard key={episode.id} title={episode.title} subtitle={episode.description || 'بدون توضیح'} meta="اپیزود تازه" actions={<Link href={`/episodes/${episode.id}`} className="button button-ghost min-h-10 justify-center text-sm" aria-label={`${episode.title}، باز کردن اپیزود`}>باز کردن</Link>} />;
          })}
        </div>
      ) : null}

      {section.mode === 'categories' ? (
        <div className="flex flex-wrap gap-2">
          {section.items?.map((item) => (
            <Tag key={item.id} className="border-border bg-surface-primary px-4 py-2 text-sm text-text-primary" title={item.description}>{item.title}</Tag>
          ))}
        </div>
      ) : null}
    </section>
  );
}
