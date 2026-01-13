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
  isLiked: boolean; // In a real app, this would depend on the userId
  isFavorite: boolean; // In a real app, this would depend on the userId
  critique?: string;
  isLoadingCritique?: boolean;
  tags: string[];
  comments: Comment[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  joinedDate: Date;
  password?: string; // In a real app, never store plain text
}

export type SearchFilter = 'all' | 'title' | 'artist' | 'tags';

@Injectable({
  providedIn: 'root'
})
export class ArtStoreService {
  // Mock Database
  private users: User[] = [
    {
      id: 'u1',
      email: 'demo@artflow.com',
      password: 'password',
      name: 'Demo Artist',
      bio: 'I love creating digital landscapes.',
      avatarUrl: 'https://picsum.photos/seed/demo/200/200',
      joinedDate: new Date('2023-11-15')
    }
  ];

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
    },
    {
      id: '6',
      title: 'Crimson Horizon',
      artist: 'Leo Mars',
      description: 'A striking sunset over a martian landscape.',
      imageUrl: 'https://picsum.photos/id/1015/600/400',
      likes: 543,
      isLiked: false,
      isFavorite: false,
      tags: ['landscape', 'red', 'sunset'],
      comments: []
    },
    {
      id: '7',
      title: 'Golden Hour',
      artist: 'Amber Ray',
      description: 'Warm light filtering through autumn leaves.',
      imageUrl: 'https://picsum.photos/id/1043/600/600',
      likes: 231,
      isLiked: false,
      isFavorite: false,
      tags: ['nature', 'yellow', 'light'],
      comments: []
    },
    {
      id: '8',
      title: 'Industrial Heat',
      artist: 'Forge Smith',
      description: 'Molten metal and sparks in a factory.',
      imageUrl: 'https://picsum.photos/id/400/800/600',
      likes: 112,
      isLiked: false,
      isFavorite: false,
      tags: ['industry', 'fire', 'orange'],
      comments: []
    },
    {
      id: '9',
      title: 'Abstract Fury',
      artist: 'Red Pollock',
      description: 'Chaotic splashes of red and orange paint.',
      imageUrl: 'https://picsum.photos/id/435/600/800',
      likes: 87,
      isLiked: false,
      isFavorite: false,
      tags: ['abstract', 'chaos', 'red'],
      comments: []
    },
    {
      id: '10',
      title: 'Street Ember',
      artist: 'Night Crawler',
      description: 'City lights blurring into trails of fire.',
      imageUrl: 'https://picsum.photos/id/356/600/400',
      likes: 420,
      isLiked: true,
      isFavorite: true,
      tags: ['city', 'night', 'lights'],
      comments: []
    }
  ];

  // State signals
  private artState = signal<Artwork[]>(this.initialArt);
  private searchQueryState = signal<string>('');
  private searchFilterState = signal<SearchFilter>('all');
  
  // Auth State
  private currentUserState = signal<User | null>(null);

  // Computed signals
  readonly searchQuery = computed(() => this.searchQueryState());
  readonly searchFilter = computed(() => this.searchFilterState());
  readonly currentUser = computed(() => this.currentUserState());
  readonly isLoggedIn = computed(() => !!this.currentUserState());
  
  // Used for display in profile/comments
  readonly userProfile = computed(() => {
    const user = this.currentUserState();
    if (user) {
      return { name: user.name, bio: user.bio, avatarUrl: user.avatarUrl };
    }
    return {
      name: 'Guest',
      bio: 'Please login to share your art.',
      avatarUrl: 'https://ui-avatars.com/api/?name=Guest&background=1e293b&color=94a3b8'
    };
  });
  
  readonly allArtworks = computed(() => this.artState());
  
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

  // --- Auth Actions ---

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUserState.set(user);
      return true;
    }
    return false;
  }

  signup(name: string, email: string, password: string): boolean {
    if (this.users.some(u => u.email === email)) {
      return false; // User exists
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      bio: 'New Artist on the block.',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef4444&color=fff`,
      joinedDate: new Date()
    };
    this.users.push(newUser);
    this.currentUserState.set(newUser);
    return true;
  }

  logout() {
    this.currentUserState.set(null);
  }

  // --- Art Actions ---

  setSearchQuery(query: string) {
    this.searchQueryState.set(query);
  }

  setSearchFilter(filter: SearchFilter) {
    this.searchFilterState.set(filter);
  }

  updateProfile(profile: { name: string; bio: string; avatarUrl: string }) {
    const currentUser = this.currentUserState();
    if (currentUser) {
      const oldName = currentUser.name;
      const updatedUser = { ...currentUser, ...profile };
      this.currentUserState.set(updatedUser);
      
      // Update in mock db
      this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);

      // If name changed, update ownership of existing artworks in mock db
      // In a real app with IDs, this wouldn't be necessary.
      if (oldName !== profile.name) {
        this.artState.update(arts => arts.map(art => {
          if (art.artist === oldName) {
            return { ...art, artist: profile.name };
          }
          return art;
        }));
      }
    }
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
    const profile = this.userProfile();
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