import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatekService } from '../../../serivices/datek.service';

@Component({
    selector: 'app-basic-table',
    templateUrl: './basic-table.component.html',
    styleUrls: ['./basic-table.component.scss']
})
export class BasicTableComponent implements OnInit {

    stations: Array<any>;
    postForm: FormGroup;
    results:  Array<any>;
    results_referti: Array<any>;
    
    stazione: any;

    constructor(
        private formBuilder: FormBuilder,
        private datekService: DatekService
    ) {

     }

    ngOnInit() {
        this.datekService.getAllStazioni().toPromise().then((elements: any) => {
            console.log('stazioni trovate', elements);
            this.stations = elements;
        });
        this.postForm = this.formBuilder.group({
            stazioneId: ['', Validators.required],
        });
    }
    onSelectedStation(val: any) {
        console.log('val', val);
    }
    onSubmit() {       
        this.stazione = this.postForm.value.stazioneId;
        console.log('stazione scelta', this.stazione);
        this.datekService.getRilevazioniByStation(this.stazione).toPromise().then((el: any) => {
            console.log('tutti i dati della stazione', el);
            this.results = [];
            //benzene
            let result_benzene = el.map((a: any) => a.benzene);
            let result_benzene_clean = result_benzene.filter((e: any) => e != "");
            this.results.push({ name: "Benzene", avg: this.getAvg(result_benzene_clean),pedice:"" });

            //co
            let result_co = el.map((a: any) => a.co);
            let result_co_clean = result_co.filter((e: any) => e != "");
            this.results.push({ name: "CO", avg: this.getAvg(result_co_clean), pedice: "" });

            //pm10
            let result_pm10 = el.map((a: any) => a.pm10);
            let result_pm10_clean = result_pm10.filter((e: any) => e != "");
            this.results.push({ name: "PM10", avg: this.getAvg(result_pm10_clean), pedice: "" });
            //pm2_5
            let result_pm2_5 = el.map((a: any) => a.pm2_5);
            let result_pm2_5_clean = result_pm2_5.filter((e: any) => e != "");
            this.results.push({ name: "PM2.5", avg: this.getAvg(result_pm2_5_clean), pedice: "" });
            // NO2
            let result_no2 = el.map((a: any) => a.no2);
            let result_no2_clean = result_no2.filter((e: any) => e != "");
            this.results.push({ name: "NO", avg: this.getAvg(result_no2_clean), pedice: "2" });
            // so2
            let result_so2 = el.map((a: any) => a.so2);
            let result_s02_clean = result_so2.filter((e: any) => e != "");
            this.results.push({ name: "SO", avg: this.getAvg(result_s02_clean), pedice: "2" });                       
            //o3
            let result_o3 = el.map((a: any) => a.o3);
            let result_o3_clean = result_o3.filter((e: any) => e != "");
            this.results.push({ name: "O", avg: this.getAvg(result_o3_clean), pedice: "3" });


            console.log('risultati per la stazione', this.results);

        })

        this.datekService.getRefertiByStation(this.stazione).toPromise().then((el: any) => {
            console.log('referti ', el);
            this.results_referti = [];
            let numReferti = el.length;
            let positiva = el.filter((e: any) => e.Diagnosis === "positive").length;
            let negativa = el.filter((e: any) => e.Diagnosis === "negative").length;
            this.results_referti.push({ numReferti: numReferti, positiva: positiva, negativa: negativa });
        })
    }


    createTXT() {
        var textFile = null
        var data = new Blob(["AAAAAA"], { type: 'text/plain' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);
        console.log('textFile',textFile);
    }

    getAvg(arr: any) {

        if (arr.length) {
            let sum = arr.reduce(function (a:number, b:number) { return a + b; });
            let avg = sum / arr.length;
            return avg;
        } else {
            return "--";
        }
    }

}
