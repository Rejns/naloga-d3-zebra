// Following steps order and formatting Amelia Wattenberger outlines
// in her Fullstack D3 book. This structure helps organize
// all the steps we have to take in d3!

// 1. Access data
const dataset = [
    {
        name: "puppies",
        quantity: 10
    },
    {
        name: "kittens",
        quantity: 8
    },
    {
        name: "bananas",
        quantity: 12
    },
    {
        name: "pizzas",
        quantity: 8
    },
    {
        name: "avocados",
        quantity: 3
    },
    {
        name: "lasagnas",
        quantity: 4
    },
]

const yAccessor = d => d.quantity
const xAccessor = d => d.name

// 2. Create chart dimensions
let dimensions = {
    width: 500,
    height: 400,
    margin: {
        top: 15,
        right: 15,
        bottom: 60,
        left: 40,
    },
}

dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

// 3. Draw canvas

const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

const bounds = wrapper.append("g")
    .style("transform", `translate(${
        dimensions.margin.left
        }px, ${
        dimensions.margin.top
        }px)`)

// 4. Create scales

const xScale = d3.scaleBand()
    .domain(dataset.map(d => d.name))
    .range([0, dimensions.boundedWidth])
    .padding(0.2)

const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, yAccessor)])
    .range([dimensions.boundedHeight, 0])

// 5. Draw data

bounds.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr('x', d => xScale(d.name))
    .attr("y", d => yScale(yAccessor(d)))
    .attr('width', d => xScale.bandwidth())
    .attr("height", d => dimensions.boundedHeight
        - yScale(d.quantity)
    )

// 6. Draw peripherals

const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .attr("class", "axis x-axis")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)

const xAxisLabel = xAxis.append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .style("font-size", "1.4em")
    .text("Our chart of amazing things")
    .attr("fill", "black")

const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

const yAxis = bounds.append("g")
    .attr("class", "axis y-axis")
    .call(yAxisGenerator)

const yAxisLabel = yAxis.append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
    .style("font-size", "1.4em")
    .text("Quantity")
    .attr("fill", "black")


// 7. Set up interactions

bounds.selectAll("rect")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave)

const tooltip = d3.select("#tooltip")
function onMouseEnter(datum) {
    tooltip.text(yAccessor(datum) + " " + datum.name)

    const x = (xScale.bandwidth() / 2)
        + xScale(datum.name)
        + dimensions.margin.left
    const y = yScale(yAccessor(datum))
        + dimensions.margin.top

    tooltip.style("transform", `translate(`
        + `calc(-50% + ${x}px),`
        + `calc(-100% + ${y}px)`
        + `)`)
    tooltip.style("opacity", 1)
}

function onMouseLeave() {
    tooltip.style("opacity", 0)
}