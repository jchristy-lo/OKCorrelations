function initializeBarView(category, ethnicity, n) {
    var data = GLOBAL.data;
    //   document.getElementById("label").innerHTML = category + " breakdown for " + ethnicity;
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
        .rangeRound([height, 0]);

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
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // var data = getDataRows(category);

    color.domain(function(d) {
        if (d.group !== undefined)
            return d.group
    });


    var count = 0;
    /*
  data.forEach(function(d) {
    d.y0 = count;
    d.y1 = d.value+d.y0;
    count = d.y1;
    d.race = color.domain().map(function(value) { return {value: value, y0: y0, y1: y0 += d.value}; });
    d.total = d.race[d.race.length - 1].y1;
    //console.log("race" + d.race[2].y0);
  });*/
    var y0 = 0;
    var count = 0


    //do this on tab on

    data.forEach(function(d) {
        //console.log("group " + d.group)
        //console.log(d);
        if (d.ethnicity != "") {
            count += 1;
            console.log(count + " iteration");
            d.types = color.domain().map(function(group) {
                console.log(y0);
                return {
                    name: d.group,
                    y0: y0,
                    y1: y0 += +d.value
                };
            });

            if (count % n === 0) {
                y0 = 0;
            }

            //y0 += +d.value;
            //console.log(d.types)
            d.total = d.types[d.types.length - 1].y1;
        }
    });



    x.domain(data.map(function(d) {
        return d.ethnicity;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.total;
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
        .text("Accumulated percentage of users (%)");

    var ethnicity = svg.selectAll(".ethnicity")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
            return "translate(" + x(d.ethnicity) + ",0)";
        });

    ethnicity.selectAll("rect")
        .data(function(d) {
            return d.types;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            //console.log("Here " + y(d.y1));
            return y(d.y1);
        })
        .attr("height", function(d) {
            return y(d.y0) - y(d.y1);
        })
        .style("fill", function(d) {
            return color(d.name);
        });

    //So sorry for this.
    var array = color.domain().slice().reverse();
    array.pop();

    var legend = svg.selectAll(".legend")
        .data(array)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

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