# Research DNA Visualization Guide

An interactive network graph that visualizes your research areas and their interconnections.

## 🎨 What is Research DNA?

The Research DNA visualization is an interactive force-directed graph that shows:
- **Research Areas** as nodes (circles)
- **Connections** between related research topics as links (lines)
- **Time Periods** indicated by colors (current, active, past)

## 🎯 Features

### Interactive Elements
1. **Drag & Drop**: Click and drag any node to rearrange the graph
2. **Hover Effects**: Hover over a node to:
   - Highlight connected research areas
   - Dim unrelated nodes
   - Scale up the hovered node
3. **Zoom & Pan**: Use mouse wheel to zoom, click and drag background to pan

### Visual Encoding
- **Node Size**: Indicates relative importance/activity level
- **Node Color**:
  - Theme color (blue) = Current focus
  - Hover color (lighter) = Active research
  - Light gray = Past work
- **Link Opacity**: Shows connection strength
- **Animations**: Subtle pulse on current research nodes

## 📊 Current Research Map

### Current Focus (2025)
- Vision-Language Models
- Semantic Segmentation

### Active Research (2024-2025)
- Diffusion Models
- GANs
- Unlearning & Safety
- Fair Generation

### Past Work (2017-2024)
- Energy-Based Models
- Domain Generalization
- Few-Shot Learning
- Indoor Localization

## 🔧 Customization

### Adding New Research Areas

Edit `/assets/js/research-dna.js` and modify the `data` object:

```javascript
const data = {
  nodes: [
    {
      id: 'new-topic',           // Unique identifier
      label: 'New Topic\nName',  // Use \n for line breaks
      period: 'current',         // 'current', 'active', or 'past'
      size: 24                   // Node size (15-30 recommended)
    },
    // ... more nodes
  ],
  links: [
    {
      source: 'topic1',          // Node ID
      target: 'topic2',          // Connected node ID
      strength: 1.2              // Connection strength (0.5-1.5)
    },
    // ... more links
  ]
};
```

### Adjusting Colors

The visualization uses CSS variables for colors:
- Edit `_sass/_research-dna.scss` to customize
- Colors automatically adapt to your theme

### Modifying Layout

In `/assets/js/research-dna.js`, adjust force simulation parameters:

```javascript
const simulation = d3.forceSimulation(data.nodes)
  .force('link', d3.forceLink(data.links)
    .distance(d => 120 / (d.strength || 1))  // Link distance
    .strength(d => d.strength * 0.5)         // Link strength
  )
  .force('charge', d3.forceManyBody()
    .strength(-800)                          // Repulsion force
  )
  .force('collision', d3.forceCollide()
    .radius(d => d.size + 10)                // Collision radius
  );
```

## 🎨 Styling

### Main Container
Located in `_sass/_research-dna.scss`:

```scss
.research-dna-container {
  margin: 3rem 0;
  padding: 2rem;
  background: var(--global-card-bg-color);
  border-radius: var(--radius-lg);
  // ... more styles
}
```

### Responsive Design
The visualization automatically adapts to screen size:
- Desktop: Full interactive experience
- Tablet: Optimized spacing
- Mobile: Smaller fonts, adjusted layout

## 📱 Enabling/Disabling

### On Specific Pages
Add to page front matter:

```yaml
---
research_dna: true  # Enable
---
```

### Globally
Remove from all pages by deleting the include from `_layouts/about.liquid`:

```liquid
<!-- Research DNA Visualization -->
{% if page.research_dna %}
  {% include research-dna.liquid %}
{% endif %}
```

## 🚀 Performance

- Uses D3.js force simulation (hardware accelerated)
- Efficient hover interactions with transitions
- Responsive resize handling with throttling
- Lazy loading: Only loads when page has `research_dna: true`

## 🎓 Research Area Categories

### By Period
1. **Current (2025-)**: Ongoing work at DeepMind
2. **Active (2023-2025)**: PhD research focus
3. **Past (2017-2023)**: Completed projects

### By Domain
- **Computer Vision**: Segmentation, VLMs
- **Generative AI**: GANs, Diffusion Models
- **ML Theory**: EBMs, Domain Generalization
- **AI Safety**: Unlearning, Debiasing
- **Classic ML**: Localization, Few-shot

## 💡 Tips

1. **Add Meaningful Connections**: Only link truly related topics
2. **Balance Node Sizes**: Keep differences subtle (±5-7 range)
3. **Use Link Strength**: Stronger connections = shorter distance
4. **Group Related Topics**: Simulation will naturally cluster them
5. **Test Interactivity**: Ensure all nodes are accessible and draggable

## 🐛 Troubleshooting

### Visualization Not Showing
1. Check that `research_dna: true` is in page front matter
2. Ensure D3.js is loaded (check browser console)
3. Verify file paths in `_includes/scripts/research-dna.liquid`

### Nodes Overlapping
1. Increase repulsion force: `strength(-1000)`
2. Increase collision radius: `radius(d => d.size + 15)`
3. Reduce node sizes

### Links Too Tight/Loose
1. Adjust link distance: `distance(d => 100 / (d.strength || 1))`
2. Modify link strength: `strength(d => d.strength * 0.4)`

## 📝 Files

- **Template**: `_includes/research-dna.liquid`
- **JavaScript**: `assets/js/research-dna.js`
- **Styles**: `_sass/_research-dna.scss`
- **Script Loader**: `_includes/scripts/research-dna.liquid`

## 🎨 Design Philosophy

The Research DNA visualization follows minimalist principles:
- **Clean**: No clutter, focus on connections
- **Interactive**: Engaging without being distracting
- **Informative**: Clear visual hierarchy
- **Aesthetic**: Subtle animations and smooth transitions
- **Accessible**: Respects user preferences and works on all devices

---

Created: November 2025
Last Updated: November 2025
