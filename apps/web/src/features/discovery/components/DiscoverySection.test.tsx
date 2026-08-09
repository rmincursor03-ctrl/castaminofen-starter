import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Podcast } from '@/lib/types';
import { DiscoverySection } from './DiscoverySection';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt?: string; [key: string]: unknown }) => <div data-artwork-alt={alt ?? ''} {...props} />,
}));

const podcast: Podcast = {
  id: 'podcast-one',
  title: 'یک صدای تازه',
  rssUrl: 'https://example.com/feed.xml',
  description: 'توضیح پادکست',
  artworkUrl: 'https://example.com/artwork.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('DiscoverySection', () => {
  it('renders real podcast items with canonical artwork and native navigation', () => {
    const html = renderToStaticMarkup(<DiscoverySection section={{
      id: 'featured',
      title: 'پادکست‌های منتخب',
      description: 'محتوای واقعی',
      mode: 'podcasts',
      icon: () => null,
      items: [podcast],
    }} />);

    expect(html).toContain('یک صدای تازه');
    expect(html).toContain('data-artwork-alt="یک صدای تازه"');
    expect(html).toContain('href="/podcasts/podcast-one"');
  });

  it('renders categories as compact supporting tags', () => {
    const html = renderToStaticMarkup(<DiscoverySection section={{
      id: 'categories',
      title: 'موضوعات',
      description: 'انتخاب موضوع',
      mode: 'categories',
      icon: () => null,
      items: [{ id: 'culture', title: 'فرهنگ', description: 'هنر و گفتگو' }],
    }} />);

    expect(html).toContain('فرهنگ');
    expect(html).not.toContain('shadow-sm');
  });
});
