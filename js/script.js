var DVizModule = (() => {

    const margin = {
            top: 20,
            right: 0,
            bottom: 30,
            left: 40
        };

        let xScale, yScale,
        xAxis, yAxis, format;

    async function svgView(dataset) {
        dataset = await loadData();
        const barHeight = 25;
        return {
            width: 954,
            height: dataset.length * barHeight + margin.top + margin.bottom
        }
    }

    function loadData() {
       return d3.csv("data/alphabet.csv",
       ({letter, frequency}) => ({
        name: letter,
        value: +frequency
       }));
    }

    async function formatData(dataset) {
        dataset = await loadData();
        dataset.sort((a, b) => b.value - a.value);
        return dataset;
    }

    async function scaleData(dataset) {
        dataset = await formatData();
        svg = await svgView();

        xScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.value)]).nice()
            .range([margin.left, svg.width - margin.right]);

        yScale = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .range([margin.top, svg.height - margin.bottom])
            .padding(0.1);

        format = xScale.tickFormat(20);
    }

    async function axisData(dataset) {
        dataset = await formatData();
        svg = await svgView();

        xAxis = g => g
            .attr("transform", `translate(0, ${margin.top})`)
            .call(d3.axisTop(xScale).ticks(svg.width / 80))
            .call(g => g.select(".domain").remove());

        yAxis = g => g
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale).tickFormat(i => dataset[i].name).tickSizeOuter(0));
    }

    async function plotData(dataset) {
        dataset = await formatData();
        svg = await svgView();

        const chart = d3.select("#chart")
            .append("svg")
            .attr("width", svg.width)
            .attr("height", svg.height);

        chart.append("g")
            .attr("fill", "#4c1f92")
            .selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("y", (d, i) => yScale(i))
            .attr("x", xScale(0))
            .attr("width", d => xScale(d.value) - xScale(0))
            .attr("height", yScale.bandwidth());

        chart.append("g")
            .selectAll("text")
            .data(dataset)
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

    formatData();
    scaleData();
    axisData();
    plotData();

})();




