import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <div class="flex">
        <app-sidebar></app-sidebar>
        <main class="flex-1 p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
