async function runAsync() {
    const geoData = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
        .then(res => res.json())
        .catch(err => console.log(err))

    const educationData = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
        .then(res => res.json())
        .catch(err => console.log(err))

    const path = d3.geoPath();

    const width = 1000;
    const height = 650;

    const colorRange = [1, 2, 3, 4, 5, 6, 7, 8];
    const colorArray = ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"];

    const geoDataModel = topojson.feature(geoData, geoData.objects.counties).features;

    const mappedBachelors = new Map();
    for (let i = 0; i < educationData.length; i++) {
        mappedBachelors.set(educationData[i].fips, educationData[i].bachelorsOrHigher)
    }

    const mappedCounty = new Map();
    for (let i = 0; i < educationData.length; i++) {
        mappedCounty.set(educationData[i].fips, educationData[i].area_name)
    }

    const mappedState = new Map()
    for (let i = 0; i < educationData.length; i++) {
        mappedState.set(educationData[i].fips, educationData[i].state)
    }

    const svg = d3.select("#graph")
        .append('svg')
        .attr('id', 'map')
        .attr('viewBox', [0, 0, 975, 610])
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'white')

    svg.append('g')
        .selectAll('path')
        .data(topojson.feature(geoData, geoData.objects.counties).features)
        .join('path')
        .attr('fill', (d) => {
            const bachelors = mappedBachelors.get(d.id);
            if (bachelors < 12) {
                return colorArray[0]
            }
            if (bachelors >= 12 && bachelors < 21) {
                return colorArray[1];
            }
            if (bachelors >= 21 && bachelors < 30) {
                return colorArray[2];
            }
            if ((bachelors >= 30 && bachelors < 39)) {
                return colorArray[3];
            }
            if (bachelors >= 39 && bachelors < 48) {
                return colorArray[4];
            }
            if (bachelors >= 48 && bachelors < 57) {
                return colorArray[5];
            }
            if (bachelors >= 57 && bachelors < 66) {
                return colorArray[6];
            }
            if (bachelors >= 66) {
                return colorArray[7];
            }
        })
        .attr('d', path)
        .attr('class', 'county')
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => mappedBachelors.get(d.id))
        .on('mouseover', (e, d) => {
            const countyData = d;

            d3.select('#tooltip')
                .attr('data-fips', countyData.id)
                .attr('data-education', mappedBachelors.get(countyData.id))
                .style('visibility', 'visible')
                .style('left', e.pageX + 'px')
                .style('top', e.pageY + 'px')
            d3.select('#tooltipdata')
                .text(`${mappedCounty.get(countyData.id)} County, ${mappedState.get(countyData.id)}:${mappedBachelors.get(countyData.id)}`)

        })
        .on('mouseout', (d) => {
            d3.select('#tooltip')
                .style('visibility', 'hidden')
        })


    svg.append('path')
        .datum(topojson.mesh(geoData, geoData.objects.states, (a, b) => a !== b))
        .attr('fill', 'none')
        .attr('stroke', 'white')
        .attr('stroke-linejoin', 'round')
        .attr('d', path)

    const legendScale = d3.scaleOrdinal()
        .domain([3, 12, 21, 30, 39, 48, 57, 66, 75])
        .range([0, 30, 60, 90, 120, 150, 180, 210, 240])

    const legendAxis = d3.axisBottom(legendScale).tickValues(['3%', '12%', '21%', '30%', '39%', '48%', '57%', '66%', '75%'])

    const legend = svg.append('g')
        .attr('id', 'legend')
        .attr('width', 330)
        .attr('height', 20)
        .attr('transform', `translate(500, 20)`)

    legend.selectAll('rect')
        .data(colorRange)
        .enter()
        .append('rect')
        .attr('width', 30)
        .attr('height', 20)
        .attr('x', (d, i) => {
            return i * 30;
        })
        .style('fill', (d) => {
            if (d >= 1 && d <= colorArray.length) {
                return colorArray[d - 1]
            }
        })

    legend.append('g')
        .attr('transform', 'translate(0,20)')
        .call(legendAxis)

    const tooltip = d3.select('#graph')
        .append('div')
        .attr('id', 'tooltip')
        .attr('width', '150px')
        .attr('height', '40px')
        .style('opacity', .85)
        .style('visibility', 'hidden')
        .style('z-index', 1)
        .style('flex-direction', 'column')
        .style('align-items', 'center')
        .style('position', 'absolute')
        .style('border-radius', '5px')
        .style('padding', '5px')
        .style('text-align', 'center')
        .attr('class', 'car-tooltip')

    const tooltipData = d3.select('#tooltip')
        .append('div')
        .attr('id', 'tooltipdata')
        .attr('width', '150px')
        .attr('height', '40px')

}
runAsync();