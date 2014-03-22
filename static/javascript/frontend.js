var socket = io.connect('localhost');

 
// Create a fixed queue with some values.

nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(false)        //Show the x-axis
                .width(1500)
  ;

  chart.xAxis     //Chart x-axis settings
      .axisLabel('Time (ms)')
      .tickFormat(d3.format(',r'));

  chart.yAxis     //Chart y-axis settings
      .axisLabel('Sine Value')
      .tickFormat(d3.format('.02f'));

socket.on('connect',function(){
	socket.on('generate_sine',function(result){
		$('.time p').html("TIME: <span style='color:#2ca02c;'>" + Math.floor(result.time) + "</span> SECONDS <span style='font-size:13px;'>( since midnight of January 1, 1970 )</span>");
		//console.log(result.sin);
		var data=[{
			values: result.sin,
			key : "Time and Sine",
			color: '#2ca02c'
		}];
		//console.log(data);
		/*	- create a fixed-length queue, add in x amount of data points, 
			- if full, push value in tail, pop 1st value out
			- use d3 to show data as graph
		*/

		  /* Done setting the chart up? Time to render it!*/
		  var myData = data;   //You need data...

		  d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.   
		      .datum(myData)         //Populate the <svg> element with chart data...
		      .call(chart);          //Finally, render the chart!

		  //Update the chart when window resizes.
		  nv.utils.windowResize(function() { chart.update() });
		});
	});
});


