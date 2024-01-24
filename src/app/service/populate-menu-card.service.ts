import { Injectable } from '@angular/core';
import { MenuCardInfo } from '../model/MenuCardInfo';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class JsonInfoService {
	constructor(private http: HttpClient) {}

	getCardInfo(jsonFileName: string) {
		return this.http.get<MenuCardInfo>(
			`../../assets/json/${jsonFileName}.json`,
		);
	}

	getAlgorithmInfo(jsonFileName: string) {}
}
