# Scatter Plot
In this README-Scatter-Plot file, there will be descriptions and explanations for the project.

## Description
In this project we are asked to create  a Scatter Plot Graph for Doping Cases in Professional Bicycle Racing.
  
### Test/User-Stories
The test or user stories that must be passed are:  
1. I can see a title element that has a corresponding id="title".
2. I can see an x-axis that has a corresponding id="x-axis".
3. I can see a y-axis that has a corresponding id="y-axis".
4. I can see dots, that each have a class of dot, which represent the data being plotted.
5. Each dot should have the properties data-xvalue and data-yvalue containing their corresponding x and y values.
6. The data-xvalue and data-yvalue of each dot should be within the range of the actual data and in the correct data format. For data-xvalue, integers (full years) or Date objects are acceptable for test evaluation. For data-yvalue (minutes), use Date objects.
7. The data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis.
8. The data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis.
9. I can see multiple tick labels on the y-axis with %M:%S time format.
10. I can see multiple tick labels on the x-axis that show the year.
11. I can see that the range of the x-axis labels are within the range of the actual x-axis data.
12. I can see that the range of the y-axis labels are within the range of the actual y-axis data.
13. I can see a legend containing descriptive text that has id="legend".
14. I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
15. My tooltip should have a data-year property that corresponds to the data-xvalue of the active area.

### Dataset
The dataset that we will need to complete this project are  
https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json

## Structure of the Scatter Plot Graph
```
<body>
    <svg>
        <text id="title">
        <text id="subtitle">
        <text id="yAxisDesc">
        <g>
            <g id="x-axis">
            <g id="y-axis">
            // all circle elements
        </g>
        <g id="legend">
    </svg>
    <div id="tooltip">
</body>
```

## Step-by-step Making and Code Explanation
1. Retrieve the data from the URL given using the fetch method.  
The first thing to do is the same as the previous project, which is to retrieve the data from the URL with fetch method and also create variables to store the data needed.
```
var xAxisDataSet=[];
var yAxisDataSet=[];
var dataSet;
document.addEventListener('DOMContentLoaded', function(){
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response=>response.json())
    .then(data=>{
        data.forEach(addToDataSets);
        function addToDataSets(currValue,index,arr){
            xAxisDataSet.push(arr[index].Year);
            yAxisDataSet.push(arr[index].Time);
        }
        dataSet=data;
    })
    .then(()=>loadEverything());
})
```
We store the data that was retrieved into the variables so we can use it later. After that we call a function that will load everything. The reason for that is because the fetch method is asynchronous, we need to make sure that it finished retrieving the data and also putting in the variables that will be used in loading the graph. Before we can load the graph.  
  
2. Creating the svg and set it's height and width.  
After retrieving the data we should create the svg just like the previous project.
```
  width=920;
    height=630;

    var svg=d3.select('body')
    .append('svg')
    .attr('height',height)
    .attr('width',width);
```
  
3. Appending Title, Subtitle, and yAxisDesc
```
var title = svg.append('text')
    .attr('id','title')
    .style('font-size',30)
    .attr('transform','translate(230,50)')
    .text('Doping in Proffesional Bicycle Racing');

    var subtitle= svg.append('text')
    .attr('id','subtitle')
    .attr('transform','translate(340,75)')
    .style('font-size',20)
    .text('35 Fastest times up Alpe d\'Huez');

    var yAxisDesc=svg.append('text')
    .attr('id','yAxisDesc')
    .attr('transform','translate(15,265) rotate(-90)')
    .style('font-size',10)
    .text('Time in Minutes');
```
In this project i appended the title, sub title and also the yAxis Description in the svg too.  
  
4. Creating xScale and yScale  
Just like the previous project, we also need to make scales that will be used to make the x and y axis and also the cx and cy attribute of the circles in the scatter plot graph.
 
    ```
    var xScale=d3.scaleTime()
        .domain([new Date(d3.min(xAxisDataSet)-1,0,1),
        new Date(d3.max(xAxisDataSet)+1,0,1)])
        .range([0,width-100]);

    var yScale=d3.scaleTime()
        .domain([new Date(2000,1,1,1,//year month day hour
        yAxisDataSet[0].split(':')[0],//minutes
        yAxisDataSet[0].split(':')[1]//second
        ),
        new Date(2000,1,1,1,//year month day hour
        yAxisDataSet[yAxisDataSet.length-1].split(':')[0],//minutes
        yAxisDataSet[yAxisDataSet.length-1].split(':')[1]//second
        )])
        .range([0,height-120])
    ```
    Both of the x scale and y scale is time, so we should use scaleTime which uses date object for its domain. So use the variables that you created before during the fetch method such as the xAxisDataSet and also the yAxisDataSet. So you can use the d3.max and min function to make it eazier.  
  
5. Creating the x and y Axis  
Just like the previous project we will make the x and y axis into each group. And then we make another group to contain both of them.
```
    var x_Axis=d3.axisBottom()
    .tickFormat(d3.timeFormat('%Y'))
    .scale(xScale);

    var y_Axis=d3.axisLeft()
    .tickFormat(d3.timeFormat('%M:%S'))
    .scale(yScale);

    var g = d3.select('svg')
    .append('g');

    g.append('g')
    .attr('transform','translate(60,'+(height-20)+')')
    .attr('id','x-axis')
    .call(x_Axis);

    g.append('g')
    .attr('transform','translate(60,100)')
    .attr('id','y-axis')
    .call(y_Axis);
```
There is a slight different than the previous project that is the tick format. To alter the tick format you can use the tickFormat function and set it to the requested format in the test/user stories.  
  
6. Creating the Scatter-Plot  
Unlike the previous project the scatter-plot doen't use rect elements but it uses circle elements.
```
g.selectAll('circle')
    .data(dataSet)
    .enter()
    .append('circle')
    .attr('class','dot')
    .attr('cx',(d)=>{
        return xScale(new Date(d.Year,0,1))+60
    })
    .attr('cy',(d)=>{
        return yScale(new Date(2000,1,1,1,
        parseInt(d.Time.split(':')[0]),
        parseInt(d.Time.split(':')[1]))
        )+100;
    })
    .attr('r',6)
    .attr('data-xvalue',(d)=>{
        return d.Year
    })
    .attr('datacxxvalue',(d)=>{
        return xScale(new Date(d.Year,0,1))+60
    })
    .attr('data-yvalue',(d)=>{
        return new Date(2000,1,1,1,
        parseInt(d.Time.split(':')[0]),
        parseInt(d.Time.split(':')[1]))
    })
    .style('fill',(d)=>{
        if(d.Doping.length>0){
            return '#1f77b4'
        }else{
            return '#ff7f0e'
        }
    })
   .style('stroke','black')
   .style('opacity',0.8)
```
First we select all circle elements then use the data method to use the dataset that we have. After that the enter method and append circle is used to append amount of circles needed to represent all the data in the dataset. Unlike rect elements the circle doen't use x and y attribute but cx and cy attributes. Other than that it also uses r for radius instead of height and witdh. And unlike the previous project the circles here doesnt use the same color. So you have to make function for the fill style to set the color to check if there is a doping or not. In here i check the doping length to see if it has a doping or not. The rest is the same like the previous project but with some alteration.  
  
7. Creating the tooltip  
Just like the previous project, append a div to be your tooltip in the body or any div that you created.
```
   var tooltip=d3.select('body')
   .append('div')
   .attr('id','tooltip');
```
  
8. Creating the legend  
the test also require us to create legend for the scatter plot graph.
```
    var legends=d3.select('svg')
   .append('g')
   .attr('transform','translate('+(width-50)+',320)')
   .attr('id','legend');

    var legendDope=legends.append('g');
    var legendNoDope=legends.append('g');

    legendDope.append('rect')
   .attr('width',20)
   .attr('height',20)
   .style('fill','#1f77b4')
   .attr('transform','translate(0,22)');

   legendDope.append('text')
   .text('Riders with doping allegations')
   .attr('transform','translate(-147,35)');

   legendNoDope.append('rect')
   .attr('width',20)
   .attr('height',20)
   .style('fill','#ff7f0e');

   legendNoDope.append('text')
   .text('No doping allegations')
   .attr('transform','translate(-110,14)');
```
In here i created a group to contain both of the legend(doping and no doping). After that i created two groups each for the legends that will contain the rect elements that will represent the color and also the text element that describe the legend.  
  
9. Creating the mouseover and mouseout function for the circles  
Just like the previous project we should create a on mouseover and on mouseout function for the circles
```
.on('mouseover', function (d){
       var mouseCoords= takeCoords(event);
       d3.select('#tooltip')
       .style('opacity',0.9)
       .style('top',()=>{
        return yScale(new Date(2000,1,1,1,
        parseInt(d.Time.split(':')[0]),
        parseInt(d.Time.split(':')[1]))
        )+70+'px';
       })
       .style('left',()=>{
           return mouseCoords;
       })
       .attr('data-year',d.Year)
       .append('text')
       .html(()=>{
        return d.Name+': '+d.Nationality+'<br>'+'Year: '+d.Year+', Time: '+d.Time
            +"<br><br>"+d.Doping;
       })
   })
   .on('mouseout',function(d){
       d3.select('#tooltip')
       .style('opacity',0);
       d3.select('#tooltip text')
       .remove();
   });
   function takeCoords(event){
       return event.clientX;
   }
```
It's almost the same with the previous one, but to make it the same as in the example i created another function to take the x coordination of the mouse during mouseover function. The x coordination will later be used for the left style of the tooltip.
  
As for the css there is nothing new, just slight alteration to make it look the same in the example.

