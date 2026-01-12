import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtStoreService } from '../services/art-store.service';

@Component({
  selector: 'app-signup-view',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
           <h2 class="text-3xl font-bold text-white tracking-tight">Join ArtFlow</h2>
           <p class="text-slate-400 mt-2">Start your creative journey today</p>
        </div>

        <!-- Form Card -->
        <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-5">
            
            @if (errorMessage()) {
              <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-sm text-center">
                {{ errorMessage() }}
              </div>
            }

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input 
                type="text" 
                formControlName="name"
                class="block w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Jane Doe"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input 
                type="email" 
                formControlName="email"
                class="block w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input 
                type="password" 
                formControlName="password"
                class="block w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Create a strong password"
              >
            </div>

            <button 
              type="submit" 
              [disabled]="signupForm.invalid"
              class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-900/20 transition-all transform active:scale-[0.98] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-slate-400 text-sm">
              Already have an account? 
              <button (click)="onGoToLogin.emit()" class="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupViewComponent {
  onSuccess = output<void>();
  onGoToLogin = output<void>();

  private fb = inject(FormBuilder);
  private store = inject(ArtStoreService);

  errorMessage = signal<string>('');

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      const success = this.store.signup(name!, email!, password!);
      
      if (success) {
        this.errorMessage.set('');
        this.onSuccess.emit();
      } else {
        this.errorMessage.set('Account with this email already exists.');
      }
    }
  }
}