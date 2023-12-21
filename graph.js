
// pair programming: https://chat.openai.com/c/a1d9bdc7-4f86-48ab-8094-533822dcf07b

// Sample data points
let dataPoints = JSON.parse(localStorage.getItem('dataPoints')) || [];


    // these are the metrics for the datapoints
    let metrics = [
      { label: "weight", unit: "kg", min: 0, max: 120 },
      { label: "worked", unit: "hours", min: 0, max: 24 },
      { label: "sleep", unit: "hours", min: 0, max: 24 },
      { label: "stress", unit: "(1-10)", min: 1, max: 10 },
      { label: "dizziness", unit: "(1-10)", min: 1, max: 10 },
      { label: "memory", unit: "(1-10)", min: 1, max: 10 },
      { label: "focus", unit: "(1-10)", min: 1, max: 10 },
      { label: "ataxia", unit: "(1-10)", min: 1, max: 10 },
      { label: "clarity", unit: "(1-10)", min: 1, max: 10 },
    ];
        function getColorFromLabel(label) {
      const charCodes = label.split('').map(char => char.charCodeAt(0));
      const sum = charCodes.reduce((acc, val) => acc + val, 0);
      const r = sum % 192;
      const g = Math.floor(sum * 8.7) % 192;
      const b = Math.floor(sum * 5.19) % 192;
      return `rgb(${r}, ${g}, ${b})`;
    }
    for (let i = 0; i < metrics.length; i++) {
      let metric = metrics[i];
      metric.color = getColorFromLabel(metric.label);
    }
    // we initialise the colors from the labels

function numberFromLabel(str) {
  var nr = 0;
  for (var i = 0; i < str.length; i++) nr += str.charCodeAt(i);
  return nr % 997;
}
//make sure the datapoints are sorted by Timestamp (not necessary in normal circumstances,but hey..);
dataPoints.sort(byTimeStamp);

function byTimeStamp(a,b)
{
  return a.ts-b.ts;
}
  var width = 800;/* specify your desired width */;
  var height = 400; /* specify your desired height */;

// Function to handle button clicks and update the graph
var interval=1000;

function showGraph(startTime, endTime, xaxis) {
  console.log("showGraph" +startTime, endTime, xaxis);
  const width = 800;
  const height = 400;
  const graph = document.getElementById("graph-container");
  console.log(graph);
  graph.setAttribute("width", width);
  graph.setAttribute("height", height);

  // Create the SVG content
  let svgContent = '';

  // Create the x-axis lines and labels
  svgContent += '<g id="x-axis" stroke="#aaa">'; // x axis
  for (let i = startTime; i <= endTime; i += xaxis) {
    const x = ((i - startTime) * width) / (endTime - startTime);
    svgContent += '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + height + '"></line>';
    var dateString = new Date(i).toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' });
    console.log("full date label");
    if (xaxis <= 62 * 24 * 60 * 60 * 1000) {
      // stringify timestamp (i) to show dates, 12/11
      dateString = new Date(i).toLocaleDateString([], { month: 'numeric', day: 'numeric' });
      console.log("62 day period only dates");
    }
  
    if (xaxis <= 14 * 24 * 60 * 60 * 1000) {
      // stringify timestamp (i) to show days, ma ,di , wo ,do, etc.
      const days = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
      dateString = days[new Date(i).getDay()];
      console.log("14 day period date in daynames override");
    }
  
    if (xaxis <= 24 * 60 * 60 * 1000) {
      // stringify timestamp (i) to show hours, 13:00, 14:00, 15:00, etc.
      dateString = new Date(i).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      console.log("24 hour period date in hours override "+xaxis+"<="+(24 * 60 * 60 * 1000) );
    }
  
    // put in centered text label at bottom
    svgContent += '<text x="' + x + '" y="' + (height - 10) + '" text-anchor="middle" font-size="10">' + dateString + '</text>';
  }
  svgContent += '</g>';

  // Plot the data points for each metric
  const metricsToPlot = ['weight', 'stress', 'worked', 'dizziness', 'memory', 'focus', 'clarity']; // Your metrics
  metricsToPlot.forEach(metric => {
    svgContent += '<polyline points="';
    dataPoints.forEach(point => {
      const xPoint = ((point.ts - startTime) * width) / (endTime - startTime);
      const yPoint = height - (point[metric] / 10) * height; // Assuming data ranges from 1 to 10
      svgContent += xPoint + ',' + yPoint + ' ';
    });
    svgContent += '" style="fill:none;stroke:' + metrics.find(m => m.label === metric).color + ';stroke-width:2"/>';
  });

  // Close the SVG content
  svgContent += '</svg>';

  // Set the SVG content to the graph container
  graph.innerHTML = svgContent;
}
