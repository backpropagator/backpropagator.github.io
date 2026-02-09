---
layout: page
title: Research Map
permalink: /research-map/
description: An interactive visualization of my research journey and interests
nav: false
research_dna: true
coauthor_network: true
---

An interactive map of the research areas I've explored and how they connect. Each node represents a topic, sized proportionally to its label, and edges show intellectual bridges between areas.

**Interact:** Click a node to see related publications, hover to highlight connections, drag to rearrange, scroll to zoom.

{% include research-dna.liquid %}

---

### Research Timeline

**Current Focus (2025-Present)**
Vision-language models and semantic segmentation at Google DeepMind --- exploring how to leverage large language models for computer vision tasks without traditional pixel decoders.

**Active Research (2023-2025)**
Safety and fairness in generative models: unlearning in GANs and debiasing diffusion models. Making AI systems more controllable and fair.

**Past Work (2017-2023)**
Foundations in energy-based models, domain generalization, few-shot learning, and signal processing. Each area contributed insights that inform current research.

---

{% include coauthor-network.liquid %}

---

<div style="text-align: center; margin-top: 2rem; padding: 1.5rem; background: var(--global-card-bg-color); border-radius: var(--radius-md); border: 1px solid var(--global-divider-color);">
  <p style="color: var(--global-text-color-light); margin-bottom: 0;">
    Interested in a specific area? Check out my
    <a href="{{ '/publications/' | relative_url }}">publications</a> or
    <a href="{{ '/what-i-am-doing/' | relative_url }}">detailed timeline</a> for more context.
  </p>
</div>
