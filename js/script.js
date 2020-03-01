var Chart = (() => {

    let svg = {
            width: undefined,
            height: undefined,
            margin: {
                top: 20,
                right: 0,
                bottom: 30,
                left: 40
            },
            barHeight: 25
        },
        data,
        xScale, yScale,
        xAxis, yAxis,
        format;

    function init(data) {
        svg.width = 954;
        svg.height = data.length * svg.barHeight + svg.margin.top + svg.margin.bottom;
    }

    function loadData() {
       return d3.csv("data/alphabet.csv",
       ({letter, frequency}) => ({
        name: letter,
        value: +frequency
       }));
    }

    function formatData(data) {
        data.sort((a, b) => b.value - a.value);
        return data;
    }

    function scaleData(data, svg) {

        xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([svg.margin.left, svg.width - svg.margin.right]);

        yScale = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([svg.margin.top, svg.height - svg.margin.bottom])
            .padding(0.1);

        format = xScale.tickFormat(20);
    }

    function axisData(data, svg) {

        xAxis = g => g
            .attr("transform", `translate(0, ${svg.margin.top})`)
            .call(d3.axisTop(xScale).ticks(svg.width / 80))
            .call(g => g.select(".domain").remove());

        yAxis = g => g
            .attr("transform", `translate(${svg.margin.left}, 0)`)
            .call(d3.axisLeft(yScale).tickFormat(i => data[i].name).tickSizeOuter(0));
    }

    function plotData(data, svg) {

        const chart = d3.select("#chart")
            .append("svg")
            .attr("width", svg.width)
            .attr("height", svg.height);

        chart.append("g")
            .attr("fill", "#4c1f92")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("y", (d, i) => yScale(i))
            .attr("x", xScale(0))
            .attr("width", d => xScale(d.value) - xScale(0))
            .attr("height", yScale.bandwidth());

        chart.append("g")
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("fill", "#fff")
            .attr("font-size", "10px")
            .attr("x", d => xScale(d.value))
            .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .attr("dx", "-0.7em")
            .text(d => format(d.value));

        chart.append("g")
        .call(xAxis);

        chart.append("g")
        .call(yAxis);
    }

    return {
        data,
        svg,
        init,
        loadData,
        formatData,
        scaleData,
        axisData,
        plotData
    }

})();


(async () => {

    Chart.data = await Chart.loadData(); // load raw dataset
    Chart.data = Chart.formatData(Chart.data); // format dataset
    Chart.init(Chart.data); // initiate chart options based on data
    Chart.scaleData(Chart.data, Chart.svg); // setting domain and range
    Chart.axisData(Chart.data, Chart.svg); // setting axis X and Y
    Chart.plotData(Chart.data, Chart.svg); // draw the chart

})();



