import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Artwork } from '../services/art-store.service';
import { GeminiService } from '../services/gemini.service';
import { ArtStoreService } from '../services/art-store.service';

@Component({
  selector: 'app-art-card',
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  template: `
    <div class="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl border border-slate-700 h-full flex flex-col">
      <!-- Image Container -->
      <div class="relative w-full overflow-hidden bg-slate-900 aspect-video">
        @if (isBase64(art().imageUrl)) {
             <img [src]="art().imageUrl" alt="{{art().title}}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        } @else {
             <img [src]="art().imageUrl" alt="{{art().title}}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
        }
        
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
        
        <!-- Top Actions -->
        <button 
          (click)="onToggleFavorite.emit(art().id)"
          class="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors duration-200"
          [class.bg-yellow-500]="art().isFavorite"
          [class.text-white]="art().isFavorite"
          [class.bg-slate-900/50]="!art().isFavorite"
          [class.text-slate-300]="!art().isFavorite"
          [class.hover:bg-slate-800]="!art().isFavorite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.fill-current]="art().isFavorite">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-xl font-bold text-white truncate pr-2">{{ art().title }}</h3>
            <p class="text-sm text-indigo-400 font-medium">{{ art().artist }}</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-3">
          @for (tag of art().tags; track tag) {
            <button 
              (click)="onTagClick($event, tag)"
              class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors cursor-pointer"
            >
              #{{ tag }}
            </button>
          }
        </div>

        <p class="text-slate-400 text-sm mb-4 line-clamp-2">{{ art().description }}</p>

        <!-- AI Critique Section -->
        @if (art().critique) {
          <div class="mb-4 p-3 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
            <div class="flex items-center gap-2 mb-1 text-xs font-semibold text-indigo-300 uppercase tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path><path d="M12 12 2 12a10 10 0 0 1 10-10v10z"></path></svg>
              AI Critic
            </div>
            <p class="text-xs text-indigo-100 italic">"{{ art().critique }}"</p>
          </div>
        }

        <!-- Bottom Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-700 mb-4">
          <button 
            (click)="onToggleLike.emit(art().id)"
            class="flex items-center space-x-2 group/like focus:outline-none"
          >
            <div class="p-2 rounded-full transition-colors"
               [class.bg-pink-500/20]="art().isLiked"
               [class.text-pink-500]="art().isLiked"
               [class.text-slate-400]="!art().isLiked"
               [class.group-hover/like:bg-slate-700]="!art().isLiked"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.fill-current]="art().isLiked">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <span class="text-sm font-medium" [class.text-pink-500]="art().isLiked" [class.text-slate-400]="!art().isLiked">{{ art().likes }}</span>
          </button>

          <div class="flex gap-4 items-center">
            <button 
              (click)="toggleComments()"
              class="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span class="text-sm">{{ art().comments.length }}</span>
            </button>

            @if (!art().critique && !art().isLoadingCritique) {
              <button 
                (click)="askCritic()"
                class="text-xs font-medium text-slate-400 hover:text-white hover:underline decoration-indigo-500 underline-offset-4 transition-colors"
              >
                Ask AI Critic
              </button>
            }

            @if (art().isLoadingCritique) {
               <span class="text-xs text-indigo-400 animate-pulse">Analyzing...</span>
            }
          </div>
        </div>

        <!-- Comments Section -->
        @if (showComments()) {
          <div class="mt-auto border-t border-slate-700/50 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            
            <div class="space-y-3 mb-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              @for (comment of art().comments; track comment.id) {
                <div class="bg-slate-900/50 p-2 rounded text-sm flex gap-3">
                  <!-- Avatar -->
                  <div class="flex-shrink-0">
                    <img 
                      [src]="comment.avatarUrl || 'https://picsum.photos/seed/' + comment.user + '/50/50'" 
                      class="w-8 h-8 rounded-full object-cover border border-slate-700"
                      alt="{{comment.user}}"
                    >
                  </div>
                  <!-- Text -->
                  <div class="flex-1">
                    <div class="flex justify-between items-baseline mb-1">
                      <span class="font-bold text-indigo-300 text-xs">{{ comment.user }}</span>
                      <span class="text-[10px] text-slate-500">{{ comment.timestamp | date:'shortTime' }}</span>
                    </div>
                    <p class="text-slate-300 text-xs">{{ comment.text }}</p>
                  </div>
                </div>
              } @empty {
                <p class="text-xs text-slate-500 italic text-center py-2">No comments yet. Be the first!</p>
              }
            </div>

            <div class="flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="newCommentText"
                (keydown.enter)="postComment()"
                placeholder="Add a comment..."
                class="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
              >
              <button 
                (click)="postComment()"
                [disabled]="!newCommentText()"
                class="bg-indigo-600 hover:bg-indigo-500 text-white rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ArtCardComponent {
  art = input.required<Artwork>();
  onToggleLike = output<string>();
  onToggleFavorite = output<string>();
  
  private geminiService = inject(GeminiService);
  private store = inject(ArtStoreService);

  showComments = signal(false);
  newCommentText = signal('');

  isBase64(url: string): boolean {
    return url.startsWith('data:');
  }

  async askCritic() {
    const artData = this.art();
    this.store.setLoadingCritique(artData.id, true);
    
    const critique = await this.geminiService.getArtCritique(
      artData.title,
      artData.artist,
      artData.description
    );

    this.store.updateCritique(artData.id, critique);
  }

  toggleComments() {
    this.showComments.update(v => !v);
  }

  postComment() {
    const text = this.newCommentText().trim();
    if (text) {
      this.store.addComment(this.art().id, text);
      this.newCommentText.set('');
    }
  }

  onTagClick(event: Event, tag: string) {
    event.stopPropagation();
    this.store.setSearchFilter('tags');
    this.store.setSearchQuery(tag);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}