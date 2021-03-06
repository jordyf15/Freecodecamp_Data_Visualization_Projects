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
function loadEverything(){
    width=920;
    height=630;

    var svg=d3.select('body')
    .append('svg')
    .attr('height',height)
    .attr('width',width);
     
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

   var tooltip=d3.select('body')
   .append('div')
   .attr('id','tooltip');
}
