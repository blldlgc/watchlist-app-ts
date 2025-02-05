export interface WatchlistItem {
  id: string;
  tmdbId: number;
  title: string;
  posterPath: string;
  mediaType: 'movie' | 'tv';
  addedAt: Date;
}

export interface Watchlist {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  sharedWith: string[];
  items: WatchlistItem[];
  createdAt: Date;
  updatedAt: Date;
} 