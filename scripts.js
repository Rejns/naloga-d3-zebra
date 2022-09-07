// set the dimensions and margins of the graph
//const margin = {top: 30, right: 30, bottom: 70, left: 80};

let maxSale = null;

// Parse the Data
d3.csv("assets/Multiples.csv", function(data) {
    calcAvgPerCategory(data);
    getMaxSales(data);
    const groupsByDistrict = d3.group(data, d => d.District)
    let idx = 0;
    groupsByDistrict.forEach((group, key)=> {
        g = document.createElement('div');
        g.setAttribute("id", idx);
        g.innerHTML = '<div class="title">' + key + '</div>';
        document.getElementById('container').append(g);
        sortDataByAverageCatSales(group);
        appendSvg(idx, group, idx);
        idx++;
    });
});

function calcAvgPerCategory(data) {
    const groupsByCategory = d3.group(data, d => d.Category);
    groupsByCategory.forEach(group => {
        group.forEach((d) => {
            d['This Year Sales'] = d['This Year Sales'].substring(1);
        });

        let avg = d3.mean(group, d => +d['This Year Sales']);

        group.forEach((d) => {
            d.avg = avg;
        });
    });
}

function getMaxSales(data) {
    maxSale = d3.max(data, d => +d['This Year Sales']);
}

function sortDataByAverageCatSales(data) {
    data.sort(function(a, b) {
        return d3.descending(a.avg, b.avg);
    });
}

function appendSvg(divId, data, idx) {
    const max = d3.max(data, d => +d['This Year Sales']);

    const margin = {top: 30, right: 15, bottom: 70, left: idx > 0 ? 0 : 100};
    const width = (idx === 0 ? (260 * max/maxSale) + 100 : (260 * max/maxSale)) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    let svg = d3.select(document.getElementById(divId))
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // X axis
    const x = d3.scaleLinear()
        .domain([0, max])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .call(g => g.select(".domain").remove())
        .selectAll("text").remove()
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Y axis
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function(d) { return d.Category; }))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style('text-anchor','start')
        .attr('transform', function() { return 'translate(-80,0)' });


    if (idx > 0) {
        svg.selectAll("text").remove()
    }


    //Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.Category); })
        .attr("width", function(d) { return x(d['This Year Sales']); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#404040")
}
