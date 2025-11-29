// Co-author Collaboration Network using D3.js
function initializeCoauthorNetwork() {
  const container = document.getElementById('coauthor-network-viz');
  if (!container) {
    console.log('Container not found');
    return;
  }

  // Check if D3 is loaded
  if (typeof d3 === 'undefined') {
    console.warn('D3.js not loaded yet, retrying...');
    setTimeout(initializeCoauthorNetwork, 100);
    return;
  }

  console.log('Initializing coauthor network...');

  // Fetch co-author data from JSON file
  fetch('/assets/json/coauthors.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Data loaded successfully:', data.nodes.length, 'nodes,', data.links.length, 'links');
      try {
        initializeVisualization(data);
      } catch (error) {
        console.error('Error initializing visualization:', error);
        container.innerHTML = '<p style="text-align: center; color: var(--global-text-color-light); padding: 2rem;">Error creating visualization.<br>Details: ' + error.message + '</p>';
      }
    })
    .catch(error => {
      console.error('Error loading coauthor data:', error);
      container.innerHTML = '<p style="text-align: center; color: var(--global-text-color-light); padding: 2rem;">Unable to load collaboration network.<br>Error: ' + error.message + '</p>';
    });

  function initializeVisualization(data) {
    // Dimensions
    const width = container.clientWidth;
    const height = Math.min(500, width * 0.65);

    console.log('Container dimensions:', width, 'x', height);
    console.log('Data nodes:', data.nodes);
    console.log('Data links:', data.links);

    // Create SVG - use container directly instead of selector
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    console.log('SVG created:', svg.node());

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

    console.log('Starting force simulation...');

    // Ensure links have proper structure with id function
    const links = data.links.map(d => Object.create(d));

    // Force simulation with improved parameters for better spacing
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        // Distance based on link strength - stronger connections closer
        .distance(d => 120 - (d.strength * 15))
        .strength(d => 0.2 + (d.strength * 0.08))
      )
      .force('charge', d3.forceManyBody()
        // Increased repulsion for better spreading
        .strength(d => {
          // Central node has lower repulsion to anchor network
          if (d.id === 'you') return -400;
          // Frequent collaborators push harder
          if (d.type === 'frequent') return -900;
          return -700;
        })
        .distanceMax(300)
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        // Increased collision radius for better separation
        .radius(d => {
          const base = nodeConfig[d.type].size + 20;
          // Add extra padding for labels
          return base + 15;
        })
        .strength(0.8)
      )
      // Add radial force to spread nodes outward from center
      .force('radial', d3.forceRadial(d => {
        if (d.id === 'you') return 0;
        if (d.type === 'frequent') return 180;
        if (d.type === 'regular') return 220;
        return 250;
      }, width / 2, height / 2)
        .strength(0.1)
      );

    // Increase simulation iterations for better layout
    simulation.alpha(1).alphaDecay(0.015);

    console.log('Creating links...');
    // Create links - make them scale with collaboration strength
    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('class', 'coauthor-link')
      .attr('stroke', 'var(--global-divider-color)')
      .attr('stroke-opacity', d => 0.5 + (d.strength * 0.15))
      .attr('stroke-width', d => 1.5 + (d.strength * 1.5));

    console.log('Creating nodes...');
    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes, d => d.id)
      .join('g')
      .attr('class', 'coauthor-node')
      .call(drag(simulation));

    console.log('Adding circles to nodes...');
    // Add circles
    node.append('circle')
      .attr('r', d => nodeConfig[d.type].size)
      .attr('fill', d => nodeConfig[d.type].color)
      .attr('fill-opacity', 0.9)
      .attr('stroke', 'var(--global-bg-color)')
      .attr('stroke-width', 2.5)
      .attr('class', d => `node-${d.type}`);

    // Smart label positioning to avoid overlaps
    const labels = node.append('g')
      .attr('class', 'label-group');

    // Add labels with proper text wrapping
    const labelTexts = labels.append('text')
      .attr('class', 'coauthor-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em');

    labelTexts.each(function(nodeData) {
      const textElement = d3.select(this);
      const lines = nodeData.label.split('\n');

      lines.forEach((line, i) => {
        textElement.append('tspan')
          .attr('x', 0)
          .attr('dy', i === 0 ? '0em' : '1.1em')
          .text(line)
          .attr('fill', 'var(--global-text-color)')
          .attr('font-size', nodeData.type === 'primary' ? '12px' : '10px')
          .attr('font-weight', '600')
          .style('text-shadow',
            '1px 1px 2px var(--global-bg-color),' +
            '-1px -1px 2px var(--global-bg-color),' +
            '1px -1px 2px var(--global-bg-color),' +
            '-1px 1px 2px var(--global-bg-color)');
      });
    });

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

        links.forEach(l => {
          if (l.source === d.id || (typeof l.source === 'object' && l.source.id === d.id)) {
            connectedIds.add(typeof l.target === 'object' ? l.target.id : l.target);
          }
          if (l.target === d.id || (typeof l.target === 'object' && l.target.id === d.id)) {
            connectedIds.add(typeof l.source === 'object' ? l.source.id : l.source);
          }
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
      simulation.force('radial', d3.forceRadial(d => {
        if (d.id === 'you') return 0;
        if (d.type === 'frequent') return 180;
        if (d.type === 'regular') return 220;
        return 250;
      }, newWidth / 2, newHeight / 2)
        .strength(0.1)
      );
      simulation.alpha(0.3).restart();
    });
  }
}

// Initialize when DOM is ready and D3 is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCoauthorNetwork);
} else {
  initializeCoauthorNetwork();
}
