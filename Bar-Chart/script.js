var dataSet=[];
var yAxisDataSet=[];
var xAxisDataSet=[];
    document.addEventListener('DOMContentLoaded', function(){
        fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
        .then(response=>response.json())
        .then(data=>{
        data.data.forEach(addYAxisDateSet);
        function addYAxisDateSet(currValue, index, arr){
            yAxisDataSet.push(arr[index][1])
            xAxisDataSet.push(arr[index][0])
        }
        console.log(data);
        dataSet=data.data;
        })
        .then(()=>{loadEverything()})
    })
function loadEverything(){
    var width=900;
    var height=460;
    var svg=d3.select('#container')
    .append('svg')
    .attr('width', width)
    .attr('height',height)
    .style('background-color','white');

    var yScaleBar=d3.scaleLinear()
    .domain([0,d3.max(yAxisDataSet)])
    .range([0,height-50]);

    var yScaleAxis=d3.scaleLinear()
    .domain([0,d3.max(yAxisDataSet)])
    .range([height-50,0]);

    var y_axis=d3.axisLeft()
    .scale(yScaleAxis);

    var xScale=d3.scaleTime()
    .domain([new Date(parseInt(xAxisDataSet[0].split('-')[0]),
    parseInt(xAxisDataSet[0].split('-')[1]),
    parseInt(xAxisDataSet[0].split('-')[2])),
        new Date(parseInt(xAxisDataSet[xAxisDataSet.length-1].split('-')[0]),
        parseInt(xAxisDataSet[xAxisDataSet.length-1].split('-')[1])+3,
        parseInt(xAxisDataSet[xAxisDataSet.length-1].split('-')[2]))])
    .range([0,width-100]);

    var x_axis=d3.axisBottom()
    .scale(xScale);

    var g = svg.append('g');

    g.append('g')
    .attr('transform','translate(60,10)')
    .attr('id','y-axis')
    .call(y_axis);

    g.append('g')
    .attr('transform','translate(60,'+(height-40)+')')
    .attr('id','x-axis')
    .call(x_axis);

    g.selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('data-gdp',(d)=>{
        return d[1]
    })
    .attr('data-date',(d)=>{
        return d[0]
    })
    .attr('height',(d)=>{
        return yScaleBar(d[1]);
    })
    .attr('y',(d)=>{
        return height - yScaleBar(d[1])-40;
    })
    .attr('x',(d)=>{
        return xScale(new Date(parseInt(d[0].split('-')[0])
        ,parseInt(d[0].split('-')[1])
        ,parseInt(d[0].split('-')[2])))+60
    })
    .attr('width',(d,i)=>{
        return (width-100)/dataSet.length
    })
    .on('mouseover', function(d){
        var x=xScale(new Date(parseInt(d[0].split('-')[0])
        ,parseInt(d[0].split('-')[1])
        ,parseInt(d[0].split('-')[2])))+60;

        var toolTip=d3.select('#tooltip')
        .style('opacity',0.9)
        .style('left',x+30+'px')
        .style('bottom',165+'px')
        .attr('data-date',d[0]);

        toolTip.append('text')
        .attr('id','tooltip-text')
        .html(()=>{
            var q;
            if(d[0].split('-')[1]==='01'){
                q='Q1';
            }else if(d[0].split('-')[1]==='04'){
                q='Q2';
            }else if(d[0].split('-')[1]==='07'){
                q='Q3';
            }else{
                q='Q4';
            }
            return d[0].split('-')[0]+' '+q+'<br>'+'$'+d[1]+' Billion';
        });
    })
    .on('mouseout',function(){
        d3.select('#tooltip')
        .style('opacity',0);
        d3.select('#tooltip-text').remove();
    })

    d3.select('svg').append('text')
    .text('Gross Domestic Product')
    .attr('id','gdp')
    .attr('transform','translate(80,220) rotate(-90)')
    
    ;
    d3.select('#container')
    .append('div')
    .attr('id','info')
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .style('margin-left',480);

    d3.select('#container')
        .append('div')
        .attr('id','tooltip');
}