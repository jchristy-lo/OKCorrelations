window.addEventListener("load", run);

var GLOBAL = {
    data: [],
    color: ["#07408D", "#EA1C53", "#4C7BD9", "#FCBEE0", "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "green", "red", "darkgrey", "purple"],
    varTypes: {
        "age": "cont",
        // "body": "cat",
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
    ySelect: "income",
    xSelect: "age",
    tabbedData: {}

}

function run() {
    d3.select("#loading")
        .append("text")
        .text("LOADING!");
    getDataRows(function(data) {
        GLOBAL.data = data;
        getWordcount();
        scatterPlot("age", "income");
        document.getElementById("loading").style.display = "none";
    });

}

function tabOn(xvar, yvar) { //variables are actually mixed up lol but too late
    GLOBAL.tabbedData = {};
    GLOBAL.data.forEach(function(profile) {
        var profY = profile[yvar];
        var profX = profile[xvar];
        if (profY != "" & profX != "" & profY != undefined & profX != undefined) {
            if (profY in GLOBAL.tabbedData) {
                if (profX in GLOBAL.tabbedData[profY]) {
                    GLOBAL.tabbedData[profY][profX] += 1;
                } else {
                    GLOBAL.tabbedData[profY][profX] = 1;
                }
            } else {
                GLOBAL.tabbedData[profY] = {};
                GLOBAL.tabbedData[profY][profX] = 1;
            }
        }
    });
    initializeBarView(xvar, yvar, false); //not zoom
}

function scatterPlot(xvar, yvar) {
    var svg = d3.select("#viz");
    d3.selectAll("#viz > *").remove();

    var margin = {
            top: 50,
            right: 50,
            bottom: 70,
            left: 70
        },
        chartW = svg.attr("width") - margin.left - margin.right,
        chartH = svg.attr("height") - margin.top - margin.bottom;

    var xdata = [],
        ydata = [];

    var y = function(val) {
        return chartH - chartH / d3.max(ydata) * val + margin.top;
    }
    var x = function(val) {
        return d3.max([margin.left, chartW / (d3.max(xdata)) * (+val) + margin.left]);
    }

    GLOBAL.data.forEach(function(profile) {
        var profY = profile[yvar],
            profX = profile[xvar];

        if (profY != "" & profX != "" & profY != undefined & profX != undefined & profY != -1 & profX != -1 & profY != NaN & profX != NaN) {
            xdata.push(+profX);
            ydata.push(+profY);
        }
    });

    var i = 0;
    xdata.forEach(function(datum) {
        var g = svg.append("circle")
            .attr("class", "scatter-dots")
            .attr("cy", y(ydata[i]))
            .attr("cx", x(datum))
            .attr("r", 5) // radius of circle
            .style("fill", "#104DA1")
            .style("stroke", "none")
            .style("opacity", 0.1);
        i += 1;
    });

    var xScale = d3.scale.linear()
        .domain([0, d3.max(xdata)])
        .range([margin.left, margin.left + chartW]);

    var xAxis = d3.svg.axis();
    xAxis.orient("bottom")
        .scale(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (chartH + margin.top) + ")")
        .call(xAxis);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(ydata)])
        .range([margin.bottom + chartH, margin.bottom]);

    var yAxis = d3.svg.axis();
    yAxis.orient("left")
        .scale(yScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",-" + (margin.bottom - margin.top) + ")")
        .call(yAxis);

    svg.append("text")
        .attr("x", svg.attr("width") / 2)
        .attr("y", svg.attr("height") - 20)
        .text(GLOBAL.xSelect);

    svg.append("text")
        .attr("transform", "translate(10,225)rotate(-90)")
        .text(GLOBAL.ySelect);

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
    } else if (GLOBAL.varTypes[xvar] === "cat" & GLOBAL.varTypes[yvar] === "cont") {
        GLOBAL.xSelect = xvar;
        GLOBAL.ySelect = yvar;
        tabOn(xvar, yvar, false);
    } else {
        tabOn(xvar, yvar, false);
    }
}


function updateX(selection) {
    selection = selection.value
    GLOBAL.xSelect = selection;
    sortType(selection, GLOBAL.ySelect)
}

function updateY(selection) {
    selection = selection.value
    GLOBAL.ySelect = selection;
    sortType(GLOBAL.xSelect, selection)
}

function getDataRows(f) {
    d3.csv("profiles.csv",
        function(error, data) {
            f(data);
        });
}