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
        console.log(GLOBAL.data);
        getWordcount();
    });
    initializeBarView();
}

function tabOn(xvar, yvar) {
    console.log("XVAR is " + xvar);
    GLOBAL.data.forEach(function(profile) {
        if (profile.yvar in GLOBAL.tabbedData) {
            if (profile.xvar in GLOBAL.tabbedData.yvar) {
                GLOBAL.tabbedData.yvar.xvar = +1;
            } else {
                GLOBAL.tabbedData.yvar.xvar = 1;
            }
        } else {
            GLOBAL.tabbedData.yvar = {};
            GLOBAL.tabbedData.yvar.xvar = +1;
        }
    });

    console.log(GLOBAL.tabbedData);
}

function scatterPlot(xvar, yvar) {

}

function getWordcount() {
    GLOBAL.data.forEach(function(profile) {
        if (profile.yvar in GLOBAL.tabbedData) {
            if (profile.xvar in GLOBAL.tabbedData.yvar) {
                GLOBAL.tabbedData.yvar.xvar = +1;
            } else {
                GLOBAL.tabbedData.yvar.xvar = 1;
            }
        } else {
            GLOBAL.tabbedData.yvar = {};
            GLOBAL.tabbedData.yvar.xvar = +1;
        }
    });
}

function sortType(xvar, yvar) {
    tabOn(xvar, yvar);
    if (GLOBAL.varTypes[xvar] === "cont" & GLOBAL.varTypes[yvar] === "cont") {
        scatterPlot(xvar, yvar);
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