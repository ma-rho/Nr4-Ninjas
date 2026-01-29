export type Event = {
  id: string;
  name: string;
  slug: string;
  date: string;
  location: string;
  description: string;
  artwork: string; // image id from placeholder-images.json
  ticketUrl: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  image: string; // image id from placeholder-images.json
};

export type DJ = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  profilePicture: string; // image id
  gallery: string[]; // image ids
  socials: {
    instagram?: string;
    tiktok?: string;
    soundcloud?: string;
  };
};
