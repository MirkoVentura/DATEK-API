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
        var url = environment.apiUrl + "/rilevazioni?descrizione=" + stazione
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }

    getRefertiByStation(stazione: string) {
        var url = environment.apiUrl + "/refertos?PatetientAddress.Name=" + stazione
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }

    getAllStazioni() {
        var url = environment.apiUrl + "/stazionis";
        return this.http.get(url)
            .pipe(
                map((response) => {
                    return response;
                })
            );
    }
 



}
