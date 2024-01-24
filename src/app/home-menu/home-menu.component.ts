import { Component } from '@angular/core';
import { MenuCardComponent } from '../menu-card/menu-card.component';

@Component({
	selector: 'app-home-menu',
	standalone: true,
	imports: [MenuCardComponent],
	templateUrl: './home-menu.component.html',
	styleUrl: './home-menu.component.scss',
})
export class HomeMenuComponent {}
