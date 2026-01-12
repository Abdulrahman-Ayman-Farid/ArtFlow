import { Component, output, inject, OnInit } from '@angular/core';
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
            <h2 class="text-3xl font-bold text-white">Edit Profile</h2>
            <button 
              (click)="onClose.emit()" 
              class="text-slate-400 hover:text-white transition-colors rounded-full p-1 hover:bg-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
            
            <!-- Avatar Section -->
            <div class="flex flex-col items-center sm:flex-row gap-8">
              <div class="relative group">
                <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-lg bg-slate-900">
                  <img [src]="previewUrl || store.userProfile().avatarUrl" class="w-full h-full object-cover">
                </div>
                <button 
                  type="button" 
                  (click)="fileInput.click()"
                  class="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-500 transition-colors"
                  title="Change Avatar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </button>
                <input 
                  #fileInput 
                  type="file" 
                  class="hidden" 
                  accept="image/*"
                  (change)="onFileSelected($event)"
                >
              </div>
              
              <div class="flex-1 text-center sm:text-left">
                <h3 class="text-xl font-bold text-white mb-1">{{ store.userProfile().name }}</h3>
                <p class="text-slate-400 text-sm">Update your personal details and avatar here.</p>
              </div>
            </div>

            <div class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
                <input 
                  type="text" 
                  formControlName="name"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all"
                >
                @if (profileForm.get('name')?.touched && profileForm.get('name')?.invalid) {
                  <p class="text-red-400 text-sm mt-1">Name is required.</p>
                }
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">Bio</label>
                <textarea 
                  formControlName="bio"
                  rows="4"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500 transition-all resize-none"
                ></textarea>
                @if (profileForm.get('bio')?.touched && profileForm.get('bio')?.invalid) {
                  <p class="text-red-400 text-sm mt-1">Bio is required.</p>
                }
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 pt-4 border-t border-slate-700">
              <button 
                type="button" 
                (click)="onClose.emit()"
                class="flex-1 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="profileForm.invalid"
                class="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-900/20"
              >
                Save Profile
              </button>
            </div>

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
  private fb = inject(FormBuilder);
  
  previewUrl: string | null = null;
  
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
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const currentProfile = this.store.userProfile();
      this.store.updateProfile({
        name: this.profileForm.value.name!,
        bio: this.profileForm.value.bio!,
        avatarUrl: this.previewUrl || currentProfile.avatarUrl
      });
      this.onSave.emit();
    }
  }
}