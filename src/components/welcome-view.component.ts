import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-view',
  imports: [CommonModule],
  template: `
    <div class="min-h-[85vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      <!-- Hero Section -->
      <div class="max-w-4xl mx-auto text-center z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium uppercase tracking-wider mb-4">
          <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Now with Gemini 2.5 Flash
        </div>

        <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
          Where <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Art</span> Meets <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Intelligence</span>
        </h1>
        
        <p class="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ArtFlow is a next-generation gallery where creators share their vision, and AI provides the critique. Join a community of innovators.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            (click)="onEnter.emit()"
            class="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Enter Gallery
          </button>
          <button 
            (click)="onJoin.emit()"
            class="px-8 py-4 bg-slate-800/50 backdrop-blur-md text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-800 hover:border-slate-600 transition-all"
          >
            Join Community
          </button>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 w-full px-4 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
        
        <!-- Feature 1 -->
        <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
          <div class="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Showcase Work</h3>
          <p class="text-slate-400">Upload your digital creations in seconds. Tag, describe, and share your portfolio with the world.</p>
        </div>

        <!-- Feature 2 -->
        <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-pink-500/30 transition-colors group">
          <div class="w-12 h-12 bg-pink-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">AI Critique</h3>
          <p class="text-slate-400">Get instant, sophisticated feedback on your art from our integrated Gemini 2.5 AI art critic.</p>
        </div>

        <!-- Feature 3 -->
        <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-purple-500/30 transition-colors group">
          <div class="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Curate Favorites</h3>
          <p class="text-slate-400">Build your personal collection. Save the pieces that inspire you and revisit them anytime.</p>
        </div>

      </div>

      <!-- Decorative Elements behind -->
      <div class="absolute top-1/4 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

    </div>
  `
})
export class WelcomeViewComponent {
  onEnter = output<void>();
  onJoin = output<void>();
}