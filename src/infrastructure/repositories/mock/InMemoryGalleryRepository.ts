import type { IGalleryRepository } from '@/domain/ports/IGalleryRepository'
import type { GalleryItem } from '@/domain/entities/GalleryItem'

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gallery-guardian-x9',
    productId: 'f17-elite',
    productName: 'Hiwei Guardian X9',
    description: 'Flagship triple-channel protection with AI processing.',
    specBadges: ['4K Ultra HD', '3-Cam System', 'ADAS 2.0'],
    highlightBadge: '24G Radar',
    cameraPositions: ['frontal', 'trasera', 'interior'],
    layout: 'featured',
    displayOrder: 1,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/triple-cobertura/',
    videos: [
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Night City Drive',
        cameraPosition: 'frontal',
        durationSeconds: 260,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Highway Rear View',
        cameraPosition: 'trasera',
        durationSeconds: 195,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Interior Monitoring',
        cameraPosition: 'interior',
        durationSeconds: 180,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
    ],
  },
  {
    id: 'gallery-slim-s2',
    productId: 'f7np',
    productName: 'Hiwei Slim S2',
    description: 'Stealth dual-channel setup for sleek interiors.',
    specBadges: ['2K QHD', '2-Cam'],
    cameraPositions: ['frontal', 'trasera'],
    layout: 'compact',
    displayOrder: 2,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/f7np/',
    videos: [
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Rainy Highway',
        cameraPosition: 'frontal',
        durationSeconds: 215,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Rear Parking',
        cameraPosition: 'trasera',
        durationSeconds: 150,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
    ],
  },
  {
    id: 'gallery-lite-dash',
    productId: 'radares-full-hd',
    productName: 'Hiwei Lite Dash',
    description: 'Essential security for every driver.',
    specBadges: ['1080p FHD', 'Single Channel', 'Night Vision'],
    cameraPositions: ['frontal'],
    layout: 'wide',
    displayOrder: 3,
    ecommerceUrl: 'https://www.hiwei.com.ar/productos/anti-radares-full-hd-preventa-exclusiva/',
    videos: [
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Daytime Performance',
        cameraPosition: 'frontal',
        durationSeconds: 240,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
      {
        youtubeId: 'dQw4w9WgXcQ',
        label: 'Low Light Sensitivity',
        cameraPosition: 'frontal',
        durationSeconds: 185,
        thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      },
    ],
  },
]

export class InMemoryGalleryRepository implements IGalleryRepository {
  async getAll(): Promise<GalleryItem[]> {
    return Promise.resolve(GALLERY_ITEMS)
  }
}
