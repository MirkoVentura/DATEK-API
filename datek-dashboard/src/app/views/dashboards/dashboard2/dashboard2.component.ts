import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { DatekService } from '../../../serivices/datek.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {

    public map: any = { lat: 51.678418, lng: 7.809007 };
    public chart1Type: string = 'bar';
    public chart2Type: string = 'pie';
    public chart3Type: string = 'line';
    public chart4Type: string = 'radar';
    public chart5Type: string = 'doughnut';


    public chartType = 'line';

    public chartDatasets: Array<any> = [

    ];


    public chartDatasetsSingles: Array<any> = [

    ];


    public chartRefertiDatasets: Array<any> = [

    ];

    public chartLabels: Array<any> = [];

    public chartColors: Array<any> = [];
    public chartReferitLabels: Array<any> = ['2018'];


    public dateOptionsSelect: any[];
    public bulkOptionsSelect: any[];
    public showOnlyOptionsSelect: any[];
    public filterOptionsSelect: any[];

    public chartOptions: any = {
        responsive: true,
        legend: {
            labels: {
                fontColor: '#5b5f62',
            }
        },
        scales: {
            beginAtZero: true,
            yAxes: [{
                ticks: {
                    fontColor: '#5b5f62',
                    beginAtZero: true
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: '#5b5f62',
                    beginAtZero: true

                }
            }],
        }
    };

    stations: Array<any>;
    postForm: FormGroup;
    results: Array<any>;
    results_referti: Array<any>;
    stazione: any;
    flag: boolean = false;
    flagInquinanti: boolean = false;
    arrayResultsToGraph: Array<any> = [];


    benzeneData: Array<any> = [];
    coData: Array<any> = [];
    pm10Data: Array<any> = [];
    pm2_5Data: Array<any> = [];
    no2Data: Array<any> = [];
    so3Data: Array<any> = [];
    o3Data: Array<any> = [];


    benzeneDataX: Array<any> = [];
    coDataX: Array<any> = [];
    pm10DataX: Array<any> = [];
    pm2_5DataX: Array<any> = [];
    no2DataX: Array<any> = [];
    so3DataX: Array<any> = [];
    o3DataX: Array<any> = [];
    linkToDwnload: any;
    valueByStations = new Map();

    constructor(
        private datekService: DatekService, private sanitizer: DomSanitizer) {

    }

    ngOnInit() {
        this.setEnvairoment();
    }

    onSubmit() {
        this.stazione = this.postForm.value.stazioneId;
        console.log('stazione scelta', this.stazione);
        this.datekService.getRilevazioniByStation(this.stazione).toPromise().then((el: any) => {
            console.log('tutti i dati della stazione', el);
            this.results = [];
            //benzene

            for (var i = 0; i <= 11; i++) {
                this.getAvgByMoth(el, i);
            }
            
            console.log('risultati per la stazione', this.chartDatasets);

        })

        this.datekService.getRefertiByStation(this.stazione).toPromise().then((el: any) => {
            console.log('referti ', el);
            this.results_referti = [];
            let numReferti = el.length;
            let positiva = el.filter((e: any) => e.Diagnosis === "positive").length;

            let negativa = el.filter((e: any) => e.Diagnosis === "negative").length;

            this.chartRefertiDatasets.push({ data: [positiva], label: "Diagnosi Positiva" });
            this.chartRefertiDatasets.push({ data: [negativa], label: "Diagnosi Negativa" });
            this.results_referti.push({ numReferti: numReferti, positiva: positiva, negativa: negativa });
            this.flag = true;
        })


    }


    setEnvairoment() {

        this.datekService.getAllRilevazioni().toPromise().then((el: any) => {
            console.log('rilevazioni',el.length);

            this.datekService.getAllStazioni().toPromise().then((elements: any) => {
                console.log('stazioni trovate', elements);

                this.stations = elements;
                let st = 0;
                for (var i = 0; i < this.stations.length; i++) {
                    let stazione = this.stations[i].Name;
                    
                    this.datekService.getRefertiByStation(stazione).toPromise().then((referti: any) => {
                        let resultsByStations = this.excractSummaryResults(el, stazione);
                        console.log('referti ', referti);
                        this.results_referti = [];
                        let numReferti = referti.length;
                        let positiva = referti.filter((e: any) => e.Diagnosis === "positive").length;
                        let YRef = (positiva / numReferti) * 100;
                        for (var k = 0; k < resultsByStations.length; k++) {
                            let stringStation = stazione+" ";
                            let singleRes = resultsByStations[k];
                            if (singleRes.name == "Benzene") {
                                this.benzeneData.push({ x: singleRes.avg, y: YRef });
                                this.benzeneDataX.push(singleRes.avg);
                                stringStation += singleRes.avg+" " 
                            }
                            if (singleRes.name == "CO") {
                                this.coData.push({ x: singleRes.avg, y: YRef,t:'aaaa' });
                                this.coDataX.push(singleRes.avg);
                                stringStation += singleRes.avg + " " 

                            }
                            if (singleRes.name == "PM10") {
                                this.pm10Data.push({ x: singleRes.avg, y: YRef });
                                this.pm10DataX.push(singleRes.avg);
                                stringStation += singleRes.avg + " " 

                            }
                            if (singleRes.name == "PM2.5") {
                                this.pm2_5Data.push({ x: singleRes.avg, y: YRef });
                                this.pm2_5DataX.push(singleRes.avg);
                                stringStation += singleRes.avg + " " 

                            }

                            if (singleRes.name == "NO") {
                                this.no2Data.push({ x: singleRes.avg, y: YRef });
                                this.no2DataX.push(singleRes.avg);
                                stringStation += singleRes.avg + " " 

                            }
                            if (singleRes.name == "SO") {
                                this.so3Data.push({ x: singleRes.avg, y: YRef });
                                this.so3DataX.push(singleRes.avg);
                                stringStation += singleRes.avg + " " 

                            }
                            if (singleRes.name == "O") {
                                this.o3Data.push({ x: singleRes.avg, y: YRef });
                                this.o3DataX.push(singleRes.avg);
                                stringStation += singleRes.avg + " " 

                            }
                            this.valueByStations.set(stazione, stringStation);
                        }
                        st++;
                        if (st === this.stations.length) {
                            this.chartDatasets.push({ data: this.benzeneData, label: "Benzene" });
                            let sortedBenzene = this.benzeneDataX.sort();
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.benzeneData, label: "Benzene" }], label: "Benzene", pedice: "", labels: sortedBenzene
                            });
                            let sortedCo = this.coDataX.sort();
                            this.chartDatasets.push({ data: this.coData, label: "CO" });
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.coData, label: "CO" }], label: "CO", pedice: "", labels: sortedCo
                            });
                            let sortedPm10 = this.pm10DataX.sort();
                            this.chartDatasets.push({ data: this.pm10Data, label: "PM10" });
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.pm10Data, label: "PM10" }], label: "PM10", pedice: "", labels: sortedPm10
                            });
                            let sortedPm25 = this.pm2_5DataX.sort();

                            this.chartDatasets.push({ data: this.pm2_5Data, label: "PM2.5" });
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.pm2_5Data, label: "PM2.5" }], label: "PM2.5", pedice: "", labels: sortedPm25
                            });
                            let sortedNo2 = this.no2DataX.sort();
                            this.chartDatasets.push({ data: this.no2Data, label: "NO2" });
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.no2Data, label: "NO2" }], label: "NO", pedice: "2", labels: sortedNo2
                            });
                            let sortedO3 = this.so3DataX.sort();
                            this.chartDatasets.push({ data: this.so3Data, label: "SO2" });
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.so3Data, label: "SO" }], label: "SO", pedice: "2", labels: sortedO3
                            });
                            this.chartDatasets.push({ data: this.o3Data, label: "O3" });
                            let sortedO = this.o3DataX.sort();
                            this.chartDatasetsSingles.push({
                                dataSet: [{ data: this.so3Data, label: "O3" }], label: "O", pedice: "3", labels: sortedO
                            });
                            this.flagInquinanti = true;
                            console.log('all data ', this.chartDatasetsSingles);


                        }

                    })
                }
            });
        });

      

        
    }
    createTxt() {
        let records:Array<string> = [];
        this.datekService.getAllReferti().toPromise().then((refertos: any) => {
            for (var kk = 0; kk < refertos.length; kk++) {
                let singleReferto = refertos[kk];
                console.log(singleReferto);
                var stringaStart = this.valueByStations.get(singleReferto.PatetientAddress.Name);
                records.push(stringaStart + " " + singleReferto.PatientSex + " " + singleReferto.PatientAge + " " + singleReferto.PatientWeight + " " + singleReferto.Diagnosis + "\n")
            }

            var data = new Blob(records, { type: 'text/plain' });
            this.linkToDwnload = window.URL.createObjectURL(data);
            var link = document.createElement('a');
            link.href = this.linkToDwnload;
            link.download = "dati.txt";
            link.click();
            console.log("link to download", this.linkToDwnload);
        })
    }

    excractSummaryResults(elements: any, stazione: string) {
        let results = [];
        let el = elements.filter((e: any) => e.descrizione === stazione);

        let result_benzene = el.map((a: any) => a.benzene);
        let result_benzene_clean = result_benzene.filter((e: any) => e != "");
        results.push({ name: "Benzene", avg: this.getAvg(result_benzene_clean), pedice: "" });

        //co
        let result_co = el.map((a: any) => a.co);
        let result_co_clean = result_co.filter((e: any) => e != "");
        results.push({ name: "CO", avg: this.getAvg(result_co_clean), pedice: "" });

        //pm10
        let result_pm10 = el.map((a: any) => a.pm10);
        let result_pm10_clean = result_pm10.filter((e: any) => e != "");
        results.push({ name: "PM10", avg: this.getAvg(result_pm10_clean), pedice: "" });
        //pm2_5
        let result_pm2_5 = el.map((a: any) => a.pm2_5);
        let result_pm2_5_clean = result_pm2_5.filter((e: any) => e != "");
        results.push({ name: "PM2.5", avg: this.getAvg(result_pm2_5_clean), pedice: "" });
        // NO2
        let result_no2 = el.map((a: any) => a.no2);
        let result_no2_clean = result_no2.filter((e: any) => e != "");
        results.push({ name: "NO", avg: this.getAvg(result_no2_clean), pedice: "2" });
        // so2
        let result_so2 = el.map((a: any) => a.so2);
        let result_s02_clean = result_so2.filter((e: any) => e != "");
        results.push({ name: "SO", avg: this.getAvg(result_s02_clean), pedice: "2" });
        //o3
        let result_o3 = el.map((a: any) => a.o3);
        let result_o3_clean = result_o3.filter((e: any) => e != "");
        results.push({ name: "O", avg: this.getAvg(result_o3_clean), pedice: "3" });
        return results;
    }



    getAvg(arr: any) {

        if (arr.length) {
            let sum = arr.reduce(function (a: number, b: number) { return a + b; });
            let avg = sum / arr.length;
            return avg;
        } else {
            return 0;
        }
    }

    getAvgByMoth(arr: any, month: number) {
        console.log(month);
        let array_month = [];

        for (var i = 0; i < arr.length; i++) {
            let el = arr[i];
            let date = new Date(el.d_ril);
            if (date.getMonth() === month) {
                array_month.push(el);
            }
        }

        let resultPerMonth = this.extractResults(array_month);
        for (var i = 0; i < resultPerMonth.length; i++) {
            let singleRes = resultPerMonth[i];
            if (singleRes.name == "Benzene") {
                this.benzeneData.push(singleRes.avg);
            }
            if (singleRes.name == "CO") {
                this.coData.push(singleRes.avg);
            }
            if (singleRes.name == "PM10") {
                this.pm10Data.push(singleRes.avg);
            }
            if (singleRes.name == "PM2.5") {
                this.pm2_5Data.push(singleRes.avg);
            }

            if (singleRes.name == "NO") {
                this.no2Data.push(singleRes.avg);
            }
            if (singleRes.name == "SO") {
                this.so3Data.push(singleRes.avg);
            }
            if (singleRes.name == "O") {
                this.o3Data.push(singleRes.avg);
            }
        }
    }


    extractResults(el: any) {
        let results = [];
        let result_benzene = el.map((a: any) => a.benzene);
        let result_benzene_clean = result_benzene.filter((e: any) => e != "");
        results.push({ name: "Benzene", avg: this.getAvg(result_benzene_clean), pedice: "" });

        //co
        let result_co = el.map((a: any) => a.co);
        let result_co_clean = result_co.filter((e: any) => e != "");
        results.push({ name: "CO", avg: this.getAvg(result_co_clean), pedice: "" });

        //pm10
        let result_pm10 = el.map((a: any) => a.pm10);
        let result_pm10_clean = result_pm10.filter((e: any) => e != "");
        results.push({ name: "PM10", avg: this.getAvg(result_pm10_clean), pedice: "" });
        //pm2_5
        let result_pm2_5 = el.map((a: any) => a.pm2_5);
        let result_pm2_5_clean = result_pm2_5.filter((e: any) => e != "");
        results.push({ name: "PM2.5", avg: this.getAvg(result_pm2_5_clean), pedice: "" });
        // NO2
        let result_no2 = el.map((a: any) => a.no2);
        let result_no2_clean = result_no2.filter((e: any) => e != "");
        results.push({ name: "NO", avg: this.getAvg(result_no2_clean), pedice: "2" });
        // so2
        let result_so2 = el.map((a: any) => a.so2);
        let result_s02_clean = result_so2.filter((e: any) => e != "");
        results.push({ name: "SO", avg: this.getAvg(result_s02_clean), pedice: "2" });
        //o3
        let result_o3 = el.map((a: any) => a.o3);
        let result_o3_clean = result_o3.filter((e: any) => e != "");
        results.push({ name: "O", avg: this.getAvg(result_o3_clean), pedice: "3" });

        return results;
    }
}
