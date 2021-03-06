var dataSet=[];
var xAxisDataSet=[];
var yAxisDataSet=[];
var legendDataSet=[1.7,2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8]
document.addEventListener('DOMContentLoaded',function(){
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response=>response.json())
    .then(data=>{
        data.monthlyVariance.forEach(addToDataSets);
        function addToDataSets(currValue,index,arr){
        xAxisDataSet.push(arr[index].year);
        yAxisDataSet.push(arr[index].month);
    }
    dataSet=data.monthlyVariance;
    })
    .then(()=>loadEverything())
})
function loadEverything(){
    var width=((dataSet.length*5)/12)+300;
    var height=550;
    var base=8.66;
    var header=d3.select('body')
    .append('div')
    .attr('id','header');

    var title=d3.select('#header')
    .append('text')
    .attr('id','title')
    .text('Monthly Global Land-Surface Temperature')
    .style('font-size',25+'px')
    .style('padding-bottom',25+'px')
    .style('padding-top',20+'px');

    var description=d3.select('#header')
    .append('text')
    .attr('id','description')
    .text('1753 - 2015: base temperature 8.66℃')
    .style('font-size',20+'px')
    .style('padding-bottom',20+'px');

    var container=d3.select('body')
    .append('div')
    .attr('id','container')
    .style('width',width);

    var tooltip=d3.select('#container')
    .append('div')
    .attr('id','tooltip');

    var svg=d3.select('#container')
    .append('svg')
    .attr('width',width)
    .attr('height',height);

    var xScale=d3.scaleTime()
    .domain([new Date(d3.min(xAxisDataSet),1,1), 
    new Date(d3.max(xAxisDataSet)+1,1,1)])
    .range([0,1330]);

    var yScale=d3.scaleTime()
    .domain([new Date(2014,11,15),new Date(2015,11,15)])
    .range([0,height-150]);

    var legendScale=d3.scaleLinear()
    .domain([1.7,13.9])
    .range([0,400]);
   
    var colorScale = d3.scaleThreshold()
    .domain([2.9, 4, 5.1, 6.2, 7.3, 8.4, 9.6, 10.7, 11.8, 12.8])
    .range(['rgb(49, 54, 149)','rgb(69, 117, 180)','rgb(116, 173, 209)','rgb(171, 217, 233)','rgb(224, 243, 248)',
    'rgb(255, 255, 191)','rgb(254, 224, 144)','rgb(253, 174, 97)','rgb(244, 109, 67)','rgb(215, 48, 39)','rgb(165, 0, 38)']);

    var xAxis=d3.axisBottom()
    .tickFormat(d3.timeFormat('%Y'))
    .ticks(26)
    .tickSizeOuter(0)
    .scale(xScale);

    var yAxis=d3.axisLeft()
    .tickFormat(d3.timeFormat('%B'))
    .tickSizeOuter(0)
    .scale(yScale);

    var legendAxis=d3.axisBottom()
    .tickValues([2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8])
    .tickFormat(d3.format('.1f'))
    .tickSizeOuter(0)
    .tickSizeInner(12)
    .scale(legendScale);

    var heatMap=svg.append('g');

    heatMap.append('g')
    .attr('id','x-axis')
    .attr('transform','translate(140,420)')
    .call(xAxis);

    heatMap.append('g')
    .attr('id','y-axis')
    .attr('transform','translate(139,20)')
    .call(yAxis);

    heatMap.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('class','cell')
    .attr('data-month',(d)=>{
        return d.month-1;
    })
    .attr('data-year',(d)=>{
        return d.year;
    })
    .attr('data-temp',(d)=>{
        return base+d.variance
    })
    .attr('y',(d)=>{
        return yScale(new Date(2015,d.month-1,2))
    })
    .attr('x',(d)=>{
        return xScale(new Date(d.year,1,1))+140;
    })
    .attr('width',6)
    .attr('height',34)
    .style('fill',(d)=>{
        var temp=base+d.variance;
        temp=Math.round(temp*10)/10;
        return colorScale(temp);
    })
    .on('mouseover',function(d){
        d3.select(this).style('stroke','black');
        var month;
        var temp=base+d.variance;
        temp=Math.round(temp*10)/10;
        if(d.month==1){
            month='January'
        }else if(d.month==2){
            month='February'
        }else if(d.month==3){
            month='March'
        }else if(d.month==4){
            month='April'
        }else if(d.month==5){
            month='May'
        }else if(d.month==6){
            month='June'
        }else if(d.month==7){
            month='July'
        }else if(d.month==8){
            month='August'
        }else if(d.month==9){
            month='September'
        }else if(d.month==10){
            month='October'
        }else if(d.month==11){
            month='November'
        }else{
            month='December'
        }
        tooltip.append('text')
        .html(()=>{
            return d.year+' - '+month+'<br>'+temp+'&degC'+'<br>'+(Math.round(d.variance*10)/10)+'&degC';
        });
        var tooltipWidth=document.getElementById('tooltip').clientWidth;
        var tooltipHeight=document.getElementById('tooltip').clientHeight;
        tooltip.style('opacity',0.9)
        .attr('data-year',d.year)
        .style('left',()=>{
            return xScale(new Date(d.year,1,1))+150-(tooltipWidth/2)+'px';
        })
        .style('top',()=>{
            var balancer=0;
            if(tooltipHeight>80){
                balancer=tooltipHeight-80;
            }
            return yScale(new Date(2015,d.month-1,1))+30-balancer+'px';
        });
    })
    .on('mouseout',function(d){
        tooltip.select('text')
        .remove();
        tooltip.style('opacity',0);
        d3.select(this).style('stroke','none')
    });
    var legend=svg.append('g')
    .attr('transform','translate(140,520)')
    .attr('id','legend');

    legend.append('g')
    .call(legendAxis);

    legend.selectAll('rect')
    .data(legendDataSet)
    .enter()
    .append('rect')
    .attr('width',39)
    .attr('height',27)
    .attr('x',(d)=>{
        return legendScale(d);
    })
    .attr('y',-26)
    .attr('value',(d)=>{
        return d;
    })
    .style('stroke','black')
    .style('fill',(d)=>{
        return colorScale(d);
    });

    var monthDesc=svg.append('text')
    .attr('id','monthDesc')
    .attr('transform','translate(30,250) rotate(-90)')
    .text('Months');

    var yearDesc=svg.append('text')
    .attr('id','yearDesc')
    .attr('transform','translate(780,465)')
    .text('Years');
}