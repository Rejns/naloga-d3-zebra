let maxSale = null;

d3.csv("assets/Multiples.csv", data => {
    removeDollarSign(data);
    calcAvgPerCategory(data);
    calcMaxSale(data);
    drawDataByGroup(data);
});

const drawDataByGroup = (data) => {
    let idx = 0;
    const groupsByDistrict = d3.group(data, d => d.District);

    groupsByDistrict.forEach((group, key) => {
        sortByAvgCatSales(group);
        appendDiv(key, idx);
        appendSvg(group, idx);
        idx++;
    });
}

const appendDiv = (title, idx) => {
    let g = document.createElement('div');
    g.setAttribute("id", idx);
    g.innerHTML = `<div class="title">${title}</div>`;
    document.getElementById('container').append(g);
}

const removeDollarSign = (data) => {
    data.forEach(d => d['This Year Sales'] = d['This Year Sales'].substring(1));
}

const calcAvgPerCategory = (data) => {
    const groupsByCategory = d3.group(data, d => d.Category);
    groupsByCategory.forEach(group => {
        group.forEach((d) => d.avg = d3.mean(group, d => +d['This Year Sales']));
    });
}

const calcMaxSale = (data) => {
    maxSale = d3.max(data, d => +d['This Year Sales']);
}

const sortByAvgCatSales = (data) => {
    data.sort((a, b) => d3.descending(a.avg, b.avg));
}

const appendSvg = (data, idx) => {
    const max = d3.max(data, d => +d['This Year Sales']);
    const margin = {top: 30, right: 15, bottom: 70, left: idx === 0 ? 100 : 0};
    const width = (idx === 0 ? (260 * max/maxSale) + 100 : (260 * max/maxSale)) - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    let svg = d3.select(document.getElementById(idx))
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
        .domain(data.map(d => d.Category))
        .padding(.1);
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style('text-anchor','start')
        .attr('transform', () => 'translate(-80,0)');


    if (idx > 0) {
        svg.selectAll("text").remove()
    }

    //Bars
    svg.selectAll("myRect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", x(0))
        .attr("y", (d) => y(d.Category))
        .attr("width", d => x(d['This Year Sales']))
        .attr("height", y.bandwidth())
        .attr("fill", "#404040")
}
