// Co-author Collaboration Network using D3.js
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('coauthor-network-viz');
  if (!container) return;

  // Co-author data (you can extract this from your publications automatically)
  const data = {
    nodes: [
      // You (central node)
      { id: 'you', label: 'Piyush\nTiwary', type: 'primary', papers: 0 },

      // Frequent collaborators (5+ papers)
      { id: 'prathosh', label: 'Prathosh\nA.P.', type: 'frequent', papers: 8 },

      // Regular collaborators (2-4 papers)
      { id: 'vineeth', label: 'Vineeth\nBalasubramanian', type: 'regular', papers: 3 },
      { id: 'chetan', label: 'Chetan\nArora', type: 'regular', papers: 2 },

      // Occasional collaborators (1 paper)
      { id: 'subhodip', label: 'Subhodip\nPanda', type: 'occasional', papers: 1 },
      { id: 'ritwick', label: 'Ritwick\nChaudhry', type: 'occasional', papers: 1 },
      { id: 'tushar', label: 'Tushar\nSangam', type: 'occasional', papers: 1 },
      { id: 'piyush-m', label: 'Piyush\nManoj', type: 'occasional', papers: 1 },
    ],
    links: [
      // Connections from you to collaborators
      { source: 'you', target: 'prathosh', strength: 8 },
      { source: 'you', target: 'vineeth', strength: 3 },
      { source: 'you', target: 'chetan', strength: 2 },
      { source: 'you', target: 'subhodip', strength: 1 },
      { source: 'you', target: 'ritwick', strength: 1 },
      { source: 'you', target: 'tushar', strength: 1 },
      { source: 'you', target: 'piyush-m', strength: 1 },

      // Connections between collaborators (if they've co-authored together)
      { source: 'prathosh', target: 'subhodip', strength: 1 },
      { source: 'vineeth', target: 'chetan', strength: 1 },
    ]
  };

  // Dimensions
  const width = container.clientWidth;
  const height = Math.min(500, width * 0.65);

  // Create SVG
  const svg = d3.select('#coauthor-network-viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  const g = svg.append('g');

  // Zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Color and size mapping
  const nodeConfig = {
    primary: { color: 'var(--global-theme-color)', size: 30 },
    frequent: { color: 'var(--global-hover-color)', size: 24 },
    regular: { color: 'var(--global-text-color)', size: 20 },
    occasional: { color: 'var(--global-text-color-light)', size: 16 }
  };

  // Force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links)
      .id(d => d.id)
      .distance(d => 100 - (d.strength * 8))
      .strength(d => 0.3 + (d.strength * 0.1))
    )
    .force('charge', d3.forceManyBody()
      .strength(-600)
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide()
      .radius(d => nodeConfig[d.type].size + 15)
    );

  // Create links
  const link = g.append('g')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('class', 'coauthor-link')
    .attr('stroke', 'var(--global-divider-color)')
    .attr('stroke-opacity', d => 0.4 + (d.strength * 0.1))
    .attr('stroke-width', d => 1 + (d.strength * 0.5));

  // Create node groups
  const node = g.append('g')
    .selectAll('g')
    .data(data.nodes)
    .join('g')
    .attr('class', 'coauthor-node')
    .call(drag(simulation));

  // Add circles
  node.append('circle')
    .attr('r', d => nodeConfig[d.type].size)
    .attr('fill', d => nodeConfig[d.type].color)
    .attr('fill-opacity', 0.9)
    .attr('stroke', 'var(--global-bg-color)')
    .attr('stroke-width', 2.5)
    .attr('class', d => `node-${d.type}`);

  // Add labels
  node.append('text')
    .attr('class', 'coauthor-label')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .selectAll('tspan')
    .data(d => d.label.split('\n'))
    .join('tspan')
    .attr('x', 0)
    .attr('dy', (d, i) => i ? '1.1em' : 0)
    .text(d => d)
    .attr('fill', 'var(--global-bg-color)')
    .attr('font-size', d => {
      const node = d3.select(this.parentNode.parentNode).datum();
      return node.type === 'primary' ? '12px' : '10px';
    })
    .attr('font-weight', '600');

  // Add paper count badges
  node.append('circle')
    .attr('class', 'paper-badge')
    .attr('r', 10)
    .attr('cx', d => nodeConfig[d.type].size * 0.7)
    .attr('cy', d => -nodeConfig[d.type].size * 0.7)
    .attr('fill', 'var(--global-theme-color)')
    .attr('stroke', 'var(--global-bg-color)')
    .attr('stroke-width', 2)
    .style('display', d => d.papers > 0 ? 'block' : 'none');

  node.append('text')
    .attr('class', 'paper-count')
    .attr('x', d => nodeConfig[d.type].size * 0.7)
    .attr('y', d => -nodeConfig[d.type].size * 0.7)
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', 'var(--global-bg-color)')
    .attr('font-size', '9px')
    .attr('font-weight', 'bold')
    .text(d => d.papers)
    .style('display', d => d.papers > 0 ? 'block' : 'none');

  // Hover effects
  node
    .on('mouseenter', function(event, d) {
      const connectedIds = new Set();
      connectedIds.add(d.id);

      data.links.forEach(l => {
        if (l.source.id === d.id) connectedIds.add(l.target.id);
        if (l.target.id === d.id) connectedIds.add(l.source.id);
      });

      node.selectAll('circle:not(.paper-badge)')
        .transition()
        .duration(200)
        .attr('fill-opacity', n => connectedIds.has(n.id) ? 1 : 0.3)
        .attr('stroke-width', n => connectedIds.has(n.id) ? 3 : 2.5);

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', l =>
          (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
        );

      d3.select(this).select('circle:not(.paper-badge)')
        .transition()
        .duration(200)
        .attr('r', nodeConfig[d.type].size * 1.2);
    })
    .on('mouseleave', function(event, d) {
      node.selectAll('circle:not(.paper-badge)')
        .transition()
        .duration(200)
        .attr('fill-opacity', 0.9)
        .attr('stroke-width', 2.5)
        .attr('r', n => nodeConfig[n.type].size);

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', l => 0.4 + (l.strength * 0.1));
    });

  // Update positions on tick
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // Drag behavior
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  // Responsive resize
  window.addEventListener('resize', function() {
    const newWidth = container.clientWidth;
    const newHeight = Math.min(500, newWidth * 0.65);

    svg.attr('width', newWidth)
       .attr('height', newHeight)
       .attr('viewBox', [0, 0, newWidth, newHeight]);

    simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
    simulation.alpha(0.3).restart();
  });
});
