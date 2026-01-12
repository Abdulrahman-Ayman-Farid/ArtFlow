import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtStoreService } from '../services/art-store.service';

@Component({
  selector: 'app-upload-view',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <h2 class="text-3xl font-bold text-white mb-6">Share Your Art</h2>
        
        <form [formGroup]="uploadForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Image Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-300">Artwork Image</label>
            <div 
              class="relative border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-900/50"
              (dragover)="onDragOver($event)"
              (drop)="onDrop($event)"
              (click)="fileInput.click()"
            >
              <input 
                #fileInput 
                type="file" 
                class="hidden" 
                accept="image/*"
                (change)="onFileSelected($event)"
              >
              
              @if (previewUrl) {
                <div class="relative w-full h-64 rounded-lg overflow-hidden mb-4 group">
                  <img [src]="previewUrl" class="w-full h-full object-contain">
                  <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white font-medium">Click to change</span>
                  </div>
                </div>
              } @else {
                <div class="flex flex-col items-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-lg font-medium">Drop your image here or click to browse</span>
                  <span class="text-sm mt-1 text-slate-500">Supports JPG, PNG</span>
                </div>
              }
            </div>
            @if (uploadForm.get('image')?.touched && !previewUrl) {
              <p class="text-red-400 text-sm">An image is required.</p>
            }
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input 
              type="text" 
              formControlName="title"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all"
              placeholder="e.g., Midnight Reverie"
            >
            @if (uploadForm.get('title')?.touched && uploadForm.get('title')?.invalid) {
              <p class="text-red-400 text-sm mt-1">Title is required (min 3 chars).</p>
            }
          </div>

          <!-- Artist -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Artist Name</label>
            <input 
              type="text" 
              formControlName="artist"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all"
              placeholder="Your name or alias"
            >
            @if (uploadForm.get('artist')?.touched && uploadForm.get('artist')?.invalid) {
              <p class="text-red-400 text-sm mt-1">Artist name is required.</p>
            }
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Tags (Comma separated)</label>
            <input 
              type="text" 
              formControlName="tags"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all"
              placeholder="e.g., oil painting, abstract, blue"
            >
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea 
              formControlName="description"
              rows="4"
              class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all resize-none"
              placeholder="Tell us about the inspiration..."
            ></textarea>
            @if (uploadForm.get('description')?.touched && uploadForm.get('description')?.invalid) {
              <p class="text-red-400 text-sm mt-1">Description is required.</p>
            }
          </div>

          <!-- Buttons -->
          <div class="flex gap-4 pt-4">
            <button 
              type="button" 
              (click)="onCancel.emit()"
              class="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              [disabled]="uploadForm.invalid || !previewUrl"
              class="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/20"
            >
              Publish Artwork
            </button>
          </div>

        </form>
      </div>
    </div>
  `
})
export class UploadViewComponent {
  onCancel = output<void>();
  onSuccess = output<void>();
  
  private fb = inject(FormBuilder);
  private store = inject(ArtStoreService);
  
  previewUrl: string | null = null;
  
  uploadForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    artist: ['', Validators.required],
    tags: [''],
    description: ['', Validators.required],
    image: [null] // We handle file manually
  });

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.uploadForm.valid && this.previewUrl) {
      const formValue = this.uploadForm.value;
      
      // Parse tags
      const rawTags = formValue.tags || '';
      const tags = rawTags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);

      this.store.addArtwork({
        title: formValue.title!,
        artist: formValue.artist!,
        description: formValue.description!,
        imageUrl: this.previewUrl,
        tags: tags
      });
      this.onSuccess.emit();
    }
  }
}