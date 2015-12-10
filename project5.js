window.addEventListener("load", run);

var GLOBAL = {
    data: [],
    color: ["blue", "red", "darkgrey", "white", "green"],
    varTypes: {
        "body": "cat",
        "diet": "cat",
        "religion": "cat",
        "drinks": "cat",
        "drugs": "cat",
        "education": "cat",
        "ethnicity": "cat",
        "height": "cont",
        "income": "cont",
        "job": "cat",
        "offspring": "cat",
        "orientation": "cat",
        "pets": "cat",
        "religion": "cat",
        "sex": "cat",
        "smokes": "cat",
        "speaks": "cat",
        "wordcount": "cont"
    }, //tags CATegorical or CONTinuous variables
    ySelect: "",
    xSelect: "",
    tabbedData: {}

}

function run() {
    noSelected();
    getDataRows(function(data) {
        GLOBAL.data = data;
        getWordcount();

    });
    // initializeBarView();
}

function tabOn (xvar, yvar){
	GLOBAL.tabbedData = {};
	GLOBAL.data.forEach(function (profile) {
		var profY = profile[yvar];
		var profX = profile[xvar];
		if (profY != "" & profX != "" & profY != undefined & profX != undefined){
		if(profY in GLOBAL.tabbedData){
			if(profX in GLOBAL.tabbedData[profY]){
				GLOBAL.tabbedData[profY][profX] += 1;
			}else{
				GLOBAL.tabbedData[profY][profX] = 1;
			}
		}else{
			GLOBAL.tabbedData[profY] = {};
			GLOBAL.tabbedData[profY][profX] = 1;
		}}
    });

    console.log(GLOBAL.tabbedData);
}

function scatterPlot(xvar, yvar) {

var svg = d3.select("#viz");
d3.selectAll("#viz > *").remove();

var margin = {top: 50, right: 50, bottom: 70, left: 50},
	chartW = svg.attr("width") - margin.left - margin.right,
	chartH = svg.attr("height") - margin.top - margin.bottom;

var xdata = [],
    ydata = [];

GLOBAL.data.forEach(function (profile) {
	var profY = profile[yvar],
		profX = profile[xvar];

if ($.isNumeric(profY) & $.isNumeric(profX)){
	// if (profY != "" & profX != "" & profY != undefined & profX != undefined & profY != -1 & profX != -1){
		xdata.push(+profX);
		ydata.push(+profY);
	}
});

// x and y scales, I've used linear here but there are other options
// the scales translate data values to pixel values for you
var x = d3.scale.linear()
          .domain([0, d3.max(xdata)])  // the range of the values to plot
          // .range([0, chartW]);        // the pixel range of the x-axis

var y = d3.scale.linear()
          .domain([0, d3.max(ydata)])
          // .range([ chartH, margin.bottom ]);

// draw the x axis
var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

svg.append('g')
	.attr('transform', 'translate(0,' + chartH + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

// draw the y axis
var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');

svg.append('g')
	.attr('transform', 'translate('+margin.left+',0)')
	.attr('class', 'main axis date')
	.call(yAxis);

// draw the graph object
var g = svg.append("svg:g"); 

g.selectAll("scatter-dots")
  .data(ydata)  // using the values in the ydata array
  .enter().append("svg:circle")  // create a new circle for each value
      .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
      .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
      .attr("r", 5) // radius of circle
      .style("color", GLOBAL.colors[i])
      .style("opacity", 0.9); // opacity of circle
}

function getWordcount() {
    GLOBAL.data.forEach(function(profile) {
    	profile["allEssays"] = profile["essay0"] + profile["essay1"] + profile["essay2"] + profile["essay3"] + profile["essay5"] + profile["essay6"] + profile["essay7"] + profile["essay8"]; 

    	profile["allEssays"] = profile["allEssays"].split("<br />").join(" ")
    		.replace(/[\+.\-()!\/\\?\n]/g, ' ')
    		.replace(/[:;,']/g, '')
    		.trim()
    		.replace(/ +/g, ' ');
    	profile["wordcount"] = profile["allEssays"].split(' ').length;
    });
}

function sortType(xvar, yvar) {
    tabOn(xvar, yvar);
    if (GLOBAL.varTypes[xvar] === "cont" & GLOBAL.varTypes[yvar] === "cont") {
        scatterPlot(xvar, yvar);
    } else {
    }
}

function noSelected() {
    var viz = d3.select("#viz")
    viz.append("text")
        .attr("x", 100)
        .attr("y", 150)
        .attr("dy", "0.35em")
        .text("Pick two variables to see their relationship!");
}

function updateX(selection) {
    selection = selection.value
    GLOBAL.xSelect = selection;

    if (selection === "" | GLOBAL.ySelect === "") {
        noSelected;
    } else {
        sortType(selection, GLOBAL.ySelect)
    }
}

function updateY(selection) {
    selection = selection.value
    GLOBAL.ySelect = selection;

    if (selection === "" | GLOBAL.xSelect === "") {
        noSelected;
    } else {
        sortType(GLOBAL.xSelect, selection)
    }
}

function getDataRows(f) {
    d3.csv("profiles.csv",
        function(error, data) {
            f(data);
        });
}