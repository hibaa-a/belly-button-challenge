function init() {
    //grabbing a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // using the list of sample names for the select options
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        // using the first sample from the list to build plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);

    });
}

// initialising the dashboard
init();

function optionChanged(newSample) {
    // grabbing new data each time a sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// demographics panel
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;

      // filtering data to get object with selected sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      // using d3 to select panel 
      var PANEL = d3.select("#sample-metadata");

      // using html("") to clear existing metadata
      PANEL.html("");

      // using object.entries to add each pair to panel
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  // creating the buildcharts function
  function buildCharts(sample) {

    // using d3.json to load and grab the samples.json file
    d3.json("data/samples.json").then((data) => {

        // creating a variable that holds the sample array
        var samples = data.samples;

        // creating a variable that filters the samples
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

        // creating a variable that holds the first sample
        var result = resultArray[0];

        // creating variavles that hold the otu_ids, otu_labels, and sample_value
        var  ids = result.otu_ids;
        var labels = result.otu_labels.slice(0, 10).reverse();
        var values = result.sample_values.slice(0,10).reverse();
        var bubbleLabels = result.otu_labels;
        var bubbleValues = result.sample_values;

        // creating the yticks for the barchart
        var yData = result.otu_ids.slice(0,10);
        var yLabels = [];
        yData.forEach(function(sample){
            yLabels.push(`OTU ${sample.toString()}`);
        });
        
        console.log(yLabels)

        // creating the trace for the barchart
        var barTrace = {
            x: values.slice(0,10).reverse(),
            y: yLabels.reverse(),
            text: result.otu_labels.slice(0,10),
            type: "bar",
            orientation: "h"
    };
    
    var barData = [barTrace];
    
    Plotly.newPlot("bar", barData);

    // creating barchart layout
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found"
       };
       
       // using Plotly to plot the data with the layout
       Plotly.newPlot("bar", barData, barLayout);

       // bubble chart
       var bubbleData = [{
        x: ids,
        y: bubbleValues,
        text: bubbleLabels,
        mode: "markers",
         marker: {
           size: bubbleValues,
           color: bubbleValues,
           colorscale: "Portland" 
         }
      }];

      // creating the bubble chart layout
      var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        automargin: true,
        hovermode: "closest"
    };

    // using Plotly to plot the data with the layout
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

});
}
