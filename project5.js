window.addEventListener("load", run);

var GLOBAL = {
        data: [],
        color: ["blue","red","darkgrey","white","green"],
        varTypes: {"body": "cat", "diet": "cat", "religion": "cat", "drinks": "cat", 
               "drugs": "cat", "education": "cat", "ethnicity": "cat", "height": "cont", 
               "income": "cont", "job": "cat", "offspring": "cat", "orientation": "cat", 
               "pets": "cat", "religion": "cat", "sex": "cat", "smokes": "cat", 
               "speaks": "cat", "wordcount": "cont"} //tags CATegorical or CONTinuous variables
}

function run() {
    d3.selectAll("svg")
	    .append("text")
		.attr("x",100)
		.attr("y",150)
		.attr("dy","0.35em")
		.text("Pick two variables to see their relationship!");

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