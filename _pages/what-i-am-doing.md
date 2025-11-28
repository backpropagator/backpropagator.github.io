---
layout: timeline
title: what-i-am-doing
permalink: /what-i-am-doing/
description: A timeline of my current and past activities, projects, and endeavors.
nav: false
nav_order: 6
---

<!-- Current Activity -->
<div class="timeline-item">
  <div class="timeline-time">July 2025 - Present</div>
  <div class="timeline-indicator current"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card current">
    <div class="activity-header">
      <h3>Student Researcher at Google DeepMind</h3>
      <span class="activity-status">Current</span>
    </div>
    <div class="activity-period">
      <i class="fas fa-calendar"></i>
      July 2025 - Present
    </div>
    
    <!-- Gist -->
    <div class="activity-gist">
      Joined the AnthroKrishi team at Google DeepMind as a student researcher, focusing on field and agricultural body segmentation from raw satellite data (RSD) using vision-language models (vLLMs). I was responsible for integrating Gemini for directly segmenting RSD and developing evaluation pipelines to assess model performance against established benchmarks.
    </div>
    
    <!-- Publications -->
    <div class="activity-publications">
      <h4><i class="fas fa-file-alt"></i>Representative Publications</h4>
      <ul class="publication-list">
        <li>
          <a href="#">TBA</a>
          <span class="pub-venue">TBA</span>
        </li>
      </ul>
    </div>
    
    <!-- Expandable Details -->
    <div class="activity-details">
      <div class="details-toggle">
        <span>Show me more</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="details-content">
        <div class="details-inner">
          <p>I joined Google DeepMind as a student researcher, at AnthroKrishi Team. The main goal of my project was to see if we can directly use vLLMs (e.g., Gemini, Gemma3, etc) for segmentation <strong>without</strong> any additional image/pixel decoder. This is an important distinction as there are several methods that leverage decoder head over LLM tokens for segmentation. These methods offer the luxury of using pixel-level segmentation loss directly to fine-tune the model. However, the problem becomes much harder and raises some tough questions such as -  <em>how do you represent a segmentation mask using tokens?</em>, <em>do you use polygons to represent each mask?</em>, <em>what about the limit on token length?</em></p>
          <p>There are few methods along this line. A prominent one being <a href="https://arxiv.org/abs/2410.09855">Text4Seg</a>, however, these methods fail to scale for high resolution RSD images. I was responsible for solving this problems using several innovations such as leveraging multi-scale segmentation masks and GRPO-based post-training. These changes led to an improvement of ~16% on RSD data compared to existing baselines.</p>
        </div>
      </div>
    </div>
    
  </div>
</div>

<!-- Milestone - Course Completion -->


<!-- Past Activity 1 -->


<!-- Note - Conference Talk -->
<!-- <div class="timeline-item">
  <div class="timeline-time">Nov 2023</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card note">
    <div class="note-content">
      <div class="note-icon">🎤</div>
      <p>Presented research at NeurIPS 2023 workshop on theoretical ML</p>
    </div>
  </div>
</div> -->





<!-- Past Activity 3 -->

<!-- Note - Best Project Award -->
<!-- <div class="timeline-item">
  <div class="timeline-time">May 2020</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card note">
    <div class="note-content">
      <div class="note-icon">🏆</div>
      <p>Received Best B.Tech Project Award for indoor localization research</p>
    </div>
  </div>
</div> -->

<div class="timeline-item">
  <div class="timeline-time">2024 - 2025</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card">
    <div class="activity-header">
      <h3>Safe and Unbiased generation in Generative Models</h3>
      <!-- <span class="activity-status">Completed</span> -->
    </div>
    <div class="activity-period">
      <i class="fas fa-calendar"></i>
      2024 - 2025
    </div>
    <!-- Gist -->
    <div class="activity-gist">
      During this period, I worked on solving problems like 'Unlearning' and 'Debiasing' in generative models like GANs and Diffusion Models.
    </div>
    <!-- Publications -->
    <div class="activity-publications">
      <h4><i class="fas fa-file-alt"></i>Representative Publications</h4>
      <ul class="publication-list">
        <li>
          <a href="#">Debiasing Diffusion Models via Score Guidance</a>
          <span class="pub-venue">Under Submission</span>
        </li>
        <li>
          <a href="#">Adapt then Unlearn: Exploring Parameter Space Semantics for Unlearning in Generative Adversarial Networks</a>
          <span class="pub-venue">TMLR, 2025</span>
        </li>
      </ul>
    </div>
    <!-- Expandable Details -->
    <div class="activity-details">
      <div class="details-toggle">
        <span>Show me more</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="details-content">
        <div class="details-inner">
          <p>I came across this idea of 'Unlearning' in 2023 through discussion with my friend <a href="https://subhodip123.github.io/">Subhodip Panda</a> (go checkout his work!), and I immediately got excited about its potential applications in generative models. At that time, this was still a very nascent area of research, and people were just starting to explore it in discriminative models. There were very few primitive attempts in generative models. I saw an opportunity to contribute by exploring how unlearning techniques could be integrated into SoTA GAN architectures like StyleGANs. One of the ideas I had was - to <strong>unlearn</strong> a particular concept, do we need to first <strong>learn</strong> it? This led us to do some toy experiment where we adapted GANs on a concept we want to unlearn and then perform linear extrapolation in parameter space in the opposite direction. This gave us strong evidence of <strong>unlearning</strong> being feasible in GANs by exploiting parameter space semantics. This observation finally culminated into our paper on unlearning in GANs.</p>
          <p>We tried to extend this idea further on diffusion models. However, this failed miserably. My hypothesis is that the 'parameter-space semantics' are much more reasonable in single-step samplers like GANs unlike diffusion models which are multi-step samplers. However, while reading on this, another problem that I found interesting was "fair generation" or "unbiased generation" in diffusion models. Usually, diffusion models exhibit a lot of biases towards certain concepts. After some simple mathematical analysis, we were able to pin-point exactly why this happens. And this insight gave us a simple solution on how we can solve this problem.</p>
        </div>
      </div>
    </div>
    
  </div>
</div>


<div class="timeline-item">
  <div class="timeline-time">2022 - 2024</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card">
    <div class="activity-header">
      <h3>Using EBMs to solve test time problems</h3>
      <!-- <span class="activity-status">Completed</span> -->
    </div>
    <div class="activity-period">
      <i class="fas fa-calendar"></i>
      2022 - 2024
    </div>
    
    <!-- Gist -->
    <div class="activity-gist">
      During this period I worked on understanding how energy-based models (EBMs) can be used to 'bridge' two distributions and how this 'bridge' could help solve problems at test time like domain adaptation / generalization.
    </div>
    
    <!-- Publications -->
    <div class="activity-publications">
      <h4><i class="fas fa-file-alt"></i>Representative Publications</h4>
      <ul class="publication-list">
        <li>
          <a href="#">LangDAug: Langevin Data Augmentation for Multi-Source Domain Generalization in Medical Image Segmentation</a>
          <span class="pub-venue">ICML, 2025</span>
        </li>
        <li>
          <a href="#">Bayesian Pseudo-Coresets via Contrastive Divergence</a>
          <span class="pub-venue">UAI, 2024</span>
        </li>
        <li>
          <a href="#">Cycle Consistent Twin Energy-based Models for Image-to-Image Translation</a>
          <span class="pub-venue">MICCAI - Medical Image Analysis (MedIA), 2023</span>
        </li>
      </ul>
    </div>
    
    <!-- Expandable Details -->
    <div class="activity-details">
      <div class="details-toggle">
        <span>Show me more</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="details-content">
        <div class="details-inner">
          <p>At the start of my Ph.D., I was fascinated by the idea of energy-based models (EBMs). In particular, it was exciting to know that we can learn the explicit (un-normalized) density function of the data using MLE/Contrastive Divergence. However, what fascinated me was not the training procedure, but the sampling process using MCMC langevin dynamics, especially the <a href="https://arxiv.org/abs/2012.00649">Latent Energy Transport</a> paper. It showed that one can <em>transverse</em> between two domains by using EBMs and its iterative sampling. This motivated me to first understand why exactly this should lead to 'translation'. Usually MCMC/LD allow you to sample from a distribution, but it was not clear why this should lead to 'translation'? To this end, we went on to propose a Cycle Consistent EBM which is explicitly trained to satisfy boundary conditions which satisfies the (vague) definition of 'translation'.</p>
          <p>Further, this 'translation' or 'bridge' between two distribution gives us samples from <a href="https://proceedings.neurips.cc/paper_files/paper/2000/file/ba9a56ce0a9bfa26e8ed9e10b2cc8f46-Paper.pdf">vicinal distributions</a> for free! This leads to a natural question - <em>can we make use of these vicinal distributions for data augmentation and hence, for domain generalization?</em> - the answer is yes! In hindsight, this idea need not be restricted to EBMs, any bridge process (which can be built using diffusio or flow models) should be capable of doing this.</p>
        </div>
      </div>
    </div>
    
  </div>
</div>


<div class="timeline-item">
  <div class="timeline-time">Aug 2021</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card milestone">
    <div class="milestone-content">
      <!-- <div class="milestone-icon">🚀</div> -->
      <div class="milestone-text">
        <h4>Start of Ph.D. at IISc</h4>
        <p>Joined ECE department @ IISc as a Ph.D. student.</p>
      </div>
    </div>
  </div>
</div>



<!-- Past Activity 4 -->
<div class="timeline-item">
  <div class="timeline-time">Mar 2021 - Aug 2021</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card">
    <div class="activity-header">
      <h3>Research @ IISc/IIT Delhi</h3>
      <!-- <span class="activity-status">Completed</span> -->
    </div>
    <div class="activity-period">
      <i class="fas fa-calendar"></i>
      Mar 2021 - Aug 2021
    </div>
    
    <!-- Gist -->
    <div class="activity-gist">
      Worked on two problems: (i) Few-shot adaptation of GANs on OOD data and (ii) Minority oversampling technique using VAEs for imbalanced data classification.
    </div>
    
    <!-- Publications -->
    <div class="activity-publications">
      <h4><i class="fas fa-file-alt"></i>Representative Publications</h4>
      <ul class="publication-list">
        <li>
          <a href="#">SoLAD: Sampling over Latent Adapter for Few Shot Generation</a>
          <span class="pub-venue">IEEE SPL, 2024</span>
        </li>
        <li>
          <a href="#">Few Shot Generative Domain Adaptation Via Inference-Stage Latent Learning in GANs</a>
          <span class="pub-venue">ICLR, 2023</span>
        </li>
        <li>
          <a href="#">Minority Oversampling for Imbalanced Data via Class-Preserving Regularized Auto-Encoders</a>
          <span class="pub-venue">AISTATS, 2023</span>
        </li>
      </ul>
    </div>
    
    <!-- Expandable Details -->
    <div class="activity-details">
      <div class="details-toggle">
        <span>Show me more</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="details-content">
        <div class="details-inner">
          <p>This was the transition period between my undergraduate studies and the start of my Ph.D. program. Here, I was exposed to modern deep learning research and publications aimed at the so-called A* conferences. My work primarily focussed on regularizing latent space of GANs and VAEs for improved generalization and robustness. My major focus was exploring if we can use pre-trained GANs to adapt to small OOD (but related) datasets (think of FFHQ and emojis dataset). The solution we came up was a simple inference-time optimization where a simple MLP was prepended to the GAN and trained while sampling for multiple steps. A follow-up work sought to reduce the inference-time of this method. To do this, we proposed a hyper-network that was trained to predict the optimal MLP parameters for a given latent vector.</p>
        </div>
      </div>
    </div>
    
  </div>
</div>


<div class="timeline-item">
  <div class="timeline-time">2021</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card milestone">
    <div class="milestone-content">
      <!-- <div class="milestone-icon">🚀</div> -->
      <div class="milestone-text">
        <h4>End of B.Tech</h4>
        <p>Graduated from EE department @ IITP.</p>
      </div>
    </div>
  </div>
</div>


<!-- Past Activity 4 -->
<div class="timeline-item">
  <div class="timeline-time">2017 - 2021</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card">
    <div class="activity-header">
      <h3>Research @ IIT Patna</h3>
      <!-- <span class="activity-status">Completed</span> -->
    </div>
    <div class="activity-period">
      <i class="fas fa-calendar"></i>
      2017 - 2021
    </div>
    <!-- Gist -->
    <div class="activity-gist">
      Worked on indoor localization using wireless RSSI data using classical MLE methods as well as deep learning methods.
    </div>
    <!-- Publications -->
    <div class="activity-publications">
      <h4><i class="fas fa-file-alt"></i>Representative Publications</h4>
      <ul class="publication-list">
        <li>
          <a href="#">A Lightweight α- μ Fading Environment based Localization towards Edge Implementation</a>
          <span class="pub-venue">IEEE Wireless Communication Letters, 2024</span>
        </li>
        <li>
          <a href="#">Bessel Function Mixture Model for Localization in Generalized η- μ IoT Fading Environment</a>
          <span class="pub-venue">IEEE Transactions on Network Sciences and Engineering, 2023</span>
        </li>
        <li>
          <a href="#">FadeLoc: Smart Device Localization for Generalized κ-μ Faded IoT Environment</a>
          <span class="pub-venue">IEEE Transactions on Signal Processing, 2022</span>
        </li>
        <li>
          <a href="#">Adaptive Mini-Batch Gradient-Ascent-Based Localization for Indoor IoT Networks Under Rayleigh Fading Conditions</a>
          <span class="pub-venue">IEEE Internet of Things Journal, 2021</span>
        </li>
      </ul>
    </div>
    <!-- Expandable Details -->
    <div class="activity-details">
      <div class="details-toggle">
        <span>Show me more</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="details-content">
        <div class="details-inner">
          <p>My undergraduate years at IIT Patna were transformative, sparking my deep interest in math/research. In particular, I worked on location estimation in indoor environment using RSSI signals. Particularly, RSSI data reach any device through wireless medium (think of how Wi-Fi signals reach your phone). The RSSI signals undergo various transformations and noise additions as they propagate through the environment, this is also referred to as <em>fading</em> making the localization task challenging yet fascinating. I worked on localization using generic fading models using an MLE based approach. Here is a list of fading models we explored and related subtleties:</p>
          <ol>
            <li><strong>Rayleigh Fading:</strong> Proposed MLE for Rayleigh fading model with simultaneous parameter estimates and an Adaptive Mini-Batch gradient ascent method to quickly maximize the log-likelihood to find the location estimate.</li>
            <li><strong>κ-μ Fading:</strong> Proposed an approximate MLE for κ − μ fading model and an Adaptive Order based like-lihood maximization using a look-up table to localize a smart device.</li>
            <li><strong>η-μ Fading:</strong> Proposed a weighted approximation for MLE of η − μ fading model which can use multiple Bessel function approximations to localize a smart device.</li>
            <li><strong>α-μ Fading:</strong> Proposed a lightweight RSS localization method by utilizing MLE of α − μ small-scale fading model.</li>
          </ol>
        </div>
      </div>
    </div>
    <!-- <div class="activity-tags">
      <span class="tag">Electrical Engineering</span>
      <span class="tag">Signal Processing</span>
      <span class="tag">IIT Patna</span>
      <span class="tag">Machine Learning</span>
    </div> -->
  </div>
</div>


<div class="timeline-item">
  <div class="timeline-time">Aug 2017</div>
  <div class="timeline-indicator"></div>
  <div class="timeline-connector"></div>
  <div class="timeline-card milestone">
    <div class="milestone-content">
      <!-- <div class="milestone-icon">🚀</div> -->
      <div class="milestone-text">
        <h4>Start of B.Tech at IIT Patna</h4>
        <p>Joined EE department @ IITP as undergraduate student.</p>
      </div>
    </div>
  </div>
</div>