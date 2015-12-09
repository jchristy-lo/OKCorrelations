window.addEventListener("load", run);

var GLOBAL = {
        data: [],
        color: ["blue","red","darkgrey","white","green"],
        varTypes: {"body": "cat", "diet": "cat", "religion": "cat", "drinks": "cat", "drugs": "cat", "education": "cat", 
        	"ethnicity": "cat", "height": "cont", "income": "cont", "job": "cat", "offspring": "cat", "orientation": "cat", 
            "pets": "cat", "religion": "cat", "sex": "cat", "smokes": "cat", "speaks": "cat", "wordcount": "cont"}, //tags CATegorical or CONTinuous variables
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
}

function tabOn (xvar, yvar){
	GLOBAL.tabbedData = {};
	GLOBAL.data.forEach(function (profile) {
		var profY = profile[yvar];
		var profX = profile[xvar];
		// console.log("x is "+profX+", y is "+profY);
		if (profY != "" & profX != "" & profY != undefined & profX != undefined){
		if(profY in GLOBAL.tabbedData){
			if(profX in GLOBAL.tabbedData[profY]){
				console.log("A");
				GLOBAL.tabbedData[profY[profX]] += 1;
			}else{
				console.log("B");
				GLOBAL.tabbedData[profY[profX]] = 1;
			}
		}else{
			console.log("C");
			GLOBAL.tabbedData[profY] = {};
			GLOBAL.tabbedData[profY[profX]] = 1;
		}}
    });

    console.log(GLOBAL.tabbedData);
}

function scatterPlot (xvar, yvar){

}

function getWordcount(){
	
}

function sortType (xvar , yvar){
	tabOn(xvar, yvar);
	if(GLOBAL.varTypes[xvar] === "cont" & GLOBAL.varTypes[yvar] === "cont"){
		scatterPlot(xvar,yvar);
	}
}

function noSelected (){
	var viz = d3.select("#viz")
	viz.append("text")
		.attr("x",100)
		.attr("y",150)
		.attr("dy","0.35em")
		.text("Pick two variables to see their relationship!");
}

function updateX (selection){
	selection = selection.value
	GLOBAL.xSelect = selection;

	if(selection==="" | GLOBAL.ySelect ===""){noSelected;}
	else{
		sortType(selection, GLOBAL.ySelect)
	}
}

function updateY (selection){
	selection = selection.value
	GLOBAL.ySelect = selection;

	if(selection==="" | GLOBAL.xSelect===""){noSelected;}
	else{
		sortType(GLOBAL.xSelect, selection)
	}
}

function getDataRows (f) {
    d3.csv("profiles.csv",
	   function(error,data) {
	       f(data);
	   });
}