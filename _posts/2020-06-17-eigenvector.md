---
layout: post
title: 'Pondering upon Eigenvectors'
date: 2020-06-17 11:12:00-0400
description: An intuitive and geometric exploration of eigenvectors, eigenvalues, and their computational algorithms.
tags: math, linear-algebra, basics
categories: math
related_posts: false
toc:
  sidebar: left
---

## Table of Contents
- [Matrix as Transformations!](#matrix-as-transformations)
  - [The Active vs. Passive Duality](#the-active-vs.-passive-duality)
- [What are these "Eigen" things?](#what-are-these-eigen-things)
  - [Physical Meaning of Negative and Zero Eigenvalues](#physical-meaning-of-negative-and-zero-eigenvalues)
  - [Complex Eigenvalues and 2D Rotations](#complex-eigenvalues-and-2d-rotations)
- [Interactive Visualization](#interactive-visualization)
- [Some things to look for](#some-things-to-look-for)
  - [Algebraic vs. Geometric Multiplicity (Defective Matrices)](#algebraic-vs-geometric-multiplicity-defective-matrices)
- [So why do they pop up everywhere?](#so-why-do-they-pop-up-everywhere)
- [Computational Methods for Eigenvalues and Eigenvectors](#computational-methods-for-eigenvalues-and-eigenvectors)
  - [Power Method](#power-method)
  - [QR Algorithm](#qr-algorithm)
  - [Jacobi Method](#jacobi-method)
  - [Krylov Subspace Methods](#krylov-subspace-methods)
  - [Divide and Conquer Approaches](#divide-and-conquer-approaches)
  - [Numerical Considerations](#numerical-considerations)
- [Real-World Applications of Eigenvectors and Eigenvalues](#real-world-applications-of-eigenvectors-and-eigenvalues)
  - [Principal Component Analysis (PCA)](#principal-component-analysis-pca)
  - [Google's PageRank Algorithm](#googles-pagerank-algorithm)
  - [Markov Chains and Steady States](#markov-chains-and-steady-states)
  - [Vibration Analysis in Engineering](#vibration-analysis-in-engineering)
  - [Quantum Mechanics](#quantum-mechanics)
- [Footnotes](#footnotes)

Eigenvectors and eigenvalues pop up in many areas of mathematical analysis and applications, including Machine Learning, Control Theory, Signal Processing, Quantum Physics, and Markov processes, just to name a few! Despite their wide applications, it isn't always clear what these eigenvectors represent or what their significance is in all these different contexts. Many students see eigenvectors as a bunch of mechanical algebraic steps to find a vector, leaving them with little conceptual intuition. 

In this post, I aim to build a strong geometric intuition for eigenvectors and eigenvalues, explore their real-world significance, and outline how they are computed numerically.

---

## Matrix as Transformations!

To understand eigenvectors, we must first understand what a **matrix** really is. Standard textbooks often introduce matrices as a rigid grid of numbers used to perform collective arithmetic operations. While technically correct, a much deeper and more beautiful perspective is to view a matrix as a **linear transformation** of space.

Let's take a simple example. Let:

$$A = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$$

If we multiply any vector $$\mathbf{v} = \begin{bmatrix} v_1 \\ v_2 \end{bmatrix}$$ by $$A$$, we get the same vector back. Not very interesting, right?

But here is where it gets interesting: we can look at this matrix multiplication in two ways. One way is the traditional row-by-column dot product:

$$A\mathbf{v} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} (1 \cdot v_1) + (0 \cdot v_2) \\ (0 \cdot v_1) + (1 \cdot v_2) \end{bmatrix}$$

But there's another, much more insightful way to view it: instead of multiplying rows by columns, we can think of matrix multiplication as a **linear combination of the column vectors of the matrix**, scaled by the elements of $$\mathbf{v}$$:

$$A\mathbf{v} = v_1 \begin{bmatrix} 1 \\ 0 \end{bmatrix} + v_2 \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

From this perspective, multiplying a matrix by a vector is essentially taking the columns of the matrix, scaling them by corresponding components of the vector, and summing them up! 

This highlights a fundamental property: **when the columns of a matrix are linearly independent, they form a basis for the range (image) of the matrix**. These columns represent the landing positions of our standard basis vectors under the transformation. 

Going back to our example, the columns of $$A$$:

$$\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix} \quad \text{and} \quad \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

represent the coordinate axes (historically referred to as $$\hat{i}$$ and $$\hat{j}$$). So, the product $$A\mathbf{v}$$ is nothing but $$v_1 \mathbf{e}_1 + v_2 \mathbf{e}_2$$.

What if the matrix is non-trivial? Say:

$$A = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$$

It works exactly the same way! Under this transformation, the first basis vector $$\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$ lands at $$\begin{bmatrix} a \\ c \end{bmatrix}$$, and the second basis vector $$\mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$ lands at $$\begin{bmatrix} b \\ d \end{bmatrix}$$. 

Any general vector $$\mathbf{v} = \begin{bmatrix} v_1 \\ v_2 \end{bmatrix}$$ in the original space will land at the corresponding combination in the transformed space:

$$A\mathbf{v} = v_1 \begin{bmatrix} a \\ c \end{bmatrix} + v_2 \begin{bmatrix} b \\ d \end{bmatrix}$$

This gives us a wonderful geometric picture of matrix multiplication: **a matrix tells us where the standard basis vectors land, and the entire coordinate grid is stretched, sheared, rotated, or scaled along with them.**

### The Active vs. Passive Duality

Linear transformations can be viewed through two distinct lenses:

1. **The Active Viewpoint**: The coordinate axes stay fixed, but the vector space itself is physically deformed. The vector $$\mathbf{v}$$ is actively moved by $$A$$ to a new location $$A\mathbf{v}$$.
2. **The Passive Viewpoint (Change of Basis)**: The space and physical points remain static, but we change our coordinate system. The columns of $$A$$ represent a new set of basis vectors, and $$A\mathbf{v}$$ represents the original vector expressed in terms of these new basis coordinates.

Both viewpoints are mathematically equivalent, but the active viewpoint is particularly useful for visualizing eigenvalues and eigenvectors.

---

## What are these "Eigen" things?

Now that we can visualize a matrix as warping space, we are in a perfect position to understand eigenvectors and eigenvalues.

When space is transformed by a matrix $$A$$, most vectors are knocked off their original span (the line passing through the vector and the origin). However, **there are always certain special vectors that do not change their span! Instead, they remain on the exact same line, merely getting scaled up, scaled down, or reversed.** 

These invariant vectors are **eigenvectors**, and the scale factor by which they stretch, shrink, or flip is the corresponding **eigenvalue** (denoted by $$\lambda$$).

Mathematically, this condition is written as:

$$A\mathbf{x} = \lambda \mathbf{x}$$

where $$\mathbf{x} \neq \mathbf{0}$$. To solve this, we rearrange the equation:

$$(A - \lambda I)\mathbf{x} = \mathbf{0}$$

For a non-zero vector $$\mathbf{x}$$ to satisfy this equation, the matrix $$(A - \lambda I)$$ must be singular (non-invertible), which means its determinant must be zero:

$$\det(A - \lambda I) = 0$$

This is the **characteristic equation**. Solving it gives us the eigenvalues $$\lambda$$. For each eigenvalue, we find the eigenvectors by finding the basis of the **null space** (or kernel) of $$(A - \lambda I)$$.

### Physical Meaning of Negative and Zero Eigenvalues

The scale factor $$\lambda$$ can tell us a lot about the transformation along the eigenvector's direction:
- **$$\lambda > 1$$**: The space is stretched along the eigenvector's line.
- **$$0 < \lambda < 1$$**: The space is compressed along the eigenvector's line.
- **$$\lambda < 0$$**: The space is scaled and **flipped** in the opposite direction. Although the vector's pointing direction reverses, it still lies along the exact same invariant line (span), so it is still an eigenvector!
- **$$\lambda = 0$$**: The eigenvector is squashed completely to the origin ($$A\mathbf{x} = \mathbf{0}$$. This means the eigenvector lies in the **null space (kernel)** of the matrix. This represents a loss of dimension, squashing the entire space along that line into a single point.

### Complex Eigenvalues and 2D Rotations

What if a matrix has no real eigenvectors? Consider a pure 2D rotation matrix:

$$R_\theta = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$$

For any angle $$\theta$$ that is not a multiple of $$\pi$$, every single vector in the plane is rotated and knocked off its original span. Therefore, there are no *real* eigenvectors. 

If we solve the characteristic equation for $$R_\theta$$:

$$\det(R_\theta - \lambda I) = \lambda^2 - 2\lambda\cos\theta + 1 = 0$$

Using the quadratic formula, we obtain complex conjugate eigenvalues:

$$\lambda = \cos\theta \pm i\sin\theta = e^{\pm i\theta}$$

This shows us that in the real plane $$\mathbb{R}^2$$, no vector is merely scaled. However, if we expand our field to complex vector spaces $$\mathbb{C}^2$$, these complex eigenvalues and eigenvectors represent invariant structures where the complex numbers naturally capture the simultaneous rotation and scaling of the space!

---

## Interactive Visualization

Below is an interactive linear transformation tool. You can directly drag the tips of the basis vectors $$\mathbf{e}_1$$ (represented by $$\mathbf{i}'$$ in red) and $$\mathbf{e}_2$$ (represented by $$\mathbf{j}'$$ in green) to distort the coordinate grid, which updates the matrix $$A$$ in real-time. 

You can also drag the orange vector $$\mathbf{x}$$ and watch how its transformed counterpart $$A\mathbf{x}$$ (in blue) responds. The golden dashed lines represent the **eigenvectors** of the matrix. If you drag $$\mathbf{x}$$ close to an eigenvector, it will snap into place and highlight the scaling factor!

<link rel="stylesheet" href="{{ '/assets/css/eigenvector-vis.css' | relative_url }}">

<div class="eigen-vis-container">
  <div class="eigen-vis-canvas-area">
    <div class="eigen-alignment-badge" id="eigenBadge">Aligned with Eigenvector!</div>
    <div class="eigen-vis-canvas-wrapper">
      <canvas id="eigenCanvas" class="eigen-vis-canvas"></canvas>
      <div class="eigen-canvas-tooltip" id="canvasTooltip" style="display: none;">(0.00, 0.00)</div>
    </div>
    
    <div class="eigen-legend">
      <div class="eigen-legend-item">
        <div class="eigen-legend-color" style="background: #f5365c;"></div>
        <span>î' (basis)</span>
      </div>
      <div class="eigen-legend-item">
        <div class="eigen-legend-color" style="background: #2dce89;"></div>
        <span>ĵ' (basis)</span>
      </div>
      <div class="eigen-legend-item">
        <div class="eigen-legend-color" style="background: #fb6340;"></div>
        <span>x (input)</span>
      </div>
      <div class="eigen-legend-item">
        <div class="eigen-legend-color" style="background: #11cdef;"></div>
        <span>Ax (output)</span>
      </div>
      <div class="eigen-legend-item">
        <div class="eigen-legend-color" style="background: rgba(216, 147, 10, 0.5); border: 1px dashed rgba(216, 147, 10, 0.8);"></div>
        <span>Eigenvectors</span>
      </div>
    </div>
    
    <div class="eigen-instruction-box">
      <strong>How to interact:</strong> Drag the handles (dots) at the tips of the vectors directly on the grid! Drag the pink/green basis vectors to distort the space, and drag the orange vector <strong>x</strong> to see its transformed counterpart <strong>Ax</strong>.
    </div>
  </div>
  
  <div class="eigen-vis-controls">
    <div>
      <div class="eigen-vis-section-title">Linear Transformation Presets</div>
      <div class="eigen-vis-presets">
        <button class="eigen-preset-btn" data-preset="scale">Simple Scale</button>
        <button class="eigen-preset-btn" data-preset="shear">Shear (Defective)</button>
        <button class="eigen-preset-btn" data-preset="rotation">Rotation (Complex)</button>
        <button class="eigen-preset-btn" data-preset="reflection">Reflection</button>
        <button class="eigen-preset-btn" data-preset="projection">Projection (Singular)</button>
      </div>
    </div>
    
    <div>
      <div class="eigen-vis-section-title">Matrix A Configuration</div>
      <div class="eigen-matrix-container">
        <div class="eigen-matrix-wrapper">
          <input type="text" class="eigen-matrix-cell" id="cellA" readonly>
          <input type="text" class="eigen-matrix-cell" id="cellB" readonly>
          <input type="text" class="eigen-matrix-cell" id="cellC" readonly>
          <input type="text" class="eigen-matrix-cell" id="cellD" readonly>
        </div>
      </div>
      
      <div class="eigen-sliders">
        <div class="eigen-slider-row">
          <span class="eigen-slider-label">a (x-scale of î)</span>
          <input type="range" class="eigen-slider-input" id="sliderA" min="-3" max="3" step="0.1" value="1.5">
          <span class="eigen-slider-val" id="valA">1.5</span>
        </div>
        <div class="eigen-slider-row">
          <span class="eigen-slider-label">b (x-scale of ĵ)</span>
          <input type="range" class="eigen-slider-input" id="sliderB" min="-3" max="3" step="0.1" value="0.5">
          <span class="eigen-slider-val" id="valB">0.5</span>
        </div>
        <div class="eigen-slider-row">
          <span class="eigen-slider-label">c (y-scale of î)</span>
          <input type="range" class="eigen-slider-input" id="sliderC" min="-3" max="3" step="0.1" value="0.2">
          <span class="eigen-slider-val" id="valC">0.2</span>
        </div>
        <div class="eigen-slider-row">
          <span class="eigen-slider-label">d (y-scale of ĵ)</span>
          <input type="range" class="eigen-slider-input" id="sliderD" min="-3" max="3" step="0.1" value="1.0">
          <span class="eigen-slider-val" id="valD">1.0</span>
        </div>
      </div>
    </div>
    
    <div>
      <div class="eigen-vis-section-title">Eigendecomposition Stats</div>
      <div class="eigen-stats-panel">
        <div class="eigen-stat-row">
          <span class="eigen-stat-label">Trace, Tr(A):</span>
          <span class="eigen-stat-val" id="statTrace">2.50</span>
        </div>
        <div class="eigen-stat-row">
          <span class="eigen-stat-label">Determinant, det(A):</span>
          <span class="eigen-stat-val" id="statDet">1.40</span>
        </div>
        <div class="eigen-stat-row">
          <span class="eigen-stat-label">Eigenvalue 1 (λ₁):</span>
          <span class="eigen-stat-val" id="statEigen1">Loading...</span>
        </div>
        <div class="eigen-stat-row">
          <span class="eigen-stat-label">Eigenvalue 2 (λ₂):</span>
          <span class="eigen-stat-val" id="statEigen2">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/eigenvector-vis.js' | relative_url }}"></script>

---

## Some things to look for

Having built a solid geometric intuition, let's explore some key linear algebra properties and clear up a few common misconceptions.

**Span**: The **span** of a set of vectors is the set of all linear combinations of those vectors. Geometrically, the span represents the full dimensional space (line, plane, volume) that can be reached using that set of vectors.

**Rank**: The rank of a matrix is the maximum number of linearly independent columns (or rows) in the matrix. Geometrically, the rank denotes the dimension of the range (image) of the linear transformation. 

Let's look at an example matrix:

$$A = \begin{bmatrix} 1 & 2 & 5 \\ 3 & 5 & 13 \\ 7 & 6 & 19 \end{bmatrix}$$

Multiplying a $$3 \times 1$$ vector by $$A$$ yields another $$3 \times 1$$ vector. It looks like $$A$$ maps vectors into a full 3D space, but if we inspect the columns closely, we find that the third column is a linear combination of the first two:

$$C_3 = C_1 + 2C_2$$

Because the columns are coplanar, any linear combination of them remains trapped in that 2D plane! Thus, the span of the columns is $$\mathbb{R}^2$$, not $$\mathbb{R}^3$$. The transformation actively squashes a dimension of the 3D system, compressing it onto a flat plane. The rank of this matrix is $$2$$, and the dimension of its null space is $$3 - 2 = 1$$.

### Algebraic vs. Geometric Multiplicity (Defective Matrices)

It is common to assume that an $$n \times n$$ matrix always has $$n$$ linearly independent eigenvectors. However, this is not always true! To understand why, we must define two types of multiplicity for an eigenvalue $$\lambda$$:

1. **Algebraic Multiplicity ($$m_a$$)**: The number of times $$\lambda$$ appears as a root of the characteristic polynomial.
2. **Geometric Multiplicity ($$m_g$$)**: The dimension of the corresponding eigenspace, i.e., the number of linearly independent eigenvectors associated with $$\lambda$$ ($$\dim(\text{Null}(A - \lambda I))$$).

It is a mathematical theorem that for any eigenvalue, $$1 \le m_g \le m_a$$. 

A matrix is **diagonalizable** if and only if the sum of the geometric multiplicities equals $$n$$, meaning we have a full basis of eigenvectors. If $$m_g < m_a$$ for any eigenvalue, the matrix is **defective** and cannot be diagonalized.

A classic example is the **shear matrix** (try clicking the "Shear" preset in the visualization above):

$$A = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$$

Its characteristic equation is:

$$\det(A - \lambda I) = (1 - \lambda)^2 = 0$$

which yields a single eigenvalue $$\lambda = 1$$ with an algebraic multiplicity $$m_a = 2$$. 

To find the eigenvectors, we solve $$(A - I)\mathbf{v} = \mathbf{0}$$:

$$\begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies v_2 = 0$$

This means any eigenvector must lie along the x-axis, taking the form $$\begin{bmatrix} c \\ 0 \end{bmatrix}$$. The geometric multiplicity is $$m_g = 1$$. Because $$m_g < m_a$$, the shear matrix is defective; it is impossible to find a second independent eigenvector, meaning we cannot form a full eigenvector basis to diagonalize it. Geometrically, the shear transformation slides space parallel to the x-axis, leaving only a single line of vectors invariant.

---

## So why do they pop up everywhere?

Simply put, eigenvectors make linear transformations incredibly easy to understand, visualize, and compute! 

For any diagonalizable matrix $$A$$, we can decompose it into a product of its eigenvectors and eigenvalues:

$$A = V \Lambda V^{-1}$$

where $$V$$ is a matrix containing the eigenvectors as columns, and $$\Lambda$$ is a diagonal matrix containing the eigenvalues along the diagonal. 

This factorization is called **eigenvalue decomposition (eigendecomposition)**. It allows us to analyze any complex linear transformation as a simple three-step process:
1. $$V^{-1}$$: Change our coordinates to the eigenvector basis.
2. $$\Lambda$$: Perform simple independent scaling along each eigenvector axis.
3. $$V$$: Transform back to our original coordinate system.

This makes raising a matrix to a high power incredibly efficient. Instead of performing costly matrix multiplications $$A^k = A \cdot A \cdots A$$, we simply scale the eigenvalues:

$$A^k = V \Lambda^k V^{-1}$$

This decomposition is a cornerstone of Control Theory, Signal Processing, and Dynamical Systems.

---

## Computational Methods for Eigenvalues and Eigenvectors

While the theoretical foundation of eigenvectors and eigenvalues relies on symbolic determinants, computing them for real-world applications requires robust and efficient numerical algorithms. Here, we explore the primary computational methods used in modern numerical libraries.

### Power Method

The simplest iterative approach for finding the dominant eigenvalue (largest in magnitude) and its corresponding eigenvector is the **power method**.

Given a matrix $$A \in \mathbb{R}^{n \times n}$$, the algorithm proceeds as follows:

1. Start with an initial guess vector $$\mathbf{x}_0$$, typically random and non-zero.
2. Perform the iterative updates:
   $$\mathbf{y}_{k+1} = A\mathbf{x}_k$$
   $$\mathbf{x}_{k+1} = \frac{\mathbf{y}_{k+1}}{\|\mathbf{y}_{k+1}\|_2}$$
3. The sequence $$\{\mathbf{x}_k\}$$ converges to the dominant eigenvector.
4. The dominant eigenvalue is estimated using the **Rayleigh quotient**:
   $$\lambda \approx \frac{\mathbf{x}_k^T A \mathbf{x}_k}{\mathbf{x}_k^T \mathbf{x}_k}$$

For convergence, the matrix must have a strictly dominant eigenvalue $$\lambda_1$$ such that $$\lvert\lambda_1\rvert > \lvert\lambda_2\rvert \ge \lvert\lambda_3\rvert \ge \cdots \ge \lvert\lambda_n\rvert$$. The rate of convergence depends on the ratio $$\lvert\frac{\lambda_2}{\lambda_1}\rvert$$—the smaller this ratio, the faster the method converges.

- **Inverse Power Method**: Can find the *smallest* eigenvalue by applying the power method to $$A^{-1}$$. In practice, we solve the system $$A\mathbf{y}_{k+1} = \mathbf{x}_k$$ at each step using LU decomposition rather than explicitly calculating the matrix inverse.
- **Shifted Inverse Power Method**: Can target eigenvalues near a specific scalar $$\mu$$ by applying the inverse power method to $$(A - \mu I)$$. This is extremely useful when we have an approximate eigenvalue and want to compute the exact pair rapidly.

### QR Algorithm

The **QR algorithm** is the industry standard for computing all eigenvalues of a dense matrix. It works by performing a sequence of QR decompositions:

1. Initialize $$A_0 = A$$.
2. For $$k = 0, 1, 2, \ldots$$:
   - Compute the QR decomposition $$A_k = Q_k R_k$$, where $$Q_k$$ is orthogonal ($$Q^T Q = I$$) and $$R_k$$ is upper triangular.
   - Set $$A_{k+1} = R_k Q_k$$.

Since $$A_{k+1} = R_k Q_k = Q_k^T (Q_k R_k) Q_k = Q_k^T A_k Q_k$$, each step is a similarity transformation, preserving the eigenvalues. As $$k \to \infty$$, the matrix $$A_k$$ converges to a upper quasi-triangular form (Schur form), with the eigenvalues appearing directly on the diagonal (or in $$2 \times 2$$ diagonal blocks for complex conjugate pairs).

To make this computationally feasible, the matrix is first reduced to **Hessenberg form** (upper triangular plus one subdiagonal) using Householder reflections:

$$A = PHP^T$$

This preliminary step reduces the cost of each subsequent QR decomposition from $$O(n^3)$$ to $$O(n^2)$$ operations. Adding **shifts** (such as the Wilkinson shift) further accelerates the convergence to quadratic or cubic rates.

### Jacobi Method

For symmetric matrices ($$A = A^T$$), the **Jacobi method** is a highly reliable, historically significant algorithm. It eliminates off-diagonal elements through a sequence of plane rotations (Givens rotations):

1. Initialize $$A_0 = A$$ and $$V_0 = I$$.
2. At each step $$k$$, identify the largest off-diagonal element $$a_{ij}^{(k)}$$.
3. Compute a rotation angle $$\theta$$ in the $$(i, j)$$ plane to zero out this element:
   $$\tan(2\theta) = \frac{2a_{ij}^{(k)}}{a_{ii}^{(k)} - a_{jj}^{(k)}}$$
4. Construct the Jacobi rotation matrix $$J$$.
5. Update $$A_{k+1} = J^T A_k J$$ and $$V_{k+1} = V_k J$$.

The off-diagonal elements systematically shrink to zero, leaving the eigenvalues on the diagonal of $$A_k$$ and the eigenvectors as columns in the accumulator matrix $$V_k$$.

### Krylov Subspace Methods

For extremely large, sparse matrices (where $$n$$ is in the millions, such as in finite element analysis or network analysis), dense algorithms like QR are completely impractical. Instead, we project the matrix onto a lower-dimensional **Krylov subspace**:

$$\mathcal{K}_m(A, \mathbf{v}) = \text{span}\{\mathbf{v}, A\mathbf{v}, A^2\mathbf{v}, \ldots, A^{m-1}\mathbf{v}\}$$

- **Arnoldi Iteration**: Builds an orthonormal basis for this subspace and produces an upper Hessenberg matrix $$H_m$$ that approximates the action of $$A$$ on the subspace. The eigenvalues of $$H_m$$ (called **Ritz values**) provide excellent approximations of the extreme eigenvalues of $$A$$.
- **Lanczos Algorithm**: A simplified version of Arnoldi for symmetric matrices. Since $$H_m$$ becomes a symmetric tridiagonal matrix $$T_m$$, the recurrence relation only requires three terms, drastically reducing memory and CPU overhead.

### Divide and Conquer Approaches

For symmetric tridiagonal matrices, divide-and-conquer algorithms solve the eigenvalue problem by recursively splitting the tridiagonal matrix into independent subproblems, solving them, and merging the results. The merging step requires solving a **secular equation**:

$$f(\lambda) = 1 + \sum_{i=1}^{n} \frac{\rho_i^2}{\delta_i - \lambda} = 0$$

This method is exceptionally fast ($O(n^2)$ instead of $O(n^3)$ for large matrices) and is highly parallelizable, making it the default solver in packages like LAPACK for large symmetric systems.

### Numerical Considerations

1. **Conditioning**: The sensitivity of a simple eigenvalue $$\lambda$$ to perturbations in $$A$$ is measured by its **eigenvalue condition number**. Let $$\mathbf{x}$$ be the normalized right eigenvector and $$\mathbf{y}$$ be the normalized left eigenvector ($$\mathbf{y}^H A = \lambda \mathbf{y}^H$$). The condition number is:
   $$\kappa(\lambda) = \frac{\|\mathbf{y}\|_2 \|\mathbf{x}\|_2}{\lvert\mathbf{y}^H \mathbf{x}\rvert}$$
   If $$\mathbf{x}$$ and $$\mathbf{y}$$ are nearly orthogonal ($$\mathbf{y}^H \mathbf{x} \approx 0$$), the eigenvalue is highly sensitive (ill-conditioned). For symmetric matrices, left and right eigenvectors are identical, meaning $$\kappa(\lambda) = 1$$ (perfectly conditioned).
2. **Balancing**: Non-symmetric matrices often undergo a preprocessing step called balancing ($$B = P^{-1} A P$$ where $$P$$ is a diagonal scaling matrix) to equalize row and column norms, significantly reducing rounding errors.
3. **Deflation**: Once an eigenvalue-eigenvector pair is found, we can deflate the matrix by projecting the computed eigenvalue out of the system, allowing subsequent iterations to focus strictly on the remaining spectrum.

---

## Real-World Applications of Eigenvectors and Eigenvalues

The beauty of eigenvectors lies in their ability to decouple complex, multi-dimensional systems into simple, independent one-dimensional problems. Let's look at how they drive crucial technologies.

### Principal Component Analysis (PCA)

In data science, PCA is the gold standard for dimensionality reduction and data visualization. 

Given a data matrix $$X \in \mathbb{R}^{n \times p}$$ consisting of $$n$$ observations and $$p$$ features, we:
1. Center the data by subtracting the column means: $$\tilde{X} = X - \mathbf{1}\boldsymbol{\mu}^T$$.
2. Compute the symmetric $$p \times p$$ covariance matrix $$\Sigma$$:
   $$\Sigma = \frac{1}{n-1} \tilde{X}^T \tilde{X}$$
3. Perform eigendecomposition on $$\Sigma$$:
   $$\Sigma = V \Lambda V^T$$
   where the columns of $$V$$ are the orthonormal eigenvectors (called **Principal Components** or load vectors) and the diagonal of $$\Lambda$$ contains the eigenvalues $$\lambda_1 \ge \lambda_2 \ge \cdots \ge \lambda_p \ge 0$$.

The eigenvectors represent the directions of maximum variance in the data, and the eigenvalues represent the amount of variance captured along those directions. By selecting the first $$k$$ eigenvectors corresponding to the largest eigenvalues, we can project high-dimensional data onto a lower-dimensional subspace while retaining the vast majority of the information.

$$\text{Variance explained by first } k \text{ components} = \frac{\sum_{i=1}^{k} \lambda_i}{\sum_{i=1}^{p} \lambda_i}$$

In computer vision, this same math is used for **Eigenfaces** to represent and compress human face images efficiently.

<link rel="stylesheet" href="{{ '/assets/css/pca-vis.css' | relative_url }}">

<div class="pca-vis-container">
  <div class="pca-vis-canvas-area">
    <div class="pca-vis-canvas-wrapper">
      <canvas id="pcaCanvas" class="pca-vis-canvas"></canvas>
      <div class="pca-canvas-tooltip" id="pcaTooltip" style="display: none;">(0.00, 0.00)</div>
    </div>
    
    <div class="pca-legend">
      <div class="pca-legend-item">
        <div class="pca-legend-color" style="background: #fb6340;"></div>
        <span>Data Points</span>
      </div>
      <div class="pca-legend-item">
        <div class="pca-legend-color" style="background: #ffffff; border: 1px solid #1a1a1a;"></div>
        <span>Mean (μ)</span>
      </div>
      <div class="pca-legend-item">
        <div class="pca-legend-color" style="background: #11cdef;"></div>
        <span>PC1 (Eigenvector 1)</span>
      </div>
      <div class="pca-legend-item">
        <div class="pca-legend-color" style="background: #2dce89;"></div>
        <span>PC2 (Eigenvector 2)</span>
      </div>
      <div class="pca-legend-item">
        <div class="pca-legend-color" style="background: rgba(94, 114, 228, 0.15); border: 1px solid rgba(94, 114, 228, 0.4);"></div>
        <span>Covariance Ellipse</span>
      </div>
    </div>
    
    <div class="pca-instruction-box">
      <strong>Interactive Controls:</strong> Click anywhere on the grid to <strong>add new data points</strong>! Drag any point to reposition it, or <strong>double-click a point to delete it</strong>. Watch the covariance ellipse and PC axes adjust in real-time.
    </div>
  </div>
  
  <div class="pca-vis-controls">
    <div>
      <div class="pca-vis-section-title">Data Presets</div>
      <div class="pca-vis-presets">
        <button class="pca-preset-btn" data-preset="linear">Linear Trend</button>
        <button class="pca-preset-btn" data-preset="circular">Circular Noise</button>
        <button class="pca-preset-btn" data-preset="outliers">Outlier Skew</button>
        <button class="pca-preset-btn pca-clear-btn" id="clearPcaBtn">Clear All</button>
      </div>
    </div>

    <div>
      <div class="pca-vis-section-title">Dimensionality Reduction</div>
      <div class="pca-projection-panel">
        <div class="pca-slider-row">
          <span class="pca-slider-label">PC1 Projection:</span>
          <input type="range" class="pca-slider-input" id="sliderProj" min="0" max="1" step="0.01" value="0">
          <span class="pca-slider-val" id="valProj">0%</span>
        </div>
        <button class="pca-anim-btn" id="animProjBtn">▶ Animate Projection</button>
      </div>
    </div>
    
    <div>
      <div class="pca-vis-section-title">Covariance Matrix Σ</div>
      <div class="pca-matrix-container">
        <div class="pca-matrix-wrapper">
          <div class="pca-matrix-cell" id="cellXX">0.00</div>
          <div class="pca-matrix-cell" id="cellXY">0.00</div>
          <div class="pca-matrix-cell" id="cellYX">0.00</div>
          <div class="pca-matrix-cell" id="cellYY">0.00</div>
        </div>
      </div>
    </div>
    
    <div>
      <div class="pca-vis-section-title">Data Analytics</div>
      <div class="pca-stats-panel">
        <div class="pca-stat-row">
          <span class="pca-stat-label">Centroid:</span>
          <span class="pca-stat-val" id="statMean">μ = (0.00, 0.00)</span>
        </div>
        <div class="pca-stat-row">
          <span class="pca-stat-label">PC1 Variance (λ₁):</span>
          <span class="pca-stat-val" id="statVar1">0.000</span>
        </div>
        <div class="pca-stat-row">
          <span class="pca-stat-label">PC2 Variance (λ₂):</span>
          <span class="pca-stat-val" id="statVar2">0.000</span>
        </div>
        <div class="pca-stat-row">
          <span class="pca-stat-label">PC1 Eigenvector:</span>
          <span class="pca-stat-val" id="statPca1">[1.00, 0.00]</span>
        </div>
        <div class="pca-stat-row">
          <span class="pca-stat-label">PC2 Eigenvector:</span>
          <span class="pca-stat-val" id="statPca2">[0.00, 1.00]</span>
        </div>
        <div class="pca-stat-row" style="border-bottom: none; margin-top: 4px;">
          <span class="pca-stat-label" style="color: var(--global-theme-color); font-weight: 800;">Variance explained:</span>
          <span class="pca-stat-val pca-variance-badge" id="statRatio">0.0%</span>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="{{ '/assets/js/pca-vis.js' | relative_url }}"></script>

---

### Google's PageRank Algorithm

The original search engine algorithm developed by Larry Page and Sergey Brin ranks web pages using the concept of **eigenvector centrality**.

Let's model the internet as a directed graph of $$n$$ pages:
- Let $$A$$ be the adjacency matrix, where $$A_{ij} = 1$$ if page $$j$$ links to page $$i$$, and $$0$$ otherwise.
- Let $$D$$ be the diagonal matrix containing the outdegrees of each page ($$D_{jj} = \sum_i A_{ij}$$).
- The transition probability matrix $$P = A D^{-1}$$ is column-stochastic (each column sums to 1).

To handle pages with no outgoing links (dangling nodes) and ensure the system converges, the PageRank matrix $$G$$ (the Google matrix) is defined with a damping factor $$\alpha$$ (typically $$0.85$$):

$$G = \alpha P + (1-\alpha) \frac{1}{n} \mathbf{1}\mathbf{1}^T$$

where $$\mathbf{1}$$ is an $$n \times 1$$ vector of ones. Since $$G$$ is column-stochastic, positive, and irreducible, the Perron-Frobenius theorem guarantees that the largest eigenvalue is exactly $$\lambda = 1$$. The PageRank vector $$\pi$$ is the unique **right eigenvector** corresponding to this dominant eigenvalue:

$$G\pi = \pi$$

Taking the transpose, we can equivalently express this in terms of row vectors:

$$\pi^T G^T = \pi^T$$

The components of $$\pi$$ represent the stationary probability that a random surfer lands on each page, serving as a highly robust measure of page importance.

### Markov Chains and Steady States

A Markov chain is a stochastic model describing a sequence of possible events where the probability of each event depends only on the state attained in the previous event. 

Let $$P$$ be the transition matrix of a Markov chain, where $$P_{ij}$$ is the probability of transitioning from state $$i$$ to state $$j$$. The probability distribution vector after $$t$$ steps is:

$$\boldsymbol{\mu}^{(t)} = \boldsymbol{\mu}^{(0)} P^t$$

For an irreducible and aperiodic Markov chain, the system eventually settles into a unique stationary distribution $$\boldsymbol{\pi}$$ that satisfies:

$$\boldsymbol{\pi} P = \boldsymbol{\pi}$$

This means $$\boldsymbol{\pi}$$ is a **left eigenvector** of the transition matrix $$P$$ with eigenvalue $$\lambda = 1$$. The rate of convergence to this steady state is governed by the second-largest eigenvalue $$\lvert\lambda_2\rvert < 1$$. The smaller $$\lvert\lambda_2\rvert$$ is, the faster the system reaches equilibrium:

$$\|\boldsymbol{\mu}^{(t)} - \boldsymbol{\pi}\|_{\text{TV}} \le C \cdot \lvert\lambda_2\rvert^t$$

where $$\|\cdot\|_{\text{TV}}$$ is the total variation distance and $$C$$ is a constant.

### Vibration Analysis in Engineering

In structural and mechanical engineering, understanding the natural frequencies of structures is vital to prevent catastrophic structural failures (such as the Tacoma Narrows Bridge collapse).

For a system with $$n$$ degrees of freedom, the system's motion is governed by:

$$M\ddot{\mathbf{x}}(t) + C\dot{\mathbf{x}}(t) + K\mathbf{x}(t) = \mathbf{F}(t)$$

where $$M$$ is the mass matrix, $$C$$ is the damping matrix, and $$K$$ is the stiffness matrix. For free, undamped vibration ($$C = \mathbf{0}$$, $$\mathbf{F} = \mathbf{0}$$), the equation becomes:

$$M\ddot{\mathbf{x}}(t) + K\mathbf{x}(t) = \mathbf{0}$$

Assuming a harmonic solution $$\mathbf{x}(t) = \mathbf{\phi} e^{i\omega t}$$, we substitute this back to obtain:

$$(K - \omega^2 M)\mathbf{\phi} = \mathbf{0} \implies K\mathbf{\phi} = \omega^2 M\mathbf{\phi}$$

This is a **generalized eigenvalue problem**. The eigenvalues $$\lambda_i = \omega_i^2$$ yield the natural frequencies of the system, and the eigenvectors $$\mathbf{\phi}_i$$ represent the **mode shapes** (the physical deformation patterns of the structure at those frequencies). By diagonalizing the mass and stiffness matrices, engineers can decouple these complex equations and analyze the structure as a set of simple, independent springs.

### Quantum Mechanics

In quantum mechanics, the physical state of a system is represented by a wave function $$\psi$$ in a Hilbert space, and physical observables (like position, momentum, or energy) are represented by self-adjoint (Hermitian) operators.

When a measurement is made, the only possible outcomes are the eigenvalues of the corresponding operator. The eigenvalue equation is written as:

$$\hat{A}\psi_n = a_n \psi_n$$

where $$\hat{A}$$ is the operator, $$a_n$$ is the eigenvalue (measurement outcome), and $$\psi_n$$ is the eigenstate. 

The famous time-independent **Schrödinger Equation** is simply an eigenvalue problem:

$$\hat{H}\psi = E\psi$$

where $$\hat{H}$$ is the Hamiltonian operator (representing the total energy of the system) and $$E$$ represents the allowed energy levels. 

When a measurement is made, the wave function instantly collapses onto one of the energy eigenstates $$\psi_n$$, and the probability of measuring that specific energy level $$E_n$$ is determined by the projection of the original state onto the eigenstate:

$$P(E_n) = \lvert\langle \psi_n \mid \psi \rangle\rvert^2$$

This reveals that eigenvectors and eigenvalues are not just convenient mathematical abstractions—they are deeply woven into the fundamental fabric of reality!

---

## Footnotes

1. **[3Blue1Brown's Linear Algebra Series](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)**: A phenomenal video series! The animations are incredibly helpful for building a geometric intuition of linear transformations, eigenvalues, and eigenvectors.
2. **[Setosa.io's Eigenvector Explainer](https://setosa.io/ev/eigenvectors-and-eigenvalues/)**: A great interactive visual post that shows how eigenvectors behave under manual matrix warping.
3. **[Gilbert Strang's MIT Lectures on Linear Algebra](https://ocw.mit.edu/courses/mathematics/18-06-linear-algebra-spring-2010/video-lectures/)**: An excellent and rigorous theoretical resource that covers the algebraic foundations of eigenvalues and numerical decompositions.