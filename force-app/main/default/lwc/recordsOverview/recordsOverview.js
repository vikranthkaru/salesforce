import { LightningElement, wire } from 'lwc';
import chartjs from '@salesforce/resourceUrl/Chartjs';
import { loadScript } from 'lightning/platformResourceLoader';
import { showToastMessage, handleErrors } from "c/utilModule";
import getAllRecordCounts from '@salesforce/apex/GetRecordCounts.fetchRecordCount';
export default class RecordsOverview extends LightningElement {
    @wire(getAllRecordCounts) resultData({ error, data }) {
        if (data) {
            let dataCxt = JSON.parse(data);
            dataCxt.sObjects.forEach(key=>{
                this.updateChart(key.count, key.name);
            })
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
            this.resultData = undefined;
            let evt = showToastMessage("Error", "Oops looks like not able to fetch records, Please priovide admin with error : " + handleErrors(error), 'error');
            this.dispatchEvent(evt);
        }
    }
    chart;
    chartjsInitialized = false;
    config = {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: [
                    ],
                    backgroundColor: [
                    ],
                    label: 'Dataset 1'
                }
            ],
            labels: []
        },

        options: {
            responsive: true,
            legend: {
                position: 'right'
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        Promise.all([
            loadScript(this, chartjs)
        ]).then(() => {
            const ctx = this.template.querySelector('canvas.donut')
                .getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading ChartJS',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }

    updateChart(count, label) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(count);
            var red = Math.floor(Math.random() * 256); // Random value between 0 and 255
            var green = Math.floor(Math.random() * 256);
            var blue = Math.floor(Math.random() * 256);
            var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
            dataset.backgroundColor.push(color);
        });
        this.chart.update();
    }
}