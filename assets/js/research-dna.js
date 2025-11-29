// Research DNA Visualization using D3.js
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('research-dna-viz');
  if (!container) return;

  // Research areas and their relationships
  const data = {
    nodes: [
      // Current Focus
      { id: 'vlm', label: 'Vision-Language\nModels', period: 'current', size: 25 },
      { id: 'segmentation', label: 'Semantic\nSegmentation', period: 'current', size: 22 },

      // Active Research
      { id: 'diffusion', label: 'Diffusion\nModels', period: 'active', size: 24 },
      { id: 'gans', label: 'GANs', period: 'active', size: 23 },
      { id: 'unlearning', label: 'Unlearning &\nSafety', period: 'active', size: 22 },
      { id: 'debiasing', label: 'Fair\nGeneration', period: 'active', size: 20 },

      // Past Work
      { id: 'ebm', label: 'Energy-Based\nModels', period: 'past', size: 21 },
      { id: 'domain-gen', label: 'Domain\nGeneralization', period: 'past', size: 20 },
      { id: 'few-shot', label: 'Few-Shot\nLearning', period: 'past', size: 19 },
      { id: 'localization', label: 'Indoor\nLocalization', period: 'past', size: 18 },
    ],
    links: [
      // Current connections
      { source: 'vlm', target: 'segmentation', strength: 1.5 },

      // Active research connections
      { source: 'diffusion', target: 'debiasing', strength: 1.3 },
      { source: 'gans', target: 'unlearning', strength: 1.3 },
      { source: 'diffusion', target: 'unlearning', strength: 1.0 },
      { source: 'gans', target: 'debiasing', strength: 0.8 },

      // Connections to past work
      { source: 'ebm', target: 'domain-gen', strength: 1.2 },
      { source: 'gans', target: 'few-shot', strength: 1.0 },
      { source: 'ebm', target: 'diffusion', strength: 0.9 },
      { source: 'gans', target: 'diffusion', strength: 0.8 },

      // Cross-period connections
      { source: 'vlm', target: 'diffusion', strength: 0.7 },
      { source: 'segmentation', target: 'domain-gen', strength: 0.6 },
      { source: 'few-shot', target: 'domain-gen', strength: 0.9 },
    ]
  };

  // Get color from CSS variables
  const getComputedColor = (varName) => {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  };

  // Dimensions
  const width = container.clientWidth;
  const height = Math.min(600, width * 0.75);

  // Create SVG
  const svg = d3.select('#research-dna-viz')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);

  // Add zoom behavior
  const g = svg.append('g');

  const zoom = d3.zoom()
    .scaleExtent([0.5, 3])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Color scheme based on period
  const colorMap = {
    current: 'var(--global-theme-color)',
    active: 'var(--global-hover-color)',
    past: 'var(--global-text-color-light)'
  };

  // Force simulation
  const simulation = d3.forceSimulation(data.nodes)
    .force('link', d3.forceLink(data.links)
      .id(d => d.id)
      .distance(d => 120 / (d.strength || 1))
      .strength(d => d.strength * 0.5)
    )
    .force('charge', d3.forceManyBody()
      .strength(-800)
      .distanceMax(300)
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide()
      .radius(d => d.size + 10)
    );

  // Create links
  const link = g.append('g')
    .selectAll('line')
    .data(data.links)
    .join('line')
    .attr('class', 'research-link')
    .attr('stroke', 'var(--global-divider-color)')
    .attr('stroke-opacity', d => 0.3 + (d.strength * 0.2))
    .attr('stroke-width', d => d.strength * 1.5);

  // Create node groups
  const node = g.append('g')
    .selectAll('g')
    .data(data.nodes)
    .join('g')
    .attr('class', 'research-node')
    .call(drag(simulation));

  // Add circles to nodes
  node.append('circle')
    .attr('r', d => d.size)
    .attr('fill', d => colorMap[d.period])
    .attr('fill-opacity', 0.9)
    .attr('stroke', 'var(--global-bg-color)')
    .attr('stroke-width', 2.5)
    .attr('class', d => `node-${d.period}`);

  // Add labels
  node.append('text')
    .attr('class', 'node-label')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .selectAll('tspan')
    .data(d => d.label.split('\n'))
    .join('tspan')
    .attr('x', 0)
    .attr('dy', (d, i) => i ? '1.1em' : 0)
    .text(d => d)
    .attr('fill', 'var(--global-bg-color)')
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .style('pointer-events', 'none');

  // Add hover effects
  node
    .on('mouseenter', function(event, d) {
      // Highlight connected nodes
      const connectedNodes = new Set();
      connectedNodes.add(d.id);

      data.links.forEach(l => {
        if (l.source.id === d.id) connectedNodes.add(l.target.id);
        if (l.target.id === d.id) connectedNodes.add(l.source.id);
      });

      node.selectAll('circle')
        .transition()
        .duration(200)
        .attr('fill-opacity', n => connectedNodes.has(n.id) ? 1 : 0.3)
        .attr('stroke-width', n => connectedNodes.has(n.id) ? 3 : 2.5);

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', l =>
          (l.source.id === d.id || l.target.id === d.id) ? 0.8 : 0.1
        );

      // Scale up the hovered node
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.size * 1.2);
    })
    .on('mouseleave', function() {
      node.selectAll('circle')
        .transition()
        .duration(200)
        .attr('fill-opacity', 0.9)
        .attr('stroke-width', 2.5)
        .attr('r', d => d.size);

      link
        .transition()
        .duration(200)
        .attr('stroke-opacity', d => 0.3 + (d.strength * 0.2));
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
    const newHeight = Math.min(600, newWidth * 0.75);

    svg.attr('width', newWidth)
       .attr('height', newHeight)
       .attr('viewBox', [0, 0, newWidth, newHeight]);

    simulation.force('center', d3.forceCenter(newWidth / 2, newHeight / 2));
    simulation.alpha(0.3).restart();
  });
});
