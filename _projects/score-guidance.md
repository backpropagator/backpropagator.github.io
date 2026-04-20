---
layout: page
title: "Debiasing Diffusion Models via Score Guidance"  # Title at top of page
card_title: "Score Guidance"  # Title on the card/tile
description: "A training-free inference-time method for debiasing diffusion models."  # Short title on the card/tile
img: assets/img/publication_preview/debias_sg.gif # Optional: Add a background image path for the portfolio view
importance: 1 # Or adjust as needed
category: work # Or adjust as needed
related_publications: false # Disabled to remove automatic references
images:
  slider: true
---
<h5 style="text-align: center;">Piyush Tiwary, Prabhav Verma, Prathosh A.P.<br>
Indian Institute of Science, Bengaluru, India</h5>

<style>
  /* Custom button styles that respond to theme changes */
  .theme-btn {
    display: inline-block;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
    border-radius: 2rem;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
    text-decoration: none !important;
  }
  
  /* Light theme (default) */
  .theme-btn {
    color: #fff;
    background-color: var(--global-theme-color, #343a40);
    border: 1px solid var(--global-theme-color, #343a40);
  }
  
  .theme-btn:hover {
    color: #fff;
    background-color: var(--global-hover-color, #121212);
    border-color: var(--global-hover-color, #121212);
  }
  
  /* Dark theme */
  html[data-theme="dark"] .theme-btn {
    color: var(--global-bg-color, #fff);
    background-color: var(--global-theme-color, #343a40);
    border-color: var(--global-theme-color, #343a40);
  }
  
  html[data-theme="dark"] .theme-btn:hover {
    color: var(--global-bg-color, #fff);
    background-color: var(--global-hover-color, #121212);
    border-color: var(--global-hover-color, #121212);
  }
</style>

<div class="text-center mb-4">
    <a href="https://openreview.net/pdf?id=vAz8xUHyTe" class="theme-btn" role="button" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-file-pdf"></i> TMLR
    </a>
    <a href="https://openreview.net/forum?id=vAz8xUHyTe" class="theme-btn" role="button" target="_blank" rel="noopener noreferrer">
        <i class="ai ai-openreview"></i> OpenReview 
    </a>
    <a href="https://github.com/backpropagator/Score-Guidance" class="theme-btn" role="button" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> Code 
    </a>
</div>



<div style="max-width: 800px; margin: 2rem auto; padding: 20px; background-color: rgba(var(--global-theme-color-rgb), 0.1); border: 2px solid var(--global-theme-color); border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
  <h3 style="text-align: center; font-weight: bold; margin-top: 0; color: var(--global-theme-color);">Abstract</h3>
  <p style="text-align: justify;">
With the increasing use of Diffusion Models (DMs) in everyday applications, it is very important to ensure that these models are <em>fair</em> towards various demographic/societal groups. However, due to several reasons DMs inherit biases towards specific gender, race and community, which can perpetuate and amplify societal inequities. Hence, it is important to <em>debias</em> DMs. Previous debiasing approaches require additional reference data, model fine-tuning, or auxiliary classifier training - each of which incur additional cost. In this work, we provide a training-free inference-time method for debiasing diffusion models. First, we provide a theoretical explanation for the cause of biases inhibited by DMs. Specifically, we show that the unconditional score predicted by the denoiser can be expressed as a convex combination of conditional scores corresponding to the attributes under consideration. We then argue that the weights allocated to underrepresented attributes are less which leads to domination of other attributes in overall score function. Building on this, we propose a score-guidance method that adheres to a user provided reference distribution for generation. Moreover, we show that this score guidance can be achieved via different modalities like 'text' and 'exemplar images'. To our knowledge, our method is the first to provide a debiasing framework that can utilize different modalities for diffusion models. We demonstrate the effectiveness of our method across various attributes on both unconditional and conditional text-based diffusion models, including Stable Diffusion.
  </p>
</div>

---

<h3 style="text-align: center; font-weight: bold;">Theoretical Basis of Bias</h3>

<div id="theoretical-basis" class="row justify-content-center">
  <div class="col-sm-12">
    {% include figure.liquid loading="eager" 
      path="assets/img/publication_preview/sg_theory_placeholder.svg" 
      title="Theoretical explanation of bias in diffusion models" 
      class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
    Figure 1: Illustration of why Diffusion Models inherit bias. Underrepresented attributes naturally receive lower weight \(p(a_i)\) locally, leading to dominated generations by overrepresented categories. (Placeholder image)
</div>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      Generative Diffusion Models routinely inherit biases towards specific gender, race, and community from training distributions. By leveraging <strong>Tweedie's formula</strong>, we demonstrate that the (Stein's) score function provided by diffusion models can be expressed precisely as a weighted average of conditional scores. Specifically, the unconditional score is given by a convex combination:
    </p>
    $$
    \begin{align}
        \nabla\log p(x_t) = \sum_{a_i} p(a_i)\nabla\log p(x_t|a_i)
    \end{align}
    $$
    <p>
      From this equation, we can deduct that the attribute influence in the score function strictly follows the proportion of \(p(a_i)\) learned by the pre-trained diffusion model. Because the weights inherently allocated to underrepresented attributes are significantly smaller, other attributes naturally dominate the overall score function. This disparity in the parameter gradients becomes the intrinsic source of generation bias.
    </p>
  </div>
</div>

---

<h3 style="text-align: center; font-weight: bold;">Score Guidance Methodology</h3>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/debias_sg.gif" title="Score Guidance Overview" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 2: Overview of the Score Guidance framework. (a) Standard generation where one mode dominates, causing under-representation of others. (b) Our proposed method tags and guides samples toward a user-specified reference distribution via H-space modulation.
</div>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      Our proposed approach serves as a <strong>training-free inference-time method</strong> for robust debiasing. Unlike previous works that necessitate auxiliary classifier training, model fine-tuning, or extensive reference data, our framework directly adapts the predicted noise score to align with a user-provided reference distribution.
    </p>
    <p>
      The method decomposes debiasing into two components: <strong>(a) sample tagging</strong> to maintain attributes in the desired proportions \(p^a_{\text{ref}}\), and <strong>(b) score guidance</strong> which modifies the predicted denoised estimate \(\hat{x}_{0|t}\) during a selected time window \(\mathcal{T}\). We operate in the bottleneck <strong>H-space</strong> of the UNet-based denoiser, which is more semantically meaningful than the image space.
    </p>
  </div>
</div>

<h4 style="font-weight: bold; margin-top: 1.5rem;">SG-Text: Text-Based Debiasing</h4>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      Employs off-the-shelf pre-trained CLIP to classify the estimated un-noised samples \(\hat{x}_{0|t}\). Samples are tagged by computing the cosine similarity between CLIP embeddings of attribute text descriptions \(t_i\) and the predicted clean image \(\hat{x}_{0|t_s}\). The H-space vectors are then updated using the gradient of CLIP similarity:
    </p>
    $$
    \boxed{\quad h^{(i)} = h^{(i)} - \gamma \, \nabla_{h^{(i)}} \left(1 - \frac{\text{clip}(t^{(i)}) \cdot \text{clip}(\hat{x}^{(i)}_{0|t})}{|\text{clip}(t^{(i)})| \, |\text{clip}(\hat{x}^{(i)}_{0|t})|} \right)\quad}
    $$
    <p>
      where \(\gamma\) is the guidance strength, \(t^{(i)}\) is the attribute text assigned during tagging, and the update is applied \(M\) times per timestep within the guidance window \(\mathcal{T}\).
    </p>
  </div>
</div>

<h4 style="font-weight: bold; margin-top: 1.5rem;">SG-Exemplar: Exemplar-Based Debiasing</h4>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      Requires only a small set (e.g. 8 samples) of visual exemplars per attribute class, which are first inverted via DDIM to obtain anchor points \(\bar{e}^{(j)}_{0|t}\) — estimates of the conditional expectation \(\mathbb{E}[X_0 | X_t, Y = a_j]\). After tagging samples based on \(\ell_2\)-distance from the anchors, the predicted denoised sample is guided to remain within an \(r\)-ball of the anchor.
    </p>
    <p><strong>Image-space update:</strong></p>
    $$
    \hat{x}^{(i)}_{0|t} = \hat{x}^{(i)}_{0|t} - \left(\hat{x}^{(i)}_{0|t} - \bar{e}^{(j)}_{0|t}\right)\left(1 - \frac{r}{\|\hat{x}^{(i)}_{0|t} - \bar{e}^{(j)}_{0|t}\|}\right)
    $$
    <p>
      However, instead of updating \(\hat{x}^{(i)}_{0|t}\) directly, we update the associated H-space vectors:
    </p>
    <p><strong>H-space update:</strong></p>
    $$
    \boxed{\quad h^{(i)} = h^{(i)} - \gamma \, \nabla_{h^{(i)}} \left(\hat{x}^{(i)}_{0|t} - \bar{e}^{(j)}_{0|t}\right)\left(1 - \frac{r}{\|\hat{x}^{(i)}_{0|t} - \bar{e}^{(j)}_{0|t}\|}\right)\quad}
    $$
    <p>
      where \(\gamma\) is the guidance strength. This update is applied \(M\) times per timestep within the guidance window \(\mathcal{T}\). The parameter \(r\) controls the trade-off between diversity and accuracy. A formal guarantee (Theorem 3.1) ensures that the generated samples satisfy \(\|\mathbb{E}[X_0] - \mathbb{E}[X|Y=a]\| \leq r\) almost surely.
    </p>
  </div>
</div>

---

<h3 style="text-align: center; font-weight: bold;">Results</h3>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      We conduct comprehensive quantitative and qualitative evaluations measuring <strong>Fairness Discrepancy (FD)</strong> alongside <strong>Fréchet Inception Distance (FID)</strong> for image validation across diverse characteristics (gender, race, eyeglasses, age distributions, etc.).
    </p>
    <p>
      Our <b>SG-Exemplar</b> pipeline routinely demonstrated state-of-the-art unbiased balance. For unconditional setups (e.g. the P2 parameterization on CelebA-HQ), SG-Exemplar bounded FD near zero (e.g. 0.001 on Gender) while registering the best FID scores out of competing guidelines (FID=34.61). 
    </p>
    <p>
      Evaluation extending to heavily-conditional models like <strong>Stable Diffusion v1.5, v2.0, and SDXL</strong> targeting inherently biased generative structures directly (such as professions like Doctors and Firefighters) further highlighted that image fidelity is strictly preserved, and demographic parity is smoothly achieved without retraining latency penalties. Both single attribute and complex multi-attribute joint distributions benefit immensely from this localized gradient injection.
    </p>
  </div>
</div>

<h4 style="font-weight: bold; margin-top: 1.5rem;">CelebA Results</h4>
<div id="results-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        <swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true" auto-height="true">
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/celeba_results.png" title="CelebA Results" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visualization of balanced generation on 'eyeglasses' and 'gender' using different baselines and our method. The samples with eyeglasses and male gender are shown in <span style="color:orange">orange</span> colored border.
            </div>
          </swiper-slide>
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/celeba_age_race.png" title="Age and Race Attributes" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visual results for balanced generation on multi-class attributes from Unconditional Diffusion using SG(T) and SG(E).
            </div>
          </swiper-slide>
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/celeba_multi_attr.png" title="Multi-Attribute Results" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visual results for balanced generation on multiple attributes for Unconditional Diffusion using SG(T) and SG(E).
            </div>
          </swiper-slide>
        </swiper-container>
    </div>
</div>

<h4 style="font-weight: bold; margin-top: 1.5rem;">Stable Diffusion 1.5 Results</h4>
<div class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        <swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true" auto-height="true">
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/sd15_gender.png" title="SD1.5 Gender Attribute" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visualizations of 'gender-balanced' samples for different profession from Stable Diffusion using SG (T) and SG (E).
            </div>
          </swiper-slide>
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/sd15_gender_race.png" title="SD1.5 Gender and Race Attributes" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visualizations of multi attribute ('race' and 'gender') debiasing for different profession from Stable Diffusion using SG (T) and SG (E).
            </div>
          </swiper-slide>
        </swiper-container>
    </div>
</div>

<h4 style="font-weight: bold; margin-top: 1.5rem;">Stable Diffusion 2.0 & SDXL Results</h4>
<div class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        <swiper-container keyboard="true" navigation="true" pagination="true" pagination-clickable="true" pagination-dynamic-bullets="true" rewind="true" auto-height="true">
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/sd20_gender.png" title="SD2.0 Gender Attribute" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visualizations of debiasing for 'doctor' and 'firefighter' from Stable Diffusion v2.0 using SG (T) and SG (E).
            </div>
          </swiper-slide>
          <swiper-slide>
            {% include figure.liquid loading="eager" path="assets/img/publication_preview/score_guidance/sdxl_gender.png" title="SDXL Gender Attribute" class="img-fluid rounded z-depth-1" %}
            <div class="caption mt-2">
                Visualizations of debiasing for 'doctor' and 'firefighter' from Stable Diffusion XL using SG (T) and SG (E).
            </div>
          </swiper-slide>
        </swiper-container>
    </div>
</div>

---

<h3 style="text-align: center; font-weight: bold;">BibTeX</h3>
<pre><code>@article{tiwary2025debiasing,
  title={Debiasing Diffusion Models via Score Guidance},
  author={Tiwary, Piyush and Verma, Prabhav and AP, Prathosh},
  journal={Transactions on Machine Learning Research},
  year={2026},
  url={https://openreview.net/forum?id=vAz8xUHyTe}
}</code></pre>
