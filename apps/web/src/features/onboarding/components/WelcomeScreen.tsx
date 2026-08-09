"use client";

import Link from 'next/link';
import { ArrowLeft, Headphones, Search, Sparkles } from 'lucide-react';
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts';
import { Button, ContentArtwork, EmptyState, ErrorState, LoadingState, MediaCard, PageContainer } from '@/components/design-system';

export function WelcomeScreen() {
  const podcastsQuery = usePodcasts({ page: 1, limit: 3, sort: 'newest' });
  const podcasts = (podcastsQuery.data?.data ?? []).filter((podcast) => podcast.id && podcast.title).slice(0, 3);

  return (
    <main className="w-full bg-surface-canvas">
      <PageContainer>
        <section aria-labelledby="welcome-heading" className="grid min-h-[calc(100vh-8rem)] items-center gap-8 py-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-16">
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <div className="flex items-center gap-3 text-accent">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-radius-12 border border-accent/20 bg-accent/10">
                <Headphones className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold tracking-wide">CASTAMINOFEN</span>
            </div>

            <div className="max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-accent"><Sparkles className="h-4 w-4" aria-hidden="true" />برای شروع، کشف صداهای تازه</p>
              <h1 id="welcome-heading" className="text-display text-text-primary sm:text-4xl lg:text-5xl">
                شروعی ساده برای کشف و شنیدن پادکست‌های مورد علاقه‌ات
              </h1>
              <p className="max-w-xl text-body-lg text-text-secondary sm:text-lg">
                پادکست‌هایی را پیدا کن که با حال‌وهوایت همراه می‌شوند و شنیدن را با تمرکز و آرامش شروع کن.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-start">
              <Link href="/login" className="button button-primary min-h-12 justify-center px-6 text-base motion-reduce:transition-none sm:w-auto">
                شروع کردن
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/podcasts" className="button button-secondary min-h-12 justify-center text-sm font-medium motion-reduce:transition-none sm:w-auto" aria-label="کشف پادکست‌ها">
                کشف پادکست‌ها
              </Link>
            </div>

            <div className="flex max-w-lg items-center gap-3 border-t border-border/70 pt-5 text-start">
              <Search className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <p className="text-body-sm text-text-secondary">اینجا برای کشف و شنیدن پادکست‌هاست؛ بدون شلوغی و حواس‌پرتی.</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-radius-24 border border-border bg-surface-secondary p-3 shadow-soft sm:p-4">
              <div className="aspect-[4/5] overflow-hidden rounded-radius-20 bg-surface-primary sm:aspect-square">
                {podcasts[0]?.artworkUrl ? (
                  <ContentArtwork src={podcasts[0].artworkUrl} alt={podcasts[0].title} ratio="portrait" className="h-full w-full rounded-radius-20 border-0 shadow-none" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-card text-accent">
                    <Headphones className="h-16 w-16" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="absolute inset-x-7 bottom-7 rounded-radius-16 border border-border bg-surface-primary/95 p-4 shadow-soft backdrop-blur sm:inset-x-8 sm:bottom-8">
                <p className="text-caption font-medium text-accent">صدای تازه برای شروع</p>
                <p className="mt-1 line-clamp-2 text-lg font-semibold text-text-primary">{podcasts[0]?.title || 'پادکست‌های واقعی، همین حالا در دسترس'}</p>
                <p className="mt-2 text-sm text-text-secondary">از یک اپیزود شروع کن و مسیر شنیدن خودت را پیدا کن.</p>
              </div>
            </div>
          </div>
        </section>

      <section aria-labelledby="public-content-heading" className="pb-12 sm:pb-16">
        <div className="border-t border-border/70 pt-8 sm:pt-10">
          <p className="text-sm font-medium text-accent">کشف کن</p>
          <h2 id="public-content-heading" className="mt-2 text-heading text-text-primary">پادکست‌هایی برای شروع</h2>

          {podcastsQuery.isLoading ? (
            <div className="mt-5" aria-label="در حال بارگذاری پادکست‌ها">
              <LoadingState variant="section" title="در حال آماده‌سازی کشف" message="پادکست‌های عمومی در حال بارگذاری هستند." />
            </div>
          ) : podcastsQuery.isError ? (
            <ErrorState className="mt-5" kind="network" title="پادکست‌ها بارگذاری نشدند" message="بارگذاری پادکست‌ها ممکن نشد. می‌توانی دوباره تلاش کنی یا همهٔ پادکست‌ها را ببینی." action={<><Button variant="secondary" size="md" className="min-h-11" onClick={() => void podcastsQuery.refetch()}>تلاش دوباره</Button><Link href="/podcasts" className="button button-ghost min-h-11 justify-center">رفتن به کشف پادکست‌ها</Link></>} />
          ) : podcasts.length ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {podcasts.map((podcast) => (
                <MediaCard key={podcast.id} title={podcast.title} subtitle={podcast.description} artwork={<ContentArtwork src={podcast.artworkUrl} alt={podcast.title} ratio="landscape" />}>
                  <Link href={`/podcasts/${podcast.id}`} className="button button-secondary min-h-11 w-full justify-center text-sm" aria-label={`${podcast.title}، باز کردن پادکست`}>
                    باز کردن پادکست
                  </Link>
                </MediaCard>
              ))}
            </div>
          ) : (
            <EmptyState className="mt-5" category="no-items" title="در حال حاضر پادکست عمومی برای نمایش در دسترس نیست" description="برای شروع می‌توانی وارد حساب شوی یا فهرست پادکست‌ها را ببینی." action={<><Link href="/login" className="button button-primary min-h-11 justify-center">شروع کردن</Link><Link href="/podcasts" className="button button-secondary min-h-11 justify-center">کشف پادکست‌ها</Link></>} />
          )}
        </div>
      </section>
      </PageContainer>
    </main>
  );
}

export default WelcomeScreen;
