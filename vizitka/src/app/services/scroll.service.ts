import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  scrollTo(id: string): void {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      } else {
        console.warn(`Element with id "${id}" not found`);
      }
    }, 0);
  }

  clearHashOnLoad(): void {
    if (window.location.hash) {
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
  }
}
