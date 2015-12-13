function initializeBarView(category1, category2) {
    var data = GLOBAL.tabbedData;
    //   document.getElementById("label").innerHTML = category + " breakdown for " + ethnicity;


    var svg = d3.select("#viz");
    d3.selectAll("#viz > *").remove();




    // // create canvas
    // // var svg = d3.select("#viz").append("svg:svg")
    // //     .attr("class", "chart")
    // //     .attr("width", chartW)
    // //     .attr("height", chartH)
    // //     .append("svg:g")
    // //     .attr("transform", "translate(10,470)");

    // // x = d3.scale.ordinal().rangeRoundBands([0, chartW - 50])
    // // y = d3.scale.linear().range([0, chartH - 50])

    // var x = d3.scale.ordinal()
    //     .rangeRoundBands([0, chartW], .1);

    // var y = d3.scale.linear()
    //     .rangeRound([chartH, 0]);
    // z = d3.scale.ordinal().range(["darkblue", "blue", "lightblue"])

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        chartW = 960 - margin.left - margin.right,
        chartH = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, chartW]);

    var y = d3.scale.linear()
        .rangeRound([chartH, 0]);



    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#viz")
        .attr("width", chartW + margin.left + margin.right)
        .attr("height", chartH + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var remap = new Array();
    //this is the remapping
    for (key in data) {
        // console.log(key);
        // console.log("prev: ");
        // console.log(data[key]);
        var prev = 0;
        for (cat in data[key]) {
            var val = data[key][cat];
            // data[key][cat] = {
            //     "x": key,
            //     "y0": prev,
            //     "y1": val + prev
            // };
            remap.push({
                "x": Object.keys(data).indexOf(key),
                "key": key,
                "y0": prev,
                "y1": val + prev,
                "category": cat
            });
            prev = val + prev;
        }
        // console.log("post: ");
        // console.log(data[key]);
    }

    x.domain(remap.map(function(d) {
        return d.site;
    }));
    y.domain([0, d3.max(remap, function(d) {
        return d.y1;
    })]);
    // var remapped = Object.keys(data).map(function(dat, i) {
    //     return Object.keys(data).map(function(d, ii) {
    //         return {
    //             x: ii,
    //             y: d[i + 1]
    //         };
    //     })
    // });



    // show the domains of the scales              
    console.log("x.domain(): " + x.domain())
    console.log("y.domain(): " + y.domain())
    console.log("------------------------------------------------------------------");


    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Accumulated percentage of users (%)");


    for (val in remap) {

        var spacing = remap[val].x * 100;

        var length = remap[val].y0 - remap[val].y1;
        console.log(svg);
        var category = svg
            .append("g")
            .attr("class", "g")
            .attr("transform", "translate(" + spacing + ",0)");

        category
            .append("rect")
            .attr("width", 100)
            .attr("y", remap[val].y0)
            .attr("height", length * -1)
            .style("fill", function() {
                return GLOBAL.color[val];
            });

    }
    // //So sorry for this.
    // var array = color.domain().slice().reverse();
    // array.pop();

    // var legend = svg.selectAll(".legend")
    //     .data(array)
    //     .enter().append("g")
    //     .attr("class", "legend")
    //     .attr("transform", function(d, i) {
    //         return "translate(0," + i * 20 + ")";
    //     });

    // legend.append("rect")
    //     .attr("x", chartW - 18)
    //     .attr("width", 18)
    //     .attr("height", 18)
    //     .style("fill", color);

    // legend.append("text")
    //     .attr("x", chartW - 24)
    //     .attr("y", 9)
    //     .attr("dy", ".35em")
    //     .style("text-anchor", "end")
    //     .text(function(d) {
    //         return d;
    //     });

}



function updateStackBarView(category, ethnicity, n) {
    document.getElementById("label").innerHTML = category + " breakdown for " + ethnicity;
    // setup button events
    var data = getDataRows(category, ethnicity);

    var svg = d3.select("#viz");

    var height = svg.attr("height");
    var margin = 100;
    var chartHeight = height - 2 * margin;

    // update the title

    svg.select(".title")
        .text("ethnicity: " + ethnicity);

    // bind the data to the <g> elements representing each group

    sel = svg.selectAll("g")
        .data(data);

    // find the bar within the group, transition it to its right size

    sel.select(".bar")
        .transition()
        .duration(2000)
        .attr("y", function(d) {
            return height - margin - (chartHeight * d.value / 100);
        })
        .attr("height", function(d) {
            return chartHeight * d.value / 100;
        });

    // find the value text within the group, transition it to its right position and
    // text

    sel.select(".value")
        .transition()
        .duration(2000)
        .attr("y", function(d) {
            return height - margin - (chartHeight * d.value / 100) - 20;
        })
        .text(function(d) {
            return d.value + "%";
        });

    initializeBarView(category, ethnicity, n, data);
}

function updateBarView(category, ethnicity, n) {
    document.getElementById("label").innerHTML = category + " breakdown for " + ethnicity;
    var data = getDataRows(category, ethnicity);
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    var svg = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {


        x.domain(data.map(function(d) {
            return d.group;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.value;
        })]);


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);



        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Percentage of Users");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d.group);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .style("fill", '#' + Math.random().toString(16).substr(-6));
    });

    function type(d) {
        d.value = +d.value;
        return d;
    }

}