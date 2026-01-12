import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtStoreService, SearchFilter } from '../services/art-store.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="relative max-w-md w-full group">
       <div class="flex rounded-lg shadow-sm border border-slate-700 bg-slate-800 overflow-visible focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all relative">
          
          <!-- Filter Dropdown Trigger -->
          <div class="relative border-r border-slate-700">
             <button 
                (click)="toggleFilter()" 
                type="button" 
                class="h-full px-3 py-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-l-lg text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1 min-w-[5rem] justify-between focus:outline-none"
             >
               {{ getFilterLabel(store.searchFilter()) }}
               <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
             </button>

             <!-- Dropdown Menu -->
             @if (showFilterMenu()) {
                <div class="fixed inset-0 z-40 bg-transparent" (click)="toggleFilter()"></div>
                <div class="absolute top-full left-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                   <button (click)="selectFilter('all')" [class.bg-indigo-500]="store.searchFilter() === 'all'" [class.text-white]="store.searchFilter() === 'all'" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex justify-between items-center">
                      All
                      @if (store.searchFilter() === 'all') { <span>✓</span> }
                   </button>
                   <button (click)="selectFilter('title')" [class.bg-indigo-500]="store.searchFilter() === 'title'" [class.text-white]="store.searchFilter() === 'title'" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex justify-between items-center">
                      Title
                      @if (store.searchFilter() === 'title') { <span>✓</span> }
                   </button>
                   <button (click)="selectFilter('artist')" [class.bg-indigo-500]="store.searchFilter() === 'artist'" [class.text-white]="store.searchFilter() === 'artist'" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex justify-between items-center">
                      Artist
                      @if (store.searchFilter() === 'artist') { <span>✓</span> }
                   </button>
                   <button (click)="selectFilter('tags')" [class.bg-indigo-500]="store.searchFilter() === 'tags'" [class.text-white]="store.searchFilter() === 'tags'" class="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex justify-between items-center">
                      Tags
                      @if (store.searchFilter() === 'tags') { <span>✓</span> }
                   </button>
                </div>
             }
          </div>

          <!-- Search Icon -->
          <div class="pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Input -->
          <input 
            [formControl]="searchControl"
            type="text" 
            class="block w-full pl-2 pr-3 py-2 bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none sm:text-sm" 
            [placeholder]="getPlaceholder()"
          >
          
          <!-- Clear Button -->
          @if (searchControl.value) {
            <button 
              (click)="clearSearch()"
              class="pr-3 flex items-center text-slate-500 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
       </div>
    </div>
  `
})
export class SearchBarComponent {
  store = inject(ArtStoreService);
  searchControl = new FormControl('');
  showFilterMenu = signal(false);

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.store.setSearchQuery(value || '');
    });
  }

  toggleFilter() {
    this.showFilterMenu.update(v => !v);
  }

  selectFilter(filter: SearchFilter) {
    this.store.setSearchFilter(filter);
    this.showFilterMenu.set(false);
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  getFilterLabel(filter: SearchFilter): string {
    switch (filter) {
      case 'all': return 'All';
      case 'title': return 'Title';
      case 'artist': return 'Artist';
      case 'tags': return 'Tags';
      default: return 'All';
    }
  }

  getPlaceholder(): string {
    const filter = this.store.searchFilter();
    switch (filter) {
      case 'all': return 'Search art, artists, or tags...';
      case 'title': return 'Search by artwork title...';
      case 'artist': return 'Search by artist name...';
      case 'tags': return 'Search by tags...';
      default: return 'Search...';
    }
  }
}