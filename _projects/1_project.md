---
layout: page
title: "Adapt then Unlearn: Exploring Parameter Space Semantics for Unlearning in GANs"  # Title at top of page
card_title: "Adapt then Unlearn"  # Title on the card/tile
description: "An Unlearning framework for GANs by using Parameter Space Semantics."  # Short title on the card/tile
img: assets/img/publication_preview/atu-bd.png # Optional: Add a background image path for the portfolio view
importance: 1 # Or adjust as needed
category: work # Or adjust as needed
related_publications: true # Assuming you want to link the publication automatically if your theme supports it
---
<h5 style="text-align: center;">Piyush Tiwary, Atri Guha, Subhodip Panda, Prathosh A.P.<br>
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
    <a href="https://openreview.net/forum?id=jAHEBivObO" class="theme-btn" role="button" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-file-pdf"></i> TMLR 
    </a>
    <a href="https://arxiv.org/abs/2309.14054" class="theme-btn" role="button" target="_blank" rel="noopener noreferrer">
        <i class="ai ai-arxiv"></i> arXiv
    </a>
    <a href="https://github.com/atriguha/Adapt_Unlearn" class="theme-btn" role="button" target="_blank" rel="noopener noreferrer">
        <i class="fab fa-github"></i> Code
    </a>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu-bd.png" title="example image" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    TL:DR: we introduce "Adapt-then-Unlearn," a two-stage approach for removing undesired features from pre-trained GANs without requiring access to the original training data. First, the method adapts the GAN to generate only negative samples (with undesired features), then it retrains the original GAN on positive samples using a repulsion loss that pushes parameters away from the adapted model. This innovative approach successfully unlearns undesired features while maintaining generation quality, working effectively on high-fidelity GANs like StyleGAN for both class-level and feature-level unlearning tasks.
</div>


<div style="max-width: 800px; margin: 2rem auto; padding: 20px; background-color: rgba(var(--global-theme-color-rgb), 0.1); border: 2px solid var(--global-theme-color); border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
  <h3 style="text-align: center; font-weight: bold; margin-top: 0; color: var(--global-theme-color);">Abstract</h3>
  <p style="text-align: justify;">
Owing to the growing concerns about privacy and regulatory compliance, it is desirable to regulate the output of generative models. To that end, the objective of this work is to prevent the generation of outputs containing undesired features from a pre-trained Generative Adversarial Network (GAN) where the underlying training data set is inaccessible. Our approach is inspired by the observation that the parameter space of GANs exhibits meaningful directions that can be leveraged to suppress specific undesired features. However, such directions usually result in the degradation of the quality of generated samples. Our proposed two-stage method, known as 'Adapt-then-Unlearn,' excels at unlearning such undesirable features while also maintaining the quality of generated samples. In the initial stage, we adapt a pre-trained GAN on a set of negative samples (containing undesired features) provided by the user. Subsequently, we train the original pre-trained GAN using positive samples, along with a repulsion regularizer.  This regularizer encourages the learned model parameters to move away from the parameters of the adapted model (first stage) while not degrading the generation quality. We provide theoretical insights into the proposed method. To the best of our knowledge, our approach stands as the first method addressing unlearning within the realm of high-fidelity GANs (such as StyleGAN). We validate the effectiveness of our method through comprehensive experiments, encompassing both class-level unlearning on the MNIST and AFHQ dataset and feature-level unlearning tasks on the CelebA-HQ dataset. Our code and implementation is available at: <a href="https://github.com/atriguha/Adapt_Unlearn">https://github.com/atriguha/Adapt_Unlearn</a>.
</p>
</div>

---

<h3 style="text-align: center; font-weight: bold;">Parameter Space Semantics</h3>

<div id="parameter-space-figure" class="row justify-content-center">
  <div class="col-sm-8" style="width: 65%; margin: 0 auto;">
    <div style="position: relative; overflow: hidden;">
      <div style="margin-top: -40px;     /* Top trim */
                  margin-right: -90px;   /* Right trim */
                  margin-bottom: -10px;  /* Bottom trim */
                  margin-left: -60px;">  
        {% include figure.liquid loading="eager" 
          path="assets/img/publication_preview/atu_tmlr/transition_teaser.png" 
          title="Transition teaser" 
          class="img-fluid" 
          style="transform: scale(1.4); transform-origin: center;" %}
      </div>
    </div>
  </div>
</div>
<div class="caption">
    Figure 1: Illustrating linear interpolation and extrapolation in parameter space for unlearning undesired features. We observe that in the extrapolation region, undesired features are suppressed, but the quality of generated samples deteriorates.
</div>


<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      Our approach hinges in realizing interpretable and meaningful directions within the parameter space of a pre-trained GAN generator, as discussed in {% cite cherepkov2021navigating ilharco2023editing -f references %}. In particular, the first stage of the proposed method leads to adapted parameters that exclusively generate negative samples. While the parameters of the original pre-trained generator generate both positive as well as negative samples. Hence, the difference between the parameters of adapted generator and the paramters of original generator can be interpreted as the direction in parameter space that leads to a decrease in the generation of negative samples. Given this, it is sensible to move away from the original parameters in this direction to further reduce the generation of negative samples. This observation is shown in <a href="#parameter-space-figure">Figure 1</a>. However, it's worth noting that such extrapolation doesn't ensure the preservation of other image features' quality. In fact, deviations too far from the original parameters may hamper the smoothness of the latent space, potentially leading to a deterioration in the overall generation quality (see last column of <a href="#parameter-space-figure">Figure 1</a>).
    </p>
  </div>
</div>

---

<h3 style="text-align: center; font-weight: bold;">Proposed Methodology</h3>

#### Overview of the Proposed Method

<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/atu-bd.png" title="block-diagram" class="img-fluid rounded z-depth-1" %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/mog_exp.png" title="MoG-Experiment" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 2: (left) Block diagram of the proposed method: Stage-1: Negative Adaptation of the GAN to negative samples received from user feedback and Stage-2: Unlearning of the original GAN using the positive samples with a repulsion loss. (right) An example of results obtained using our method on Mixture of Gaussian (MoG) dataset, where we unlearn two centers provided in negative samples.
</div>

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      Our proposed method follows a two-stage process:
        <ol>
            <li><strong>Stage 1 - Negative Adaptation:</strong> We first adapt the pre-trained GAN (\(\theta_G\)) using a small set of 'negative' samples provided by the user, which contain the undesired features. This results in an adapted GAN (\(\theta_N\)) that primarily generates these negative samples. We use techniques like Elastic Weight Consolidation (EWC) to handle the few-shot nature of this adaptation.
            </li>
        </ol>
    </p>

    $$
    \begin{align}
        \theta_N, \phi_N = \arg\min_{\theta}\max_{\phi}~ \mathcal{L}_{adv} + \gamma\mathcal{L}_{adapt}
    \end{align}
    $$

    $$
    \begin{align}
        \text{where,}~~~
        \mathcal{L}_{adv} = \mathbb{E}_{\mathbf{x}\sim p_{N}(x)}\left[\log D_\phi(\mathbf{x})\right] + \mathbb{E}_{\mathbf{z}\sim p_{Z}(z)}\left[\log (1 - D_\phi(G_\theta(\mathbf{z})))\right]
    \end{align}
    $$

    $$
    \begin{align}
        \mathcal{L}_{adapt} = \lambda \sum_{i}F_i(\theta_i - \theta_{G,i}), \quad
        F = \mathbb{E}\left[ -\frac{\partial^2}{\partial\theta_G^2}\mathcal{L}_{\theta_G}(\mathcal{S}_n) \right]
    \end{align}
    $$

    <p>
        <ol start="2">
            <li><strong>Stage 2 - Unlearning:</strong> Subsequently, we train the original pre-trained GAN using 'positive' samples (those without undesired features). Crucially, we introduce a repulsion regularizer (\(\mathcal{L}_{\text{repulsion}}\)) that encourages the learned model parameters (\(\theta_P\)) to move away from the negative parameters (\(\theta_N\)) obtained in Stage 1, while the standard adversarial loss ensures generation quality is maintained.</li>
        </ol>
    </p>
    $$
    \begin{align}
        \theta_P, \phi_P &= \arg\underset{\theta}{\min}~\underset{\phi}{\max}~ \mathcal{L}_{adv}^{'} + \gamma\mathcal{L}_{repulsion} \label{eq:objective_stage2} \\
        \text{where, }\mathcal{L}_{adv}^{'} &= \underset{\mathbf{x}\sim p_{G\backslash N}(x)}{\mathbb{E}}\left[\log D_\phi(\mathbf{x})\right] +  \underset{\mathbf{z}\sim p_{Z}(z)}{\mathbb{E}}\left[\log (1 - D_\phi(G_\theta(\mathbf{z})))\right] \label{eq:l_adv_stage2}
    \end{align}
    $$
  </div>
</div>


#### Choice of Repulsion Loss

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    <p>
      The repulsion loss (\(\mathcal{L}_{\text{repulsion}}\)) should encourage the learned parameter to traverse away from \(\theta_N\) obtained from the negative adaptation stage. In general, one can use any function of \(\|\theta - \theta_N\|_2^2\) that has a global maxima at \(\theta_N\) as a choice for repulsion loss. In this work, we explore three different choices for the repulsion loss:
        $$
            \begin{align}
                \mathcal{L}_{repulsion} = 
                \begin{cases}
                    \mathcal{L}_{repulsion}^{\text{IL2}} = \frac{1}{||\theta - \theta_N||_2^2} & \text{(Inverse $\ell_2$ loss)} \\
                    \mathcal{L}_{repulsion}^{\text{NL2}} = - ||\theta - \theta_N||_2^2 & \text{(Negative $\ell_2$ loss)} \\
                    \mathcal{L}_{repulsion}^{\text{EL2}} = \exp(-\alpha||\theta - \theta_N||_2^2) & \text{(Exponential negative $\ell_2$ loss)}
                \end{cases}
            \label{eq:repulsion-loss}
            \end{align}
        $$
    </p>
  </div>
</div>

---

<h3 style="text-align: center; font-weight: bold;">Results</h3>

<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/mnist_table.png" title="mnist-result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/mnist_results.png" title="mnist-result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 3: Results of Unlearning different classes on MNIST dataset.
</div>

<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/afhq_table.png" title="afhq-result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/afhq_results.png" title="afhq-result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 4: Results of Unlearning different classes on AFHQ dataset.
</div>

<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/celebahq_table.png" title="celebahq-result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div id="block-diagram" class="row align-items-center">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/publication_preview/atu_tmlr/celbahq_results.png" title="celebahq-result" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Figure 5: Results of Unlearning different features on CelebaHQ dataset.
</div>


---


If you find our work useful, please consider citing our paper:

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