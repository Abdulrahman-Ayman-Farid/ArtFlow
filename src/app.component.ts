import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtStoreService } from './services/art-store.service';
import { ArtCardComponent } from './components/art-card.component';
import { UploadViewComponent } from './components/upload-view.component';
import { SearchBarComponent } from './components/search-bar.component';
import { ProfileViewComponent } from './components/profile-view.component';

type ViewState = 'home' | 'favorites' | 'upload' | 'profile';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ArtCardComponent, UploadViewComponent, SearchBarComponent, ProfileViewComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  store = inject(ArtStoreService);
  currentView = signal<ViewState>('home');

  setView(view: ViewState) {
    this.currentView.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onToggleLike(id: string) {
    this.store.toggleLike(id);
  }

  onToggleFavorite(id: string) {
    this.store.toggleFavorite(id);
  }
}