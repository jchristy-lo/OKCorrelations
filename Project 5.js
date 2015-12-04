window.addEventListener("load", run);

var GLOBAL = {
        data: [],
        color: ["blue","red","darkgrey","white","green"],
}

function run() {
    d3.selectAll("svg")
	    .append("text")
		.attr("id","loading")
		.attr("x",100)
		.attr("y",150)
		.attr("dy","0.35em")
		.text("loading data...");

	getDataRows(function(data) {
	   GLOBAL.data = data;
    });
}

function getDataRows (f) {
    d3.csv("profiles.csv",
	   function(error,data) {
	       f(data);
	   });
}