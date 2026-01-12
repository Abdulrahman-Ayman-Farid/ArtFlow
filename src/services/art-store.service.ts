import { Injectable, signal, computed } from '@angular/core';

export interface Comment {
  id: string;
  user: string;
  avatarUrl?: string;
  text: string;
  timestamp: Date;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  isFavorite: boolean;
  critique?: string;
  isLoadingCritique?: boolean;
  tags: string[];
  comments: Comment[];
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
}

export type SearchFilter = 'all' | 'title' | 'artist' | 'tags';

@Injectable({
  providedIn: 'root'
})
export class ArtStoreService {
  // Initial seed data
  private readonly initialArt: Artwork[] = [
    {
      id: '1',
      title: 'Neon Solitude',
      artist: 'Elena Void',
      description: 'A cyberpunk vision of loneliness in a crowded city.',
      imageUrl: 'https://picsum.photos/id/237/600/400',
      likes: 124,
      isLiked: false,
      isFavorite: false,
      tags: ['cyberpunk', 'city', 'neon'],
      comments: [
        { 
          id: 'c1', 
          user: 'PixelPioneer', 
          avatarUrl: 'https://picsum.photos/seed/pixelpioneer/50/50',
          text: 'The lighting here is incredible.', 
          timestamp: new Date() 
        }
      ]
    },
    {
      id: '2',
      title: 'Organic Chaos',
      artist: 'Marcus Green',
      description: 'Nature reclaiming the industrial wasteland.',
      imageUrl: 'https://picsum.photos/id/10/600/600',
      likes: 89,
      isLiked: false,
      isFavorite: false,
      tags: ['nature', 'abstract', 'green'],
      comments: []
    },
    {
      id: '3',
      title: 'Geometric Dreams',
      artist: 'Sarah Polygon',
      description: 'Sharp angles meeting soft emotions.',
      imageUrl: 'https://picsum.photos/id/28/600/800',
      likes: 256,
      isLiked: false,
      isFavorite: true,
      tags: ['geometry', 'minimalism', 'shapes'],
      comments: [
        { 
          id: 'c2', 
          user: 'MathArt', 
          avatarUrl: 'https://picsum.photos/seed/mathart/50/50',
          text: 'Perfect usage of the golden ratio.', 
          timestamp: new Date() 
        }
      ]
    },
    {
      id: '4',
      title: 'Silent Waters',
      artist: 'River Song',
      description: 'The calm before the storm on a misty lake.',
      imageUrl: 'https://picsum.photos/id/55/800/600',
      likes: 45,
      isLiked: false,
      isFavorite: false,
      tags: ['landscape', 'water', 'calm'],
      comments: []
    },
     {
      id: '5',
      title: 'Urban Decay',
      artist: 'John Concrete',
      description: 'The beauty found in crumbling walls.',
      imageUrl: 'https://picsum.photos/id/60/600/400',
      likes: 312,
      isLiked: true,
      isFavorite: false,
      tags: ['urban', 'texture', 'architecture'],
      comments: []
    }
  ];

  // State signals
  private artState = signal<Artwork[]>(this.initialArt);
  private searchQueryState = signal<string>('');
  private searchFilterState = signal<SearchFilter>('all');
  private profileState = signal<UserProfile>({
    name: 'Guest Artist',
    bio: 'Art enthusiast and digital creator exploring the boundaries of imagination.',
    avatarUrl: 'https://picsum.photos/id/64/200/200'
  });
  
  // Computed signals
  readonly searchQuery = computed(() => this.searchQueryState());
  readonly searchFilter = computed(() => this.searchFilterState());
  readonly userProfile = computed(() => this.profileState());
  
  readonly artworks = computed(() => {
    const query = this.searchQueryState().toLowerCase().trim();
    const filter = this.searchFilterState();
    const allArt = this.artState();

    if (!query) return allArt;

    return allArt.filter(art => {
      if (filter === 'title') return art.title.toLowerCase().includes(query);
      if (filter === 'artist') return art.artist.toLowerCase().includes(query);
      if (filter === 'tags') return art.tags.some(tag => tag.toLowerCase().includes(query));

      // 'all' case
      return (
        art.title.toLowerCase().includes(query) ||
        art.artist.toLowerCase().includes(query) ||
        art.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  });

  readonly favorites = computed(() => this.artState().filter(a => a.isFavorite));
  readonly favoritesCount = computed(() => this.favorites().length);

  // Actions
  setSearchQuery(query: string) {
    this.searchQueryState.set(query);
  }

  setSearchFilter(filter: SearchFilter) {
    this.searchFilterState.set(filter);
  }

  updateProfile(profile: UserProfile) {
    this.profileState.set(profile);
  }

  toggleLike(id: string) {
    this.artState.update(arts => arts.map(art => {
      if (art.id === id) {
        return {
          ...art,
          isLiked: !art.isLiked,
          likes: art.isLiked ? art.likes - 1 : art.likes + 1
        };
      }
      return art;
    }));
  }

  toggleFavorite(id: string) {
    this.artState.update(arts => arts.map(art => {
      if (art.id === id) {
        return { ...art, isFavorite: !art.isFavorite };
      }
      return art;
    }));
  }

  addArtwork(newArt: Omit<Artwork, 'id' | 'likes' | 'isLiked' | 'isFavorite' | 'comments'>) {
    const art: Artwork = {
      ...newArt,
      id: crypto.randomUUID(),
      likes: 0,
      isLiked: false,
      isFavorite: false,
      comments: []
    };
    this.artState.update(current => [art, ...current]);
  }

  addComment(artId: string, text: string) {
    const profile = this.profileState();
    const newComment: Comment = {
      id: crypto.randomUUID(),
      user: profile.name,
      avatarUrl: profile.avatarUrl,
      text: text,
      timestamp: new Date()
    };

    this.artState.update(arts => arts.map(art => {
      if (art.id === artId) {
        return {
          ...art,
          comments: [...art.comments, newComment]
        };
      }
      return art;
    }));
  }

  updateCritique(id: string, critique: string) {
    this.artState.update(arts => arts.map(art => {
      if (art.id === id) {
        return { ...art, critique, isLoadingCritique: false };
      }
      return art;
    }));
  }

  setLoadingCritique(id: string, isLoading: boolean) {
    this.artState.update(arts => arts.map(art => {
      if (art.id === id) {
        return { ...art, isLoadingCritique: isLoading };
      }
      return art;
    }));
  }
}