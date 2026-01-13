import { Component, output, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ArtStoreService } from '../services/art-store.service';

@Component({
  selector: 'app-welcome-view',
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      <!-- Background Art Grid / Marquee Effect -->
      <div class="absolute inset-0 z-0 opacity-20 overflow-hidden pointer-events-none">
        <div class="grid grid-cols-3 md:grid-cols-4 gap-4 transform -rotate-12 scale-110">
           @for(art of store.allArtworks(); track art.id) {
             <div class="aspect-video bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                <img [src]="art.imageUrl" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000">
             </div>
           }
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      <!-- Hero Section -->
      <div class="max-w-4xl mx-auto text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
        
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-500/30 text-red-300 text-xs font-medium uppercase tracking-wider mb-4 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Now with Gemini 2.5 Flash
        </div>

        <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-2xl">
          Where <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Passion</span> Meets <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Creation</span>
        </h1>
        
        <p class="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed shadow-black drop-shadow-md">
          ArtFlow is the hottest gallery where creators share their vision, and AI provides the critique. Join a community of innovators.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            (click)="onEnter.emit()"
            class="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold text-lg hover:from-red-500 hover:to-orange-500 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-white/10"
          >
            Enter Gallery
          </button>
          <button 
            (click)="onJoin.emit()"
            class="px-8 py-4 bg-slate-900/60 backdrop-blur-md text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-red-500/50 transition-all"
          >
            Join Community
          </button>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 w-full px-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
        
        <!-- Feature 1 -->
        <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-red-500/30 transition-colors group shadow-lg">
          <div class="w-12 h-12 bg-red-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Showcase Work</h3>
          <p class="text-slate-400">Upload your digital creations in seconds. Tag, describe, and share your portfolio with the world.</p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-orange-500/30 transition-colors group shadow-lg">
          <div class="w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">AI Critique</h3>
          <p class="text-slate-400">Get instant, sophisticated feedback on your art from our integrated Gemini 2.5 AI art critic.</p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm hover:border-yellow-500/30 transition-colors group shadow-lg">
          <div class="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Curate Favorites</h3>
          <p class="text-slate-400">Build your personal collection. Save the pieces that inspire you and revisit them anytime.</p>
        </div>

      </div>

      <!-- Decorative Elements behind -->
      <div class="absolute top-1/4 left-10 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

    </div>
  `
})
export class WelcomeViewComponent {
  store = inject(ArtStoreService);
  onEnter = output<void>();
  onJoin = output<void>();
}