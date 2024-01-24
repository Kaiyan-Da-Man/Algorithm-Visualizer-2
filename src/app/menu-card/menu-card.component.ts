import { Component, Input, OnInit } from '@angular/core';
import { JsonInfoService } from '../service/populate-menu-card.service';

@Component({
	selector: 'app-menu-card',
	standalone: true,
	imports: [],
	templateUrl: './menu-card.component.html',
	styleUrl: './menu-card.component.scss',
})
export class MenuCardComponent implements OnInit {
	@Input() jsonFileName: string = '';
	title: string = '';
	description: string = '';

	constructor(private jsonInfoService: JsonInfoService) {}

	ngOnInit(): void {
		this.jsonInfoService
			.getCardInfo(this.jsonFileName)
			.subscribe((data) => {
				this.title = data.title;
				this.description = data.description;
			});
	}
}
