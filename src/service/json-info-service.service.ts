import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuCardInfo } from '../model/MenuCardInfo';

@Injectable({
    providedIn: 'root',
})
export class JsonInfoService {
    constructor(private http: HttpClient) { }

    getCardInfo(jsonFileName: string): Observable<MenuCardInfo> {
        return this.http.get<MenuCardInfo>(
            `assets/json/${jsonFileName}.json`,
            { responseType: 'json' });
    }

    getAlgorithmInfo(jsonFileName: string) { }
}
