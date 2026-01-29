import type { Event, Product, DJ } from './types';

export const events: Event[] = [
  {
    id: '1',
    name: 'Urban Takeover',
    slug: 'urban-takeover',
    date: '2024-08-15T22:00:00Z',
    location: 'Fabric, London',
    description:
      'The biggest urban night in the capital. Get ready for a full takeover with the hottest DJs and special guests.',
    artwork: 'event-art-1',
    ticketUrl: 'https://www.fatsoma.com/nr4-ninjas',
  },
  {
    id: '2',
    name: 'Summer Jam',
    slug: 'summer-jam',
    date: '2024-09-05T21:00:00Z',
    location: 'Waterfront, Norwich',
    description:
      'The annual summer shutdown party. Good vibes, good music, and a night to remember.',
    artwork: 'event-art-2',
    ticketUrl: 'https://www.fatsoma.com/nr4-ninjas',
  },
  {
    id: '3',
    name: 'The Afterparty',
    slug: 'the-afterparty',
    date: '2024-10-12T23:00:00Z',
    location: 'ATIK, Colchester',
    description:
      'Keep the party going. The official afters for the main event. Secret lineup until the night.',
    artwork: 'event-art-3',
    ticketUrl: 'https://www.fatsoma.com/nr4-ninjas',
  },
];

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'NR4 Classic Hoodie',
    price: 45.0,
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'merch-1',
  },
  {
    id: 'prod_2',
    name: 'Ninja Signature Tee',
    price: 25.0,
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'merch-2',
  },
  {
    id: 'prod_3',
    name: 'NR4 Snapback',
    price: 20.0,
    sizes: ['One Size'],
    image: 'merch-3',
  },
];

export const djs: DJ[] = [
  {
    id: 'dj_1',
    name: 'DJ Ace',
    slug: 'dj-ace',
    bio: 'With over a decade of experience, DJ Ace is a master of the craft. Known for his electrifying sets that blend Hip Hop, R&B, and Afrobeats, he knows how to control a crowd and create an unforgettable atmosphere. A true ninja on the decks.',
    profilePicture: 'dj-profile-1',
    gallery: ['dj-gallery-1a', 'dj-gallery-1b'],
    socials: {
      instagram: 'https://instagram.com/djace',
      tiktok: 'https://tiktok.com/@djace',
      soundcloud: 'https://soundcloud.com/djace',
    },
  },
  {
    id: 'dj_2',
    name: 'DJ Blaze',
    slug: 'dj-blaze',
    bio: 'Bringing the fire every single time. DJ Blaze is one of the most exciting new talents on the scene. Her high-energy sets and seamless transitions between Dancehall, UKG, and Drill have made her a crowd favourite. Catch her shutting down a rave near you.',
    profilePicture: 'dj-profile-2',
    gallery: ['dj-gallery-2a', 'dj-gallery-2b'],
    socials: {
      instagram: 'https://instagram.com/djblaze',
      tiktok: 'https://tiktok.com/@djblaze',
    },
  },
  {
    id: 'dj_3',
    name: 'DJ Shadow',
    slug: 'dj-shadow',
    bio: "The silent assassin. DJ Shadow's deep knowledge of classic R&B and Soul, fused with modern trap and hip-hop, creates a unique, smooth vibe. Perfect for late-night sets and setting the mood. Don't sleep on his selections.",
    profilePicture: 'dj-profile-3',
    gallery: ['dj-gallery-3a', 'dj-gallery-3b'],
    socials: {
      instagram: 'https://instagram.com/djshadow',
      soundcloud: 'https://soundcloud.com/djshadow',
    },
  },
];
