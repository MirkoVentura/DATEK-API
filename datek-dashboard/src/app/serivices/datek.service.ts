import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';




@Injectable()
export class DatekService {

 

    constructor(private http: HttpClient) {

        // this.initializeAvailableCoins();
    }

    getRilevazioniByStation(stazione: string) {
        var url = environment.apiUrl + "/rilevazioni?_start=0&_limit=15000&descrizione=" + stazione
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }


    getAllRilevazioni() {
        var url = environment.apiUrl + "/rilevazioni?_start=0&_limit=999999";
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }

    getRefertiByStation(stazione: string) {
        var url = environment.apiUrl + "/refertos?_start=0&_limit=15000&PatetientAddress.Name=" + stazione
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }

    getAllReferti() {
        var url = environment.apiUrl + "/refertos?_start=0&_limit=9999999"
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }

    getAllStazioni() {
        var url = environment.apiUrl + "/stazionis?_start=0&_limit=15000&";
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }
 



}
