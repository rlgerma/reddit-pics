import { RedditSinglePost } from '../components/types';

const FAVORITES_KEY = 'reddit-pics-favorites';

export interface FavoritePost {
  id: string;
  title: string;
  url: string;
  author: string;
  thumbnail?: string;
  permalink?: string;
  ups?: number;
  created_utc?: number;
  all_awardings?: RedditSinglePost['all_awardings'];
}

// Get all favorites from localStorage
export const getFavorites = (): FavoritePost[] => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

// Add a post to favorites
export const addFavorite = (post: RedditSinglePost): void => {
  try {
    const favorites = getFavorites();
    const favoritePost: FavoritePost = {
      id: post.url || `${post.author}-${post.created_utc}`,
      title: post.title || 'No Title',
      url: post.url || '',
      author: post.author || 'Unknown',
      thumbnail: post.thumbnail as string,
      permalink: post.permalink || undefined,
      ups: post.ups,
      created_utc: post.created_utc,
      all_awardings: post.all_awardings,
    };

    // Check if already favorited
    if (!favorites.find((fav) => fav.id === favoritePost.id)) {
      favorites.unshift(favoritePost);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

// Remove a post from favorites
export const removeFavorite = (postId: string): void => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((fav) => fav.id !== postId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

// Check if a post is favorited
export const isFavorite = (postId: string): boolean => {
  try {
    const favorites = getFavorites();
    return favorites.some((fav) => fav.id === postId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// Clear all favorites
export const clearFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};
