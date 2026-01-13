import { Component, output, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtStoreService } from '../services/art-store.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-[60] overflow-y-auto" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity" 
        (click)="onClose.emit()"
      ></div>

      <!-- Modal Panel Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center">
        <!-- Panel -->
        <div 
          class="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-800 p-8 text-left align-middle shadow-2xl border border-slate-700 transition-all"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-8">
            <div>
               <h2 class="text-3xl font-bold text-white">Profile Settings</h2>
               <p class="text-slate-400 text-sm mt-1">Manage your public presence</p>
            </div>
            <button 
              (click)="onClose.emit()" 
              class="text-slate-400 hover:text-white transition-colors rounded-full p-2 hover:bg-slate-700/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
            
            <!-- Avatar Section -->
            <div class="flex flex-col items-center sm:flex-row gap-8 pb-6 border-b border-slate-700/50">
              <div class="flex flex-col items-center">
                <div class="relative group cursor-pointer" (click)="fileInput.click()">
                  <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 shadow-xl bg-slate-900 group-hover:border-red-500 transition-colors">
                    <img [src]="previewUrl() || store.userProfile().avatarUrl" class="w-full h-full object-cover">
                  </div>
                  <!-- Camera Icon Overlay -->
                  <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  
                  <input 
                    #fileInput 
                    type="file" 
                    class="hidden" 
                    accept="image/png, image/jpeg, image/webp"
                    (change)="onFileSelected($event)"
                  >
                </div>
                @if (fileError()) {
                  <p class="text-red-400 text-xs mt-2 text-center font-medium animate-in fade-in slide-in-from-top-1">{{ fileError() }}</p>
                }
              </div>
              
              <div class="flex-1 text-center sm:text-left space-y-2">
                <div>
                   <h3 class="text-xl font-bold text-white">{{ store.currentUser()?.name }}</h3>
                   <p class="text-orange-400 text-sm font-medium">{{ store.currentUser()?.email }}</p>
                </div>
                
                @if (store.currentUser()?.joinedDate) {
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-300 text-xs">
                     <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     <span>Member since {{ store.currentUser()?.joinedDate | date:'MMMM yyyy' }}</span>
                  </div>
                }
                
                <p class="text-slate-500 text-xs max-w-xs mx-auto sm:mx-0 pt-2">
                   Click the avatar to upload a new profile picture. Max size 5MB.
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-slate-500 transition-all"
                >
                @if (profileForm.get('name')?.touched && profileForm.get('name')?.invalid) {
                  <p class="text-red-400 text-sm mt-1">Name is required (min 2 chars).</p>
                }
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
                <textarea 
                  formControlName="bio"
                  rows="4"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-slate-500 transition-all resize-none"
                  placeholder="Tell the community about your art..."
                ></textarea>
                @if (profileForm.get('bio')?.touched && profileForm.get('bio')?.invalid) {
                  <p class="text-red-400 text-sm mt-1">Bio is required (max 300 chars).</p>
                }
                <p class="text-right text-xs text-slate-500 mt-1">
                   {{ profileForm.get('bio')?.value?.length || 0 }}/300
                </p>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 pt-4 border-t border-slate-700/50">
              <button 
                type="button" 
                (click)="onClose.emit()"
                class="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="profileForm.invalid || !!fileError()"
                class="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-900/20"
              >
                Save Changes
              </button>
            </div>
            
            <!-- Projected Content (Logout Button) -->
            <ng-content select="[ngProjectAs='footer-actions']"></ng-content>

          </form>
        </div>
      </div>
    </div>
  `
})
export class ProfileViewComponent implements OnInit {
  onClose = output<void>();
  onSave = output<void>();
  
  store = inject(ArtStoreService);
  private fb: FormBuilder = inject(FormBuilder);
  
  previewUrl = signal<string | null>(null);
  fileError = signal<string | null>(null);
  
  profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    bio: ['', [Validators.required, Validators.maxLength(300)]]
  });

  ngOnInit() {
    const currentProfile = this.store.userProfile();
    this.profileForm.patchValue({
      name: currentProfile.name,
      bio: currentProfile.bio
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Reset previous error
      this.fileError.set(null);

      // Validate File Type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.fileError.set('Invalid file type. Please upload JPG, PNG, or WebP.');
        return;
      }

      // Validate File Size (Max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.fileError.set('File size exceeds 5MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid && !this.fileError()) {
      const currentProfile = this.store.userProfile();
      this.store.updateProfile({
        name: this.profileForm.value.name!,
        bio: this.profileForm.value.bio!,
        avatarUrl: this.previewUrl() || currentProfile.avatarUrl!
      });
      this.onSave.emit();
    }
  }
}