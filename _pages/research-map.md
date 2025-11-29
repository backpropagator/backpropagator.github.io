---
layout: page
title: Research Map
permalink: /research-map/
description: An interactive visualization of my research journey and interests
nav: false
research_dna: true
coauthor_network: true
---

Explore the interconnected landscape of my research areas. This interactive map shows how different topics in my work relate to each other, spanning from my early work in signal processing to current focus on vision-language models.

**How to interact:**
- **Drag** nodes to rearrange the graph
- **Hover** over research areas to highlight connections
- **Zoom** with mouse wheel, **Pan** by dragging the background

{% include research-dna.liquid %}

---

### Research Timeline

#### 🔵 Current Focus (2025-Present)
Working on vision-language models and semantic segmentation at Google DeepMind, exploring how to leverage large language models for computer vision tasks without traditional pixel decoders.

#### 💠 Active Research (2023-2025)
Investigating safety and fairness in generative models, including unlearning in GANs and debiasing diffusion models. Focus on making AI systems more controllable and fair.

#### ⚪ Past Work (2017-2023)
Built foundations in energy-based models, domain generalization, few-shot learning, and signal processing. Each area contributed unique insights that inform current research.

---

{% include coauthor-network.liquid %}

---

<div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: var(--global-card-bg-color); border-radius: var(--radius-md); border: 1px solid var(--global-divider-color);">
  <p style="color: var(--global-text-color-light); margin-bottom: 0;">
    📚 <strong>Interested in a specific area?</strong> Check out my
    <a href="{{ '/publications/' | relative_url }}">publications</a> or
    <a href="{{ '/what-i-am-doing/' | relative_url }}">detailed timeline</a> for more context.
  </p>
</div>
