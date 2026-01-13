import { Component, input, output, inject, signal, computed } from '@angular/core';
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
      <div 
        class="relative w-full overflow-hidden bg-slate-900 aspect-video cursor-zoom-in group/image"
        (click)="toggleZoom()"
        title="Click to zoom"
      >
        @if (isBase64(art().imageUrl)) {
             <img 
               [src]="art().imageUrl" 
               alt="{{art().title}}" 
               class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               [attr.loading]="priority() ? 'eager' : 'lazy'"
             >
        } @else {
             <img 
               [ngSrc]="art().imageUrl" 
               fill
               alt="{{art().title}}" 
               class="object-cover transition-transform duration-700 group-hover:scale-105"
               [priority]="priority()"
             >
        }
        
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        
        <!-- Top Actions -->
        <div class="absolute top-3 right-3 flex gap-2 z-10">
          <!-- Expand/Fullscreen Button -->
          <button 
            (click)="$event.stopPropagation(); toggleZoom()"
            class="p-2 rounded-full backdrop-blur-md bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200"
            title="Expand to Fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>

          <!-- Favorite Button -->
          <button 
            (click)="$event.stopPropagation(); onToggleFavorite.emit(art().id)"
            class="p-2 rounded-full backdrop-blur-md transition-colors duration-200"
            [class.bg-yellow-500]="art().isFavorite"
            [class.text-slate-900]="art().isFavorite"
            [class.bg-slate-900/50]="!art().isFavorite"
            [class.text-slate-300]="!art().isFavorite"
            [class.hover:bg-slate-800]="!art().isFavorite"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.fill-current]="art().isFavorite">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
        </div>

        <!-- Related Art Preview (On Hover) -->
        @if (relatedArtworks().length > 0) {
           <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent translate-y-full group-hover/image:translate-y-0 transition-transform duration-300 ease-out z-10 flex items-center justify-between pointer-events-none">
              <div class="flex items-center gap-3">
                 <span class="text-[10px] font-bold text-orange-400 uppercase tracking-widest opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 delay-100">See Also</span>
                 <div class="flex gap-2">
                    @for (related of relatedArtworks(); track related.id) {
                       <div 
                          (click)="$event.stopPropagation(); scrollToArt(related.id)"
                          class="w-16 h-10 rounded-md border border-white/20 overflow-hidden shadow-lg bg-slate-800 cursor-pointer hover:border-orange-500 hover:scale-105 transition-all pointer-events-auto relative group/thumb"
                          title="{{related.title}}"
                       >
                          <img [src]="related.imageUrl" class="w-full h-full object-cover">
                       </div>
                    }
                 </div>
              </div>
           </div>
        }
      </div>

      <!-- Content -->
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-xl font-bold text-white truncate pr-2">{{ art().title }}</h3>
            <p class="text-sm text-orange-400 font-medium">{{ art().artist }}</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-3">
          @for (tag of art().tags; track tag) {
            <button 
              (click)="onTagClick($event, tag)"
              class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 border border-slate-600 hover:bg-red-600 hover:text-white hover:border-red-500 transition-colors cursor-pointer"
            >
              #{{ tag }}
            </button>
          }
        </div>

        <p class="text-slate-400 text-sm mb-4 line-clamp-2">{{ art().description }}</p>

        <!-- AI Critique Section -->
        @if (art().critique) {
          <div class="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div class="flex items-center gap-2 mb-1 text-xs font-semibold text-red-300 uppercase tracking-wide">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2z"></path><path d="M12 12 2 12a10 10 0 0 1 10-10v10z"></path></svg>
              AI Critic
            </div>
            <p class="text-xs text-red-100 italic">"{{ art().critique }}"</p>
          </div>
        }

        <!-- Bottom Actions -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-700 mb-4">
          <button 
            (click)="onToggleLike.emit(art().id)"
            class="flex items-center space-x-2 group/like focus:outline-none"
          >
            <div class="p-2 rounded-full transition-colors"
               [class.bg-red-500/20]="art().isLiked"
               [class.text-red-500]="art().isLiked"
               [class.text-slate-400]="!art().isLiked"
               [class.group-hover/like:bg-slate-700]="!art().isLiked"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.fill-current]="art().isLiked">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <span class="text-sm font-medium" [class.text-red-500]="art().isLiked" [class.text-slate-400]="!art().isLiked">{{ art().likes }}</span>
          </button>

          <div class="flex gap-4 items-center">
            <button 
              (click)="toggleComments()"
              class="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
              title="Expand Details & Comments"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <span class="text-sm">{{ art().comments.length }}</span>
            </button>

            @if (!art().critique && !art().isLoadingCritique) {
              <button 
                (click)="askCritic()"
                class="text-xs font-medium text-slate-400 hover:text-white hover:underline decoration-red-500 underline-offset-4 transition-colors"
              >
                Ask AI Critic
              </button>
            }

            @if (art().isLoadingCritique) {
               <span class="text-xs text-orange-400 animate-pulse">Analyzing...</span>
            }
          </div>
        </div>

        <!-- Expanded Section (Related Art + Comments) -->
        @if (showComments()) {
          <div class="mt-auto border-t border-slate-700/50 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            
            <!-- Related Artworks (Expanded View) -->
            @if (relatedArtworks().length > 0) {
              <div class="mb-4">
                <h4 class="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">You might also like</h4>
                <div class="grid grid-cols-2 gap-2">
                   @for (related of relatedArtworks(); track related.id) {
                     <div 
                        (click)="scrollToArt(related.id)"
                        class="group/related relative aspect-video bg-slate-900 rounded-lg overflow-hidden cursor-pointer border border-slate-700 hover:border-red-500 transition-colors"
                     >
                        @if (isBase64(related.imageUrl)) {
                           <img 
                              [src]="related.imageUrl" 
                              class="w-full h-full object-cover opacity-70 group-hover/related:opacity-100 transition-opacity"
                              loading="lazy"
                           >
                        } @else {
                           <img 
                              [ngSrc]="related.imageUrl" 
                              fill
                              class="object-cover opacity-70 group-hover/related:opacity-100 transition-opacity"
                           >
                        }
                        
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                           <p class="text-xs font-bold text-white truncate">{{ related.title }}</p>
                           <p class="text-[10px] text-slate-400 truncate">{{ related.artist }}</p>
                        </div>
                     </div>
                   }
                </div>
              </div>
              <div class="h-px bg-slate-700/50 mb-3"></div>
            }

            <!-- Comments -->
            <div class="space-y-3 mb-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              @for (comment of art().comments; track comment.id) {
                <div class="bg-slate-900/50 p-2 rounded text-sm flex gap-3">
                  <!-- Avatar -->
                  <div class="flex-shrink-0">
                    <img 
                      [src]="comment.avatarUrl || 'https://picsum.photos/seed/' + comment.user + '/50/50'" 
                      class="w-8 h-8 rounded-full object-cover border border-slate-700"
                      alt="{{comment.user}}"
                      loading="lazy"
                    >
                  </div>
                  <!-- Text -->
                  <div class="flex-1">
                    <div class="flex justify-between items-baseline mb-1">
                      <span class="font-bold text-orange-300 text-xs">{{ comment.user }}</span>
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
                class="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 placeholder-slate-600"
              >
              <button 
                (click)="postComment()"
                [disabled]="!newCommentText()"
                class="bg-red-600 hover:bg-red-500 text-white rounded px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Zoom Modal -->
    @if (isZoomed()) {
      <div 
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        (click)="toggleZoom()"
      >
        <!-- Close Button -->
        <button 
          (click)="toggleZoom()"
          class="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10 z-[101]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <!-- Image Wrapper -->
        <div 
           class="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center pointer-events-none" 
        >
          <img 
            [src]="art().imageUrl" 
            alt="{{art().title}}" 
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-auto cursor-default"
            (click)="$event.stopPropagation()"
          >
          
          <!-- Caption -->
          <div class="absolute bottom-4 left-0 right-0 text-center">
            <span class="inline-block bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
              {{ art().title }} by {{ art().artist }}
            </span>
          </div>
        </div>
      </div>
    }
  `
})
export class ArtCardComponent {
  art = input.required<Artwork>();
  priority = input(false);
  
  onToggleLike = output<string>();
  onToggleFavorite = output<string>();
  
  private geminiService = inject(GeminiService);
  private store = inject(ArtStoreService);

  showComments = signal(false);
  newCommentText = signal('');
  isZoomed = signal(false);

  // Computed signal to find related artworks based on tags
  relatedArtworks = computed(() => {
    const current = this.art();
    // Use allArtworks so we can suggest items even if they are currently filtered out by the search bar
    const all = this.store.allArtworks();
    
    if (!current.tags || current.tags.length === 0) return [];

    return all
      .filter(a => a.id !== current.id) // Exclude self
      .map(a => ({
        art: a,
        // Count matching tags
        matches: a.tags.filter(t => current.tags.includes(t)).length
      }))
      .filter(item => item.matches > 0) // Must share at least one tag
      .sort((a, b) => b.matches - a.matches) // Sort by relevance
      .slice(0, 2) // Limit to 2 suggestions
      .map(item => item.art);
  });

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

  toggleZoom() {
    this.isZoomed.update(v => !v);
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

  scrollToArt(id: string) {
    // Attempt to find the element in the DOM and scroll to it
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.warn('Artwork not visible in current view');
    }
  }
}