---
layout: page
title: Adapt then Unlearn - Exploring Parameter Space Semantics for Unlearning in GANs # Updated Title [cite: 1]
# description: Removing undesired features from pre-trained GANs without accessing original data. # Updated Description [cite: 2]
img: assets/img/your_main_visual.jpg # Optional: Add a background image path for the portfolio view
importance: 1 # Or adjust as needed
category: work # Or adjust as needed
related_publications: true # Assuming you want to link the publication automatically if your theme supports it
---
<h5 style="text-align: center;">Piyush Tiwary, Atri Guha, Subhodip Panda, Prathosh A.P.<br>
Indian Institute of Science, Bengaluru, India</h5>

<style>
  /* Custom button style that responds to theme changes */
  .theme-adaptive-btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 9999px; /* Pill shape */
    text-decoration: none !important;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
    margin: 0 0.25rem;
  }
  
  /* Light theme styling (default) */
  .theme-adaptive-btn {
    color: #fff;
    background-color: #343a40;
    border: 1px solid #343a40;
  }
  
  .theme-adaptive-btn:hover {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124;
  }
  
  /* Dark theme styling - this adapts to most common dark theme implementations */
  [data-theme="dark"] .theme-adaptive-btn,
  .dark-theme .theme-adaptive-btn,
  .dark .theme-adaptive-btn,
  html[data-theme="dark"] .theme-adaptive-btn,
  body.dark .theme-adaptive-btn,
  .dark-mode .theme-adaptive-btn {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
  }
  
  [data-theme="dark"] .theme-adaptive-btn:hover,
  .dark-theme .theme-adaptive-btn:hover,
  .dark .theme-adaptive-btn:hover,
  html[data-theme="dark"] .theme-adaptive-btn:hover,
  body.dark .theme-adaptive-btn:hover,
  .dark-mode .theme-adaptive-btn:hover {
    color: #212529;
    background-color: #dae0e5;
    border-color: #d3d9df;
  }
  
  /* For themes that use media queries */
  @media (prefers-color-scheme: dark) {
    .theme-adaptive-btn.respect-system {
      color: #212529;
      background-color: #f8f9fa;
      border-color: #f8f9fa;
    }
    
    .theme-adaptive-btn.respect-system:hover {
      color: #212529;
      background-color: #dae0e5;
      border-color: #d3d9df;
    }
  }
</style>

<div class="buttons text-center mb-4">  {% comment %} Center aligns the buttons and adds margin below {% endcomment %}
    <a href="YOUR_PAPER_LINK_HERE" class="btn btn-dark rounded-pill mx-1" role="button" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-file-alt"></i> Paper {% comment %} fa-file-alt is a good paper icon {% endcomment %}
    </a>
    <a href="https://openreview.net/forum?id=jAHEBivObO" class="btn btn-dark rounded-pill mx-1" role="button" target="_blank" rel="noopener noreferrer">
        <i class="ai ai-arxiv"></i> arXiv {% comment %} Use Academicons icon {% endcomment %}
    </a>
    <a href="https://github.com/atriguha/Adapt_Unlearn" class="btn btn-dark rounded-pill mx-1" role="button" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> Code {% comment %} fa-github is the GitHub icon {% endcomment %}
    </a>
</div>

## Abstract

Owing to the growing concerns about privacy and regulatory compliance, it is desirable to regulate the output of generative models[cite: 1]. To that end, the objective of this work is to prevent the generation of outputs containing undesired features from a pre-trained Generative Adversarial Network (GAN) where the underlying training data set is inaccessible[cite: 2]. Our approach is inspired by the observation that the parameter space of GANs exhibits meaningful directions that can be leveraged to suppress specific undesired features[cite: 3]. However, such directions usually result in the degradation of the quality of generated samples[cite: 4]. Our proposed two-stage method, known as 'Adapt-then-Unlearn', excels at unlearning such undesirable features while also maintaining the quality of generated samples[cite: 5].

---

## Overview of 'Adapt-then-Unlearn'

Our proposed method follows a two-stage process:

1.  **Negative Adaptation (Stage 1):** We first adapt the pre-trained GAN using a small set of 'negative' samples provided by the user, which contain the undesired features[cite: 6, 61]. This results in an adapted GAN ($\theta_N$) that primarily generates these negative samples[cite: 116]. We use techniques like Elastic Weight Consolidation (EWC) to handle the few-shot nature of this adaptation[cite: 120, 107].
2.  **Unlearning (Stage 2):** Subsequently, we train the original pre-trained GAN using 'positive' samples (those without undesired features)[cite: 7]. Crucially, we introduce a repulsion regularizer ($\mathcal{L}_{repulsion}$) that encourages the learned model parameters ($\theta_P$) to move away from the negative parameters ($\theta_N$) obtained in Stage 1, while the standard adversarial loss ensures generation quality is maintained[cite: 8, 63, 134, 137].

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/your_figure_1a.jpg" title="Adapt-then-Unlearn Method Overview" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Overview of the proposed 'Adapt-then-Unlearn' two-stage method. Stage 1 adapts to negative samples, Stage 2 unlearns using positive samples and a repulsion loss (Adapted from Figure 1a [cite: 44]).
</div>

---

## Key Contributions

* **Novel Two-Stage Unlearning:** Introduces the 'Adapt-then-Unlearn' framework for GANs without needing the original training data[cite: 1, 5, 60].
* **Parameter Space Manipulation:** Leverages semantic directions in the GAN's parameter space for targeted feature removal[cite: 3, 42].
* **Quality Preservation:** Employs a repulsion loss during unlearning to maintain the quality of generated samples, avoiding issues seen with simple parameter extrapolation[cite: 8, 51, 53].
* **Theoretical Foundation:** Provides theoretical insights, showing the method approximates a contrastive-divergence objective beneficial for unlearning[cite: 9, 39, 64, 162].
* **High-Fidelity GANs:** Demonstrates the first successful application of unlearning to state-of-the-art models like StyleGAN[cite: 9].
* **Versatile Application:** Validated on both class-level (MNIST, AFHQ) and subtle feature-level (CelebA-HQ) unlearning tasks[cite: 10, 188].
* **Few-Shot Capable:** Designed to work effectively even with limited user feedback (few negative samples)[cite: 63].

---

## Results Showcase

We validated our approach on various datasets and unlearning tasks.

**Feature Unlearning (CelebA-HQ):** Unlearning attributes like 'Bangs', 'Hats', 'Bald', and 'Eyeglasses'. Our method effectively removes the target feature while preserving others, outperforming simple extrapolation which can affect correlated features (e.g., removing 'Bangs' via extrapolation also impacts 'Female' features, while our method does not)[cite: 256, 268, 269, 270].

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/your_celeba_results.jpg" title="CelebA-HQ Feature Unlearning Examples" class="img-fluid rounded z-depth-1" %}
    </div>
     <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/your_figure_8.jpg" title="CelebA-HQ Sample Generation After Unlearning" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Left: Examples of unlearning features like Bangs, Hats, Baldness, Eyeglasses on CelebA-HQ (Adapted from Figure 3 [cite: 216]). Right: Random samples generated after unlearning different features (Adapted from Figure 8 [cite: 523]).
</div>

**Class Unlearning (AFHQ):** Successfully unlearning entire classes like 'Cats', 'Dogs', or 'Wild' animals.

<div class="row justify-content-sm-center">
     <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/your_afhq_results.jpg" title="AFHQ Class Unlearning Examples" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Examples of unlearning classes (Cats, Dogs, Wild) on the AFHQ dataset (Adapted from Figure 2 [cite: 201]).
</div>

---

## Resources

* **Paper:** [Published in Transactions on Machine Learning Research (02/2025)](https://openreview.net/forum?id=jAHEBivObO) [cite: 1] *(Note: Add actual publication link if available)*
* **Code:** [GitHub Repository](https://github.com/atriguha/Adapt_Unlearn) [cite: 11, 431]
* **BibTeX:**
    ```bibtex
    @article{tiwary2025adapt,
      title={Adapt then Unlearn: Exploring Parameter Space Semantics for Unlearning in Generative Adversarial Networks},
      author={Piyush Tiwary and Atri Guha and Subhodip Panda and Prathosh A.P.},
      journal={Transactions on Machine Learning Research},
      year={2025},
      url={https://openreview.net/forum?id=jAHEBivObO},
      note={Published 02/2025}
    }
    ```

---

You can add more sections, figures, or details as needed, following the Bootstrap grid system explained in your original template code. Remember to replace the placeholder image paths!