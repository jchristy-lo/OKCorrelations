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

	var margin = {top: 50, right: 50, bottom: 70, left: 60},
		chartW = svg.attr("width") - margin.left - margin.right,
		chartH = svg.attr("height") - margin.top - margin.bottom;

	var xdata = [],
	    ydata = [];

	var y = function(val){return (chartH-chartH/d3.max(ydata)*(+val)+margin.top);}
	var x = function(val){return d3.max([0,chartW/d3.max(xdata)*(+val)+margin.left]);}

	GLOBAL.data.forEach(function (profile) {
		var profY = profile[yvar],
			profX = profile[xvar];

		if (profY != "" & profX != "" & profY != undefined & profX != undefined & profY != -1 & profX != -1 & profY != NaN & profX != NaN ){
			xdata.push(+profX);
			ydata.push(+profY);
		}
	});

	var i = 0;
	xdata.forEach(function (datum) {
	var g = svg.append("circle")
		.attr("class","scatter-dots")
	  	.attr("cy", y(ydata[i]))
	  	.attr("cx", x(datum))
	  	.attr("r", 5) // radius of circle
		.style("fill","blue")
		.style("stroke","none")
		.style("opacity",0.2);
	i += 1;
	});

	var xScale = d3.scale.linear()
		.domain([0,d3.max(xdata)])
		.range([margin.left,margin.left+chartW]);

	var xAxis = d3.svg.axis();
	xAxis.orient("bottom")
		.scale(xScale);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (chartH + margin.top) + ")")
	    .call(xAxis);

	var yScale = d3.scale.linear()
		.domain([0,d3.max(ydata)])
		.range([margin.bottom+chartH,margin.bottom]);

	var yAxis = d3.svg.axis();
	yAxis.orient("left")
		.scale(yScale);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+margin.left+",-"+(margin.bottom-margin.top)+")")
	    .call(yAxis);

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
    if (GLOBAL.varTypes[xvar] === "cont" & GLOBAL.varTypes[yvar] === "cont") {
        scatterPlot(xvar, yvar);
    } else {
    	tabOn(xvar,yvar);
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