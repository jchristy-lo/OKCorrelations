function initializeBarView(category1, category2, zoom) {

    var data = GLOBAL.tabbedData;

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

    var x = d3.scale.ordinal().rangeRoundBands([0, chartW], .1);

    var y = d3.scale.linear()
        .range([chartH, 0]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#viz")
        .attr("width", chartW + margin.left + margin.right)
        .attr("height", chartH + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var totals = [];
    for (key in data) { //loop through to accumulate the total values
        // console.log(key);
        // console.log("prev: ");
        // console.log(data[key]);
        var tot = 0;
        var countCat = 0;
        for (cat in data[key]) {
            var val = data[key][cat];
            tot = val + tot;
        }
        totals[key] = tot; //it totals into an array
        // console.log("post: ");
        // console.log(data[key]);
    }

    var remap = new Array();
    //this is the remapping
    for (key in data) {
        // console.log(key);
        // console.log("prev: ");
        // console.log(data[key]);
        var prev = 0;
        var countCat = 0;
        for (cat in data[key]) {
            if (zoom) {
                var val = (data[key][cat] / totals[key]) * 100;
            } else {
                var val = data[key][cat];
            }

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
                "category": cat,
                "iden": countCat
            });
            countCat = countCat + 1;
            prev = val + prev;
        }
        // console.log("post: ");
        // console.log(data[key]);
    }
    //console.log(remap);
    x.domain(Object.keys(GLOBAL.tabbedData).map(function(d) {
        return d;
    }));
    y.domain([0, d3.max(remap, function(d) {
        return d.y1;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chartH + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    svg.append("text")
        .attr("dy", "3.5em")
        .text("Reported " + category2)
        .attr("transform", "translate(0," + chartH + ")")


    if (zoom) {
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.29em")
            .style("text-anchor", "end")
            .text("Percentage breakdown of " + category1 + " users (%)");

    } else {
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.29em")
            .style("text-anchor", "end")
            .text("Aggregate number of " + category1 + " users (#)");
    }

  
     var arrayofStuff = Object.keys(GLOBAL.tabbedData[Object.keys(GLOBAL.tabbedData)[0]]);
  
    for (val in remap) {


        var width = (chartW) / Object.keys(GLOBAL.tabbedData).length;
        var spacing = remap[val].x * width;
        var length = y(remap[val].y0) - y(remap[val].y1);

        var category = svg
            .append("g")
            .attr("class", "g")
            .attr("transform", "translate(" + spacing + ",0)")


        category
            .append("rect")
            .attr("width", width)
            .attr("y", y(remap[val].y1))
            .attr("height", length)
            .style("fill", function() {
                return GLOBAL.color[arrayofStuff.indexOf(remap[val].category)]; // this is where coloring is
            })
            .on("click", function() {
                initializeBarView(category1, category2, !zoom);
            })
            .on('mouseover', function(d) {
                var nodeSelection = d3.select(this).style({
                    opacity: '0.8'
                });
                nodeSelection.select("text").style({
                    opacity: '1.0'
                });
            })
            .on('mouseout', function(d) {
                var nodeSelection = d3.select(this).style({
                    opacity: '1.0'
                });
                nodeSelection.select("text").style({
                    opacity: '1.0'
                });
            });

    }
 
    console.log(arrayofStuff);
    var legend = svg.selectAll(".legend")
        .data(arrayofStuff)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(50," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", chartW - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {

            return GLOBAL.color[arrayofStuff.indexOf(d)];

        });

    legend.append("text")
        .attr("x", chartW - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });

}