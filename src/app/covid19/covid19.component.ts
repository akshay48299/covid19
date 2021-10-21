import { Component, OnInit } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_sunburst from "@amcharts/amcharts4/plugins/sunburst";
am4core.useTheme(am4themes_animated);
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.css']
})
export class Covid19Component implements OnInit {

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getCovidData();
  }

  getCovidData() {
    let countrieArr = ['India', 'Nepal', 'Bangladesh', 'Pakistan', 'Bhutan', 'Sri Lanka', 'Maldives'];
    let countries: string = countrieArr.toString();
    this.api.getCovid19Data(countries).subscribe((data: any) => {
      const newData = data.map((result: any) => ({
        name: result.country,
        children: [
          {
            name: "Total Cases",
            children: [
              { name: "Active", value: result.active },
              { name: "Deaths", value: result.deaths },
              { name: "Recovered", value: result.recovered }
            ]
          }
        ]
      }));   

      this.loadChart(newData);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });
  }

  loadChart(newData: any) {
    let chart: any = am4core.create("chartdiv", am4plugins_sunburst.Sunburst);
    chart.padding(0,0,0,0);
    chart.radius = am4core.percent(98);
    chart.data = newData;
  
    chart.colors.step = 2;
    chart.fontSize = 11;
    chart.innerRadius = am4core.percent(10);

    // define data fields
    chart.dataFields.value = "value";
    chart.dataFields.name = "name";
    chart.dataFields.children = "children";


    let level0SeriesTemplate = new am4plugins_sunburst.SunburstSeries();
    level0SeriesTemplate.hiddenInLegend = false;
    chart.seriesTemplates.setKey("0", level0SeriesTemplate)

    // this makes labels to be hidden if they don't fit
    level0SeriesTemplate.labels.template.truncate = true;
    level0SeriesTemplate.labels.template.hideOversized = true;

    level0SeriesTemplate.labels.template.adapter.add("rotation", function(rotation, target) {
      target.maxWidth = target.dataItem.slice.radius - target.dataItem.slice.innerRadius - 10;
      target.maxHeight = Math.abs(target.dataItem.slice.arc * (target.dataItem.slice.innerRadius + target.dataItem.slice.radius) / 2 * am4core.math.RADIANS);

      return rotation;
    })

    let level1SeriesTemplate = level0SeriesTemplate.clone();
    chart.seriesTemplates.setKey("1", level1SeriesTemplate)
    level1SeriesTemplate.fillOpacity = 0.75;
    level1SeriesTemplate.hiddenInLegend = true;

    let level2SeriesTemplate = level0SeriesTemplate.clone();
    chart.seriesTemplates.setKey("2", level2SeriesTemplate)
    level2SeriesTemplate.fillOpacity = 0.5;
    level2SeriesTemplate.hiddenInLegend = true;

    chart.legend = new am4charts.Legend();
  }
}
