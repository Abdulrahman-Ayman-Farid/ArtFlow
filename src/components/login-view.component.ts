import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArtStoreService } from '../services/art-store.service';

@Component({
  selector: 'app-login-view',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <!-- Brand/Logo Area -->
        <div class="text-center mb-8">
          <div class="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-4 transform -rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p class="text-slate-400 mt-2">Sign in to curate your collection</p>
        </div>

        <!-- Form Card -->
        <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            @if (errorMessage()) {
              <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-red-200 text-sm">{{ errorMessage() }}</span>
              </div>
            }

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input 
                  type="email" 
                  formControlName="email"
                  class="block w-full pl-10 bg-slate-900/50 border border-slate-600 rounded-lg py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div class="relative">
                 <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  formControlName="password"
                  class="block w-full pl-10 bg-slate-900/50 border border-slate-600 rounded-lg py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                >
              </div>
            </div>

            <button 
              type="submit" 
              [disabled]="loginForm.invalid"
              class="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-red-900/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-slate-400 text-sm">
              Don't have an account? 
              <button (click)="onGoToSignup.emit()" class="text-orange-400 hover:text-orange-300 font-medium hover:underline">
                Create one
              </button>
            </p>
          </div>
        </div>
        
        <div class="mt-8 text-center">
           <p class="text-xs text-slate-600">Demo Account: demo@artflow.com / password</p>
        </div>
      </div>
    </div>
  `
})
export class LoginViewComponent {
  onSuccess = output<void>();
  onGoToSignup = output<void>();

  private fb: FormBuilder = inject(FormBuilder);
  private store = inject(ArtStoreService);

  errorMessage = signal<string>('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = this.store.login(email!, password!);
      
      if (success) {
        this.errorMessage.set('');
        this.onSuccess.emit();
      } else {
        this.errorMessage.set('Invalid email or password.');
      }
    }
  }
}