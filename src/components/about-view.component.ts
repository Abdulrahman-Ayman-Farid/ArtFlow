import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">Redefining Digital Artistry</h1>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto">
          ArtFlow is more than a gallery. It's a living ecosystem where human creativity meets artificial intelligence.
        </p>
      </div>

      <!-- Mission Section -->
      <div class="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div class="space-y-6">
          <div class="inline-block p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white">Our Mission</h2>
          <p class="text-slate-400 leading-relaxed">
            We believe that feedback is the cornerstone of growth. In a world saturated with content, 
            getting constructive critique is hard. ArtFlow bridges this gap by leveraging the 
            Gemini 2.5 Flash model to provide instant, sophisticated, and slightly pretentious art criticism 
            for every piece uploaded.
          </p>
          <p class="text-slate-400 leading-relaxed">
            Whether you are a seasoned professional or a digital doodler, our platform gives your work 
            the attention it deserves.
          </p>
        </div>
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-2xl opacity-20"></div>
          <div class="relative bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl">
            <div class="space-y-4">
              <div class="h-2 w-20 bg-slate-600 rounded"></div>
              <div class="h-4 w-full bg-slate-700 rounded"></div>
              <div class="h-4 w-5/6 bg-slate-700 rounded"></div>
              <div class="h-4 w-4/6 bg-slate-700 rounded"></div>
              <div class="pt-4 flex gap-3">
                 <div class="h-8 w-8 rounded-full bg-red-500/20"></div>
                 <div class="h-8 w-24 rounded bg-slate-700/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-3 gap-6 mb-16">
        <div class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800 transition-colors">
          <h3 class="text-xl font-bold text-white mb-2 text-orange-400">Curate</h3>
          <p class="text-slate-400 text-sm">Build your personal collection of favorites from artists around the globe.</p>
        </div>
        <div class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800 transition-colors">
          <h3 class="text-xl font-bold text-white mb-2 text-red-400">Connect</h3>
          <p class="text-slate-400 text-sm">Engage with a community of creators through comments and likes.</p>
        </div>
        <div class="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl hover:bg-slate-800 transition-colors">
          <h3 class="text-xl font-bold text-white mb-2 text-yellow-400">Evolve</h3>
          <p class="text-slate-400 text-sm">Use AI insights to refine your style and explore new artistic directions.</p>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <button 
          (click)="onBack.emit()"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </button>
      </div>
    </div>
  `
})
export class AboutViewComponent {
  onBack = output<void>();
}