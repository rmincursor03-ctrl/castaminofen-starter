'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import { useSession } from '@/lib/auth';
import { useContinueListening } from '@/features/library/hooks/useContinueListening';
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts';
import { useQuery } from '@tanstack/react-query';
import { getEpisodes } from '@/lib/episodes';
import { useAuthStore } from '@/stores/authStore';
import { buildDiscoverySections, getDiscoveryIntroContent } from '../utils/discovery-content';
import { DiscoverySection } from './DiscoverySection';
import { ContinueListeningSection } from '@/features/library/components/ContinueListeningSection';
import { Button, ContentArtwork, ErrorState, LoadingState, PageContainer, PartialState, SectionHeader, Tag } from '@/components/design-system';

export function DiscoveryPage() {
  const { data: sessionData } = useSession();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const podcastsQuery = usePodcasts({ page: 1, limit: 6, sort: 'newest' });
  const episodesQuery = useQuery({
    queryKey: ['discovery', 'episodes'],
    queryFn: () => getEpisodes({ search: '' }),
    staleTime: 1000 * 30,
  });
  const continueListeningQuery = useContinueListening();
  const hasSession = Boolean(sessionData || isAuthenticated);
  const introContent = useMemo(() => getDiscoveryIntroContent({ isAuthenticated: hasSession }), [hasSession]);
  const sections = useMemo(() => buildDiscoverySections({
    podcasts: podcastsQuery.data?.data ?? [],
    episodes: episodesQuery.data ?? [],
    continueListeningCount: continueListeningQuery.data?.length ?? 0,
    isAuthenticated: hasSession,
  }), [continueListeningQuery.data?.length, episodesQuery.data, hasSession, podcastsQuery.data?.data]);
  const featuredPodcast = podcastsQuery.data?.data?.[0];
  const hasFatalCatalogError = podcastsQuery.isError && episodesQuery.isError;
  const hasPartialData = podcastsQuery.isError || episodesQuery.isError || continueListeningQuery.isError;
  const retryDiscovery = () => {
    void podcastsQuery.refetch();
    void episodesQuery.refetch();
    void continueListeningQuery.refetch();
  };

  if (podcastsQuery.isLoading || episodesQuery.isLoading) {
    return <main className="page-container"><PageContainer><LoadingState title="در حال آماده‌سازی کشف" message="پادکست‌ها و اپیزودهای تازه در حال بارگذاری هستند." /></PageContainer></main>;
  }

  if (hasFatalCatalogError) {
    return <main className="page-container"><PageContainer><ErrorState kind="network" title="کشف محتوا ممکن نشد" message="پادکست‌ها و اپیزودهای این صفحه بارگذاری نشدند." action={<Button variant="secondary" onClick={retryDiscovery}>تلاش دوباره</Button>} /></PageContainer></main>;
  }

  return (
    <main className="page-container" aria-labelledby="discovery-heading">
      <PageContainer>
        <div className="space-y-10 py-3 sm:space-y-12 sm:py-5">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Tag className="w-fit border-accent/20 bg-accent/10 text-accent"><Compass className="h-4 w-4" aria-hidden="true" />کشف</Tag>
              <h1 id="discovery-heading" className="text-heading">از همینجا، مسیر بعدیِ شنیداری‌ات را انتخاب کن</h1>
              <p className="m-0 text-body">Castaminofen کار را از کشف ساده شروع می‌کند و با ادامه‌ی گوش دادن، ذخیره‌ی لحظه و بازگشتِ هدفمند، مسیر را برایت روشن‌تر می‌کند.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/podcasts" className="inline-flex"><Button variant="secondary" className="min-h-11">مرور پادکست‌ها</Button></Link>
              <Link href="/library" className="inline-flex"><Button variant="primary" className="min-h-11 gap-2">باز کردن کتابخانه<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
            </div>
          </header>

          {hasPartialData ? <PartialState description="بخشی از داده‌های کشف در دسترس نیست؛ محتوای موجود همچنان واقعی و قابل استفاده است." action={<Button variant="ghost" size="sm" onClick={retryDiscovery}>تلاش دوباره</Button>} /> : null}

          {featuredPodcast ? (
            <section className="grid overflow-hidden rounded-radius-24 border border-border bg-surface-secondary shadow-soft lg:grid-cols-[1.05fr_0.95fr]" aria-labelledby="featured-discovery-heading">
              <div className="order-2 flex flex-col justify-between gap-8 p-5 sm:p-8 lg:order-1 lg:p-10">
                <div className="space-y-4">
                  <Tag className="w-fit border-accent/20 bg-accent/10 text-accent"><Sparkles className="h-4 w-4" aria-hidden="true" />تمرکز امروز</Tag>
                  <h2 id="featured-discovery-heading" className="text-2xl font-semibold leading-tight text-text-primary sm:text-3xl">{featuredPodcast.title}</h2>
                  <p className="max-w-xl text-base leading-8 text-text-secondary">{featuredPodcast.description || 'یک پادکست واقعی از فهرست تازه برای شروع گوش دادن.'}</p>
                  <p className="text-sm text-text-secondary">پادکست منتخب از محتوای موجود در کاتالوگ عمومی</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/podcasts/${featuredPodcast.id}`} className="inline-flex"><Button variant="primary" className="min-h-11 gap-2">باز کردن پادکست<ArrowLeft className="h-4 w-4" aria-hidden="true" /></Button></Link>
                  <Link href="/podcasts" className="inline-flex"><Button variant="ghost" className="min-h-11">دیدن همه پادکست‌ها</Button></Link>
                </div>
              </div>
              <div className="order-1 min-h-[18rem] bg-surface-primary p-3 sm:p-4 lg:order-2 lg:min-h-full">
                <ContentArtwork src={featuredPodcast.artworkUrl} alt={featuredPodcast.title} ratio="landscape" className="h-full min-h-[18rem] w-full rounded-radius-20 border-0 shadow-none lg:min-h-[25rem]" />
              </div>
            </section>
          ) : (
            <section className="rounded-radius-24 border border-border bg-surface-secondary p-5 sm:p-8" aria-labelledby="discovery-start-heading">
              <SectionHeader eyebrow={introContent.eyebrow} title={introContent.title} description={introContent.description} />
              <p id="discovery-start-heading" className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">{introContent.supportingText}</p>
            </section>
          )}

          <div className="space-y-6">
            {continueListeningQuery.data?.length ? <ContinueListeningSection items={continueListeningQuery.data} /> : null}
            {sections.map((section) => <DiscoverySection key={section.id} section={section} />)}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}