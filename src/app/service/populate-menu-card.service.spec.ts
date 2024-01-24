import { TestBed } from '@angular/core/testing';

import { PopulateMenuCardService } from './populate-menu-card.service';

describe('PopulateMenuCardService', () => {
	let service: PopulateMenuCardService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PopulateMenuCardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
