var lineChart = function(options) {
	var config = {
		margin: {top: 20, right: 20, bottom: 30, left: 20},
		chartWidth: 960,
		chartHeight: 500,
	};

	var that = this;

	_.extend(config, options);
	
	parseDate = d3.time.format("%Y-%m-%d").parse,
    formatDate = d3.time.format("%Y");

	this.width = config.chartWidth - config.margin.left - config.margin.right;
    this.height = config.chartHeight - config.margin.top - config.margin.bottom;


    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    this.xAxis = d3.svg.axis()
	    .scale(this.x)
	    .orient("bottom")
	    .tickSize(-this.height, 0)
	    .tickPadding(6);

	this.yAxis = d3.svg.axis()
	    .scale(this.y)
	    .orient("right")
	    .tickSize(-this.width)
	    .tickPadding(6);

	this.area = d3.svg.area()
	    .interpolate("step-after")
	    .x(function(d) { return that.x(d.date); })
	    .y0(this.y(0))
	    .y1(function(d) { return that.y(d.value); });

	this.line = d3.svg.line()
	    .interpolate("step-after")
	    .x(function(d) { return that.x(d.date); })
	    .y(function(d) { return that.y(d.value); });

	this.svg = d3.select(config.selector)
	    .append("svg")
	    .attr("width", this.width + config.margin.left + config.margin.right)
	    .attr("height", this.height + config.margin.top + config.margin.bottom)
	  	.append("g");

    this.init();
};


lineChart.prototype = {
	init: function() {
		this.setGradiant();
		this.setClipPath();
		this.setUpDom();
		this.setZoom();
	},
    
    setGradiant: function() {
    	var gradient = this.svg.append("defs").append("linearGradient")
		    .attr("id", "gradient")
		    .attr("x2", "0%")
		    .attr("y2", "100%");

		gradient.append("stop")
		    .attr("offset", "0%")
		    .attr("stop-color", "#fff")
		    .attr("stop-opacity", .5);

		gradient.append("stop")
		    .attr("offset", "100%")
		    .attr("stop-color", "#999")
		    .attr("stop-opacity", 1);
    },


    setClipPath: function() {
    	this.svg.append("clipPath")
		    .attr("id", "clip")
			.append("rect")
			.attr("x", this.x(0))
			.attr("y", this.y(1))
			.attr("width", this.x(1) - this.x(0))
			.attr("height", this.y(0) - this.y(1));
    },

    setUpDom: function() {
		this.svg.append("g")
		    .attr("class", "y axis")
		    .attr("transform", "translate(" + this.width + ",0)");

		this.svg.append("path")
		    .attr("class", "area")
		    .attr("align", "center")
		    .attr("clip-path", "url(#clip)")
		    .style("fill", "url(#gradient)");

		this.svg.append("g")
		    .attr("class", "x axis")
		    .attr("align", "center")
		    .attr("transform", "translate(0," + this.height + ")");

		this.svg.append("path")
		    .attr("align", "center")
		    .attr("class", "line")
		    .attr("clip-path", "url(#clip)");
    },

    setZoom: function() {
    	this.zoom = d3.behavior.zoom()
    		.on("zoom", this.draw.bind(this));	
    	
    	this.svg.append("rect")
		    .attr("align", "center")
		    .attr("class", "pane")
		    .attr("width", this.width)
		    .attr("height", this.height)
		    .call(this.zoom);
    },

    draw: function() {
	    this.svg.select("g.x.axis").call(this.xAxis);
		this.svg.select("g.y.axis").call(this.yAxis);
		this.svg.select("path.area").attr("d", this.area);
		this.svg.select("path.line").attr("d", this.line);
    },

    setChartBaseOnData: function(data) {
		var min = d3.min(data, function(d) {return d.date}),
			max = d3.max(data, function(d) {return d.date});
		
		this.x.domain([min, max]);
		this.y.domain([0, d3.max(data, function(d) { return d.value; })]);
		this.zoom.x(this.x);

		this.svg.select("path.area").data([data]);
		this.svg.select("path.line").data([data]);

		this.draw();
    }
}