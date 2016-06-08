###1.install bower dependencies###

it requires d3.js and underscore.js

here is the example of bower.json

```
{
  "name": "james",
  "description": "",
  "main": "",
  "moduleType": [],
  "authors": [
    "enhuizhu"
  ],
  "license": "MIT",
  "homepage": "http://www.olmarket.co.uk",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "test",
    "tests"
  ],
  "dependencies": {
    "d3": "~3.5.17",
    "underscore": "~1.8.3"
  }
}

```

if you already have bower.json, you can install dependencies by running:

```
bower install
```

###2.how to use it###

```
 var parseDate = d3.time.format("%Y-%m-%d").parse;
 
 var chart1 = new lineChart({
        selector: "#chartContainer"
     });

 d3.csv("readme-flights.csv", function(error, data) {
     if (error) throw error;

      data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
      });

      chart1.setChartBaseOnData(data);
 });

```








