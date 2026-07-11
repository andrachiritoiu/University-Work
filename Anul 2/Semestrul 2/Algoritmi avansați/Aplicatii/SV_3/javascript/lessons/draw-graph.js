function drawGraph(treeData, svgWidth) {
    d3.selectAll("svg").remove();

    var width = svgWidth, height = 500;

    var tree = d3.layout.tree().size([height, width]);

    var svg = d3.select("#graphContainer")
        .append("svg")
        .style("width", width + 'px')
        .style("height", height + 'px')
        .call(zm = d3.behavior.zoom().scaleExtent([1, 3])
        .on("zoom", function () {
            svg.attr("transform",
                "translate(" + d3.event.translate + ")"
                + " scale(" + d3.event.scale + ")");
        }))
        .append("g")
        .attr("transform", "translate(0,50)");

    var nodes = tree.nodes(treeData).reverse(),
        links = tree.links(nodes);

    nodes.forEach(function (d) {
        d.y = d.depth * 70;
    });

    nodeIndex = 0;
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) { return (d.id = ++nodeIndex); });

    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
        .on("click", function (d) { if (d.id == nodeIndex) { highlightNodeAndLink(d) } });

    nodeEnter.append("circle")
        .attr("r", 5)
        .attr("id", function (d) { return "node" + d.id; })
        .style("fill", function (d) {
            return d.children ? "#17252A" : "rgb(82, 171, 152)";
        })
        .style("stroke", function (d) {
            return d.children ? "#17252A" : "rgb(82, 171, 152)";
        });

    nodeEnter.append("text")
        .attr("y", function () { return -18; })
        .attr("x", function (d) {
            if (d.parent == "null" || (typeof d.parent == 'undefined')) {
                return 0;
            }
            let isLeftChild = true;
            if (d.parent.children[1] == d) {
                isLeftChild = false;
            }
            if (isLeftChild)
                return -10;
            return 10;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.name; })
        .style("fill-opacity", 1);

    svg.selectAll("path.link")
        .data(links, function (d) { return d.target.id; })
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("id", function (d) { return ("link" + d.source.id + "-" + d.target.id) })
        .attr("d", d3.svg.diagonal().projection(function (d) { return [d.x, d.y]; }));
}


function highlightNodeAndLink(d) {
    d3.selectAll("circle").style("fill", "white");
    d3.selectAll("circle").style("stroke", function (d) {
        return d.children ? "#17252A" : "rgb(82, 171, 152)";
    });
    d3.selectAll("path").style("stroke", "#ccc");

    childPositionIndex = 0;

    if (d) {
        do {
            d3.selectAll("#node" + d.id).style("fill", RED_COLOR)
            d3.selectAll("#node" + d.id).style("stroke", RED_COLOR)
            let childPosition = childNodesPositions[childPositionIndex]
            if (d.children != null) {
                if (childPosition == "left") {
                    d3.selectAll("#link" + d.id + "-" + d.children[0].id).style("stroke", RED_COLOR);
                    d = d.children[0];
                } else {
                    d3.selectAll("#link" + d.id + "-" + d.children[1].id).style("stroke", RED_COLOR);
                    d = d.children[1];
                }
            }
            else{
                break;
            }
            childPositionIndex++;
        } while (d);
    }
}

