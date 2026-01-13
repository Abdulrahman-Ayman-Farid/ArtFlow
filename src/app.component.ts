import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtStoreService } from './services/art-store.service';
import { ArtCardComponent } from './components/art-card.component';
import { UploadViewComponent } from './components/upload-view.component';
import { SearchBarComponent } from './components/search-bar.component';
import { ProfileViewComponent } from './components/profile-view.component';
import { LoginViewComponent } from './components/login-view.component';
import { SignupViewComponent } from './components/signup-view.component';
import { WelcomeViewComponent } from './components/welcome-view.component';
import { AboutViewComponent } from './components/about-view.component';

type ViewState = 'welcome' | 'home' | 'favorites' | 'upload' | 'login' | 'signup' | 'about';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    ArtCardComponent, 
    UploadViewComponent, 
    SearchBarComponent, 
    ProfileViewComponent,
    LoginViewComponent,
    SignupViewComponent,
    WelcomeViewComponent,
    AboutViewComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  store = inject(ArtStoreService);
  currentView = signal<ViewState>('welcome');
  showProfile = signal(false);

  setView(view: ViewState) {
    // Auth Guard for specific routes
    if ((view === 'upload' || view === 'favorites') && !this.store.isLoggedIn()) {
      this.currentView.set('login');
    } else {
      this.currentView.set(view);
    }
    
    this.showProfile.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleProfile() {
    this.showProfile.update(v => !v);
  }

  onToggleLike(id: string) {
    if (!this.store.isLoggedIn()) {
      this.setView('login');
      return;
    }
    this.store.toggleLike(id);
  }

  onToggleFavorite(id: string) {
    if (!this.store.isLoggedIn()) {
      this.setView('login');
      return;
    }
    this.store.toggleFavorite(id);
  }
  
  onLogout() {
    this.store.logout();
    this.showProfile.set(false);
    this.setView('welcome');
  }
}