---
layout: post
title: 'Pondering upon Eigenvectors'
date: 2020-06-17 11:12:00-0400
description: basics of eigenvectors/eigenvalues
tags: math, basics
categories: math
related_posts: false
toc:
  sidebar: left
---

## Table of Contents
- [Matrix as Transformations!](#matrix-as-transformations)
- [What are these "Eigen" things?](#what-are-these-eigen-things)
- [Some things to look for](#some-things-to-look-for)
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

The Eigenvectors & Eigenvalues pop up in many places of mathematical analysis and application. For example: Machine Learning, Control Theory, Signal Processing, Quantum Physics, Markov Process just to name a few! Despite their wide applications, it isn't entirely clear as to what these Eigenvectors represent and what is their significance in all these applications. Also, many students see Eigenvectors as a bunch of steps to find a vector which is going to help them, and hence they have very little intuition about them. In this post, I plan to give an intuition of the same and also provide some insights of how they are calculated algorithmically.

## Matrix as Transformations!

Well to understand this, we need to understand what a **"Matrix"** is? Generally, matrices are seen as a bunch of numbers inside a box used to perform collective operations. It's one way to look at it. But a higher level insight is to look at matrices as a **Transformation**!

Let's take an example, let $$A = \left( \begin{array}{cc} 1 & 0 \\ 0 & 1 \end{array} \right) $$.
If we multiply any vector
$$ \alpha = \left( \begin{array}{c} \alpha_1 \\ \alpha_2 \\ \end{array} \right) $$ with $$A$$, we'll get the same vector. Not interesting right?

But here is where it gets interesting, we can look at this multiplication in 2 ways. One way is the traditional method of matrix multiplication:

$$A\alpha = \left( \begin{array}{cc} 1 & 0 \\ 0 & 1 \end{array} \right) \left( \begin{array}{c} \alpha_1 \\ \alpha_2 \end{array} \right) = \left( \begin{array}{c} (1*\alpha_1) + (0*\alpha_2) \\ (0*\alpha_1) + (1*\alpha_2) \end{array} \right)$$

But there's another way to look at it, instead of multiplying rows by columns, we can multiply columns by scalar values, here's what I mean:

$$
A\alpha = \left( \begin{array}{c} 1 \\ 0 \\ \end{array} \right)\alpha_1 + \left( \begin{array}{c} 0 \\ 1 \\ \end{array} \right)\alpha_2
$$

From this way of multiplication, we can see that this multiplication is essentially addition of two separate column vectors, where each column vector is obtained by taking the columns of $$A$$ and **scaling** them by elements of $$\alpha$$! In other words, if we want to find the product of a matrix with a vector, just take the columns of the matrix, scale them by corresponding amount in the vector and sum them up. So, we scale the first column by $$\alpha_1$$ and second column by $$\alpha_2$$ and add them up.

Does this seem familiar? If you were thinking of Vectors, you are right! This highlights an important aspect of a Matrix: **when the columns of a Matrix are linearly independent, they form a basis for the range (image) of the Matrix**. These vectors are also called **Basis Vectors**.

Going back to our example, the columns of $$A$$:
$$
\left( \begin{array}{c} 1 \\ 0 \\ \end{array} \right)
$$ 
&
$$ 
\left( \begin{array}{c} 0 \\ 1 \\ \end{array} \right)
$$
in a way, represent the directions in which we need to travel to get our answer (the product), so you need to go $$\alpha_1$$ amount in the direction of
$$
\left( \begin{array}{c} 1 \\ 0 \\ \end{array} \right)
$$ 
and $$\alpha_2$$ amount in the direction of
$$
\left( \begin{array}{c} 0 \\ 1 \\ \end{array} \right)
$$ 
to get the product $$A\alpha$$.

In terms of vectors, one can interpret the columns of matrix as vector directions of $$\hat i$$ & $$\hat j$$ and the multiplication $$A\alpha$$ is nothing but the vector $$ \alpha_1 \hat i + \alpha_2 \hat j $$.

Cool! but what if the matrix isn't trivial like this one? say 
$$A = \left( \begin{array}{cc} x_1 & x_2 \\ y_1 & y_2 \\ \end{array} \right)$$
this makes a very little difference. Instead of the component directions being $$\hat i$$ & $$\hat j$$, the direction of each column will be $$ (x_1 \hat i + y_1 \hat j) $$ & $$ (x_2 \hat i + y_2 \hat j) $$ respectively.
And the product $$ A \alpha $$ is nothing but  $$ \alpha_1 (x_1 \hat i + y_1 \hat j)  + \alpha_2 (x_2 \hat i + y_2 \hat j)$$! This is really a nice way to look at matrix multiplications which relate Matrices to Vectors in such an intuitive way!

Now, where is transformation in all this? For this we need to look at $$\alpha$$.

Any $$\alpha$$ with dimension $$(2 \times 1)$$ can represent a point in 2-dimension. So, $$\alpha \in \mathbb{R}^2$$ and after multiplying by $$A$$, the product $$A\alpha \in \mathbb{R}^2$$ too. So, we can say that $$A$$ maps a vector from $$\mathbb{R}^2$$ to $$\mathbb{R}^2$$, **but is it the same Coordinate System?** The answer is **No!** the coordinate system has changed indeed but how? Think of it this way - originally, $$\alpha$$ was in original $$2D$$ plane whose axis were 
$$
\left( \begin{array}{c} 1 \\ 0 \\ \end{array} \right)
$$ 
&
$$
\left( \begin{array}{c} 0 \\ 1 \\ \end{array} \right)
$$ 
(or $$\hat i$$ & $$\hat j$$), so to go to any point we need to go some distance along $$\hat i$$ and some distance along $$\hat j$$, but after multiplying it by $$A$$, the axis are changed to 
$$
\left( \begin{array}{c} x_1 \\ y_1 \\ \end{array} \right)
$$ 
&
$$
\left( \begin{array}{c} x_2 \\ y_2 \\ \end{array} \right)
$$ 
(or $$(x_1 \hat i + y_1 \hat j)$$ & $$(x_2 \hat i + y_2 \hat j)$$). So, can you see the transformation? The axis of the coordinate system is changed after multiplying with a matrix. More clearly:


$$
\left( \begin{array}{c} 1 \\ 0 \\ \end{array} \right) \rightarrow \left( \begin{array}{c} x_1 \\ y_1 \\ \end{array} \right)
$$
&nbsp;&nbsp; & &nbsp;&nbsp;
$$
\left( \begin{array}{c} 0 \\ 1 \\ \end{array} \right) \rightarrow \left( \begin{array}{c} x_2 \\ y_2 \\ \end{array} \right)
$$ 


In literature these axes are also called **Basis Vectors**. Basis of a vector space is a set of linearly independent vectors through which we can get any vector in that space by taking some linear combination of these vectors. There's more to this, but I leave it to the reader to explore for themselves.

## What are these "Eigen" things?

Having an intuition of how matrix can be seen as a Transformation, we are in a position to understand the Eigenvectors & Eigenvalues.

So, while transforming a point from one basis to another by multiplication of a matrix, we map a point in the original 2D plane to some other point in the transformed plane. If we look at the vectors representing these points, they are also being transformed from one coordinate system to another. However, **there are some vectors that don't change their direction, instead they only get scaled up or scaled down!** These vectors are nothing but the Eigenvectors! and the amount by which they get scaled up or down is the corresponding Eigenvalue!

Mathematically, these are the vectors that after multiplying by $$A$$ get scaled up or down but the direction remains the same. For equation form we need, $$Ax$$ which is in the same direction as $$x$$ but scaled up or down (let's say by $$\lambda$$). So,

$$
Ax = \lambda x
$$

Which is the equation we have been taught to calculate the eigenvectors & eigenvalues. From this equation, we can find the Eigenvalues of A by solving 

$$
|A - \lambda\mathbb{I}| = 0
$$

To find the eigenvectors, we will have to find the Basis of Null-Space of
$$
A - \lambda\mathbb{I}
$$
for each eigenvalue $$\lambda$$. The Null Space of a matrix $$A$$ (also written as $$N(A)$$) contains all the vectors $$x$$ such that, $$Ax=0$$, so finding basis of 
$$ N(A-\lambda\mathbb{I}) $$ 
means that we have to find basis of all the vectors for which $$ (A - \lambda\mathbb{I})x = 0 $$ which is the definition of Eigenvectors.

## Some things to look for

Okay! so up to this point we have understood what is the physical significance of Eigenvectors. Now there are some things we should be aware of. Let's first define some terms.

**Span**: The **span** of a set of vectors is the set of all Linear Combinations of the vectors. Implicitly, Span indicates the dimension that can be covered by using a set of vectors.

**Rank**: Rank of a matrix is defined as the maximum number of linearly independent columns (or rows) in a matrix. This is the textbook definition of Rank. Its physical significance is that, Rank of a matrix denotes the dimension of the range (image) of the linear transformation. To understand this, let's take an example 

$$A = \left( \begin{array}{ccc} 1 & 2 & 5 \\ 3 & 5 & 13 \\ 7 & 6 & 19 \\ \end{array} \right)$$

So, if a vector of dimension $$(3 \times 1)$$ is multiplied by A, we'll get a $$(3 \times 1)$$ vector. Seems nice! It looks like $$A$$ produces a vector in 3D. But, it's not necessarily the case! if we look carefully, then we can see that, there are only 2 independent columns in $$A$$!

$$
C_3 = C_1 + 2C_2
$$ 

where $$C_1, C_2$$ & $$C_3$$ are the columns of $$A$$.

So, what this means is, these 3 columns/vectors are **Coplanar**, so taking any linear combination of these vectors would give us a point in this plane itself! So, the Span of the columns is $$\mathbb{R}^2$$ and not $$\mathbb{R}^3$$! We can also see this by a simple calculation, take any linear combination of columns of $$A$$:

$$
C = \alpha_1 C_1 + \alpha_2 C_2 + \alpha_3 C_3
$$

Using the fact that $$C_3 = C_1 + 2C_2$$:

$$
\begin{align}
C &= \alpha_1 C_1 + \alpha_2 C_2 + \alpha_3 (C_1 + 2C_2) \\
&= (\alpha_1 + \alpha_3) C_1 + (\alpha_2 + 2 \alpha_3) C_2 \\
&= \beta_1 C_1 + \beta_2 C_2
\end{align}
$$

So, though it looks like $$A$$ maps a vector to $$\mathbb{R}^3$$ but, it actually maps it to a subspace of dimension 2. Hence, rank of the matrix is 2! 

That being said, let's try to visualize the transformation this matrix is performing. The input space is $$\mathbb{R}^3$$ and the output space is a 2-dimensional subspace of $$\mathbb{R}^3$$, this means that the transformation, in some way, squashes a dimension of the 3D system.

It's important to note that there is a relationship between the rank of a matrix and its eigenvalues and eigenvectors, but it's not as simple as "the number of non-zero eigenvectors equals the rank." Instead:

1. For an $$n \times n$$ matrix, the dimension of the eigenspace corresponding to the eigenvalue 0 (if it exists) equals the nullity of the matrix (dimension of the null space), which is $$n - \text{rank}(A)$$.

2. A matrix can have up to $$n$$ linearly independent eigenvectors, regardless of its rank.

3. If a matrix has $$n$$ distinct eigenvalues, it will have $$n$$ linearly independent eigenvectors.

## So why do they pop up everywhere?

Well simply put, Eigenvectors make understanding/visualizing Linear transforms easier! We can analyze any Linear transform as stretching or compressing of certain vectors. Which makes things much easier, and for diagonalizable matrices, we can always decompose a matrix in terms of its eigenvectors & eigenvalues:

$$
A = V \Lambda V^{-1}
$$

where $$V$$ is the matrix containing Eigenvectors as columns & $$\Lambda$$ is a Diagonal matrix with Eigenvalues as the diagonal values. This Factorization is also called **Eigenvalue decomposition**, which is heavily used in Control Theory & Signal Processing.

It's worth noting that not all matrices are diagonalizable. A matrix is diagonalizable if and only if it has enough linearly independent eigenvectors to form a basis for the space. Specifically, an $$n \times n$$ matrix is diagonalizable if and only if the sum of the dimensions of its eigenspaces equals $$n$$.

## Computational Methods for Eigenvalues and Eigenvectors

While the theoretical foundation of eigenvectors and eigenvalues provides insight into their mathematical properties, computing them for practical applications requires efficient numerical algorithms. Here, we explore the primary computational methods used to calculate eigenvalues and eigenvectors, particularly for large matrices where direct calculation is infeasible.

### Power Method

The simplest iterative approach for finding the dominant eigenvalue (largest in magnitude) and its corresponding eigenvector is the power method.

Given a matrix $$A \in \mathbb{R}^{n \times n}$$, the algorithm works as follows:

1. Start with an initial guess vector $$\mathbf{x}_0$$, typically random but nonzero
2. Perform iterations:
   $$\mathbf{y}_{k+1} = A\mathbf{x}_k$$
   $$\mathbf{x}_{k+1} = \frac{\mathbf{y}_{k+1}}{\|\mathbf{y}_{k+1}\|}$$
3. The sequence $$\{\mathbf{x}_k\}$$ converges to the eigenvector corresponding to the dominant eigenvalue
4. The dominant eigenvalue can be estimated using the Rayleigh quotient:
   $$\lambda \approx \frac{\mathbf{x}_k^T A \mathbf{x}_k}{\mathbf{x}_k^T \mathbf{x}_k}$$

For convergence, the matrix must have a dominant eigenvalue $$\lambda_1$$ such that $$\mid\lambda_1\mid > \mid\lambda_2\mid \geq \mid\lambda_3\mid \geq \cdots \geq \mid\lambda_n\mid$$. The rate of convergence depends on the ratio $$\mid\frac{\lambda_2}{\lambda_1}\mid$$—the smaller this ratio, the faster the convergence.

A variant called the inverse power method can find the smallest eigenvalue by applying the power method to $$A^{-1}$$:

$$\mathbf{y}_{k+1} = A^{-1}\mathbf{x}_k$$

In practice, we solve the system $$A\mathbf{y}_{k+1} = \mathbf{x}_k$$ rather than explicitly computing the inverse.

The shifted inverse power method can target eigenvalues near a specific value $$\mu$$ by applying the inverse power method to $$(A - \mu I)$$:

$$\mathbf{y}_{k+1} = (A - \mu I)^{-1}\mathbf{x}_k$$

### QR Algorithm

The QR algorithm is a more robust method that can compute all eigenvalues of a matrix. It works by performing a sequence of QR decompositions:

1. Initialize $$A_0 = A$$
2. For $$k = 0, 1, 2, \ldots$$:
   - Compute the QR decomposition $$A_k = Q_k R_k$$ where $$Q_k$$ is orthogonal and $$R_k$$ is upper triangular
   - Set $$A_{k+1} = R_k Q_k$$ (note the order reversal)

As $$k \to \infty$$, $$A_k$$ converges to a Schur form, with eigenvalues appearing on the diagonal.

For computational efficiency, the matrix is first reduced to Hessenberg form (upper triangular plus one subdiagonal) using Householder reflections:

$$A = PHP^T$$

where $$P$$ is orthogonal and $$H$$ is in Hessenberg form. This preliminary step reduces the QR decomposition cost from $$O(n^3)$$ to $$O(n^2)$$ per iteration.

The QR algorithm with shifts further accelerates convergence:

1. Choose a shift $$\mu_k$$ (often the Wilkinson shift or the Rayleigh quotient shift)
2. Compute $$(A_k - \mu_k I) = Q_k R_k$$
3. Set $$A_{k+1} = R_k Q_k + \mu_k I$$

The implicit QR algorithm avoids explicitly forming $$(A_k - \mu_k I)$$ and operates directly on the Hessenberg matrix, making it numerically more stable.

### Jacobi Method

For symmetric matrices, the Jacobi method is an intuitive approach that works by eliminating off-diagonal elements through a sequence of plane rotations:

1. Initialize $$A_0 = A$$ and $$V_0 = I$$ (identity matrix)
2. At each step $$k$$, identify the largest off-diagonal element $$a_{ij}^{(k)}$$
3. Compute the rotation angle $$\theta$$ to zero out this element:
   $$\tan(2\theta) = \frac{2a_{ij}^{(k)}}{a_{ii}^{(k)} - a_{jj}^{(k)}}$$
4. Construct the rotation matrix $$J$$ (Jacobi rotation)
5. Update $$A_{k+1} = J^T A_k J$$ and $$V_{k+1} = V_k J$$

The process continues until the off-diagonal elements are sufficiently small. At convergence, $$A_k$$ contains the eigenvalues on the diagonal, and $$V_k$$ contains the eigenvectors as columns.

For an $$n \times n$$ matrix, each sweep ($$n(n-1)/2$$ rotations) reduces the sum of squares of off-diagonal elements by a factor dependent on the matrix properties.

### Krylov Subspace Methods

For very large sparse matrices, Krylov subspace methods like the Arnoldi and Lanczos algorithms are preferred. These methods work by projecting the matrix onto a lower-dimensional Krylov subspace:

$$\mathcal{K}_m(A, \mathbf{v}) = \text{span}\{\mathbf{v}, A\mathbf{v}, A^2\mathbf{v}, \ldots, A^{m-1}\mathbf{v}\}$$

The Arnoldi iteration builds an orthonormal basis for this subspace and produces a Hessenberg matrix $$H_m$$ such that:

$$AV_m = V_m H_m + \beta_m\mathbf{v}_{m+1}\mathbf{e}_m^T$$

where $$V_m$$ is the matrix whose columns are the orthonormal basis vectors.

The eigenvalues of $$H_m$$ (Ritz values) approximate some eigenvalues of $$A$$, often the ones with largest magnitude. The corresponding eigenvectors (Ritz vectors) are given by $$V_m\mathbf{y}$$ where $$\mathbf{y}$$ is an eigenvector of $$H_m$$.

For symmetric matrices, the Lanczos algorithm simplifies the Arnoldi process, as $$H_m$$ becomes tridiagonal. This reduces the computation and storage requirements significantly:

$$AV_m = V_m T_m + \beta_m\mathbf{v}_{m+1}\mathbf{e}_m^T$$

where $$T_m$$ is a tridiagonal matrix.

### Divide and Conquer Approaches

For symmetric tridiagonal matrices, divide-and-conquer algorithms provide efficient solutions by:

1. Dividing the matrix into smaller submatrices
2. Computing eigenvalues and eigenvectors of these subproblems
3. Merging the results to obtain solutions for the original problem

The merging step requires solving a secular equation of the form:

$$f(\lambda) = 1 + \sum_{i=1}^{n} \frac{\rho_i^2}{\delta_i - \lambda} = 0$$

where $$\delta_i$$ are the eigenvalues from subproblems and $$\rho_i$$ are derived from the rank-one update that combines the subproblems.

This approach achieves $$O(n^2)$$ complexity and excellent parallelizability.

### Numerical Considerations

Several practical considerations affect eigenvalue calculations:

1. **Conditioning**: The sensitivity of eigenvalues to perturbations is measured by the condition number. For a simple eigenvalue $$\lambda$$ with right eigenvector $$\mathbf{x}$$ and left eigenvector $$\mathbf{y}$$, the condition number is:

   $$\kappa(\lambda) = \frac{|\mathbf{y}^T\mathbf{x}|}{|\mathbf{y}||\mathbf{x}|}$$

   A large condition number indicates high sensitivity.

2. **Balancing**: Scaling the matrix to reduce its norm can improve numerical stability:

   $$P^{-1}AP = B$$

   where $$P$$ is a diagonal matrix chosen to minimize $$\|B\|_F$$.

3. **Deflation**: Once an eigenvalue-eigenvector pair $$(\lambda, \mathbf{x})$$ is found, we can deflate the matrix to focus on finding the remaining eigenvalues:

   $$A' = A - \lambda \mathbf{x}\mathbf{y}^T$$

   where $$\mathbf{y}$$ is the normalized left eigenvector.

4. **Stopping criteria**: Practical implementations need robust criteria to determine when an eigenvalue has converged. Common approaches include:

   $$\frac{\|A\mathbf{x} - \lambda\mathbf{x}\|}{\|A\|\|\mathbf{x}\|} < \epsilon$$

   or examining the magnitude of subdiagonal elements in the Hessenberg/tridiagonal matrix.

Modern eigenvalue libraries like LAPACK implement sophisticated versions of these algorithms with numerous optimizations for efficiency and numerical stability. For extremely large sparse matrices encountered in scientific computing, specialized packages like ARPACK leverage Krylov subspace methods with implicit restarting to efficiently compute selected eigenvalues.

## Real-World Applications of Eigenvectors and Eigenvalues

Now that we understand the theoretical aspects of eigenvectors and eigenvalues, let's explore some fascinating real-world applications where these concepts play a crucial role. We'll examine the mathematical foundations behind each application.

### Principal Component Analysis (PCA)

In data science and machine learning, PCA is a dimensionality reduction technique that helps simplify complex datasets while preserving as much information as possible.

Mathematically, given a data matrix $$X \in \mathbb{R}^{n \times p}$$ with $$n$$ observations and $$p$$ features, we:

1. Center the data by subtracting the mean: $$\tilde{X} = X - \bar{X}$$

2. Compute the covariance matrix $$\Sigma$$:
   $$\Sigma = \frac{1}{n-1} \tilde{X}^T \tilde{X}$$

3. Find the eigendecomposition of $$\Sigma$$:
   $$\Sigma = V \Lambda V^T$$
   where $$V$$ contains eigenvectors and $$\Lambda$$ contains eigenvalues $$\lambda_1 \geq \lambda_2 \geq ... \geq \lambda_p \geq 0$$

4. The principal components are given by:
   $$Y = \tilde{X}V$$

5. For dimensionality reduction, we select the first $$k$$ eigenvectors (columns of $$V$$) corresponding to the $$k$$ largest eigenvalues:
   $$Y_k = \tilde{X}V_k$$
   where $$V_k$$ consists of the first $$k$$ columns of $$V$$.

The proportion of variance explained by the first $$k$$ components is:
$$\frac{\sum_{i=1}^{k} \lambda_i}{\sum_{i=1}^{p} \lambda_i}$$

In facial recognition, eigenfaces (eigenvectors of face image datasets) capture the most distinctive facial features that help differentiate between individuals.

### Google's PageRank Algorithm

The original algorithm behind Google's search engine utilizes eigenvector centrality to rank web pages.

Let's define:
- $$n$$ = number of web pages
- $$A$$ = adjacency matrix where $$A_{ij} = 1$$ if page $$j$$ links to page $$i$$, and 0 otherwise
- $$D$$ = diagonal matrix where $$D_{jj}$$ = outdegree of page $$j$$ (number of outgoing links)

The stochastic transition matrix $$P$$ is given by:
$$P = AD^{-1}$$

However, to handle pages with no outgoing links (dangling nodes) and to ensure convergence, the PageRank matrix $$G$$ is modified with a damping factor $$\alpha$$ (typically 0.85):

$$G = \alpha P + (1-\alpha) \frac{1}{n} \mathbf{1}\mathbf{1}^T$$

where $$\mathbf{1}$$ is an $$n \times 1$$ vector of ones.

The PageRank vector $$\pi$$ is the dominant eigenvector of $$G$$:
$$G\pi = \pi$$

Equivalently, it's the solution to:
$$\pi^T = \pi^T G$$
subject to $$\sum_{i=1}^{n} \pi_i = 1$$ and $$\pi_i \geq 0$$ for all $$i$$.

This can be computed iteratively:
$$\pi^{(t+1)} = G^T \pi^{(t)}$$

The value $$\pi_i$$ represents the importance score of page $$i$$.

### Markov Chains and Steady States

For a Markov chain with $$n$$ states, we define a transition matrix $$P$$ where $$P_{ij}$$ is the probability of transitioning from state $$i$$ to state $$j$$:

$$P_{ij} = P(X_{t+1} = j | X_t = i)$$

Where $$\sum_{j=1}^{n} P_{ij} = 1$$ for all $$i$$.

The distribution after $$t$$ steps, given an initial distribution $$\mu^{(0)}$$, is:
$$\mu^{(t)} = \mu^{(0)} P^t$$

For an irreducible and aperiodic Markov chain, there exists a unique stationary distribution $$\pi$$ such that:
$$\pi P = \pi$$

This means $$\pi$$ is the left eigenvector of $$P$$ with eigenvalue 1.

The rate of convergence to this stationary distribution is governed by the second-largest eigenvalue $$\lambda_2$$ of $$P$$. The smaller $$\mid\lambda_2\mid$$ is compared to 1, the faster the convergence:

$$\mid\mu^{(t)} - \pi\mid_{TV} \leq C \cdot \mid\lambda_2\mid^t$$

where $$\mid\cdot\mid_{TV}$$ is the total variation distance and $$C$$ is a constant.

Applications include modeling customer behavior (transitioning between brands), economic systems, genetic evolution, and even text prediction algorithms.

### Vibration Analysis in Engineering

For a structure with $$n$$ degrees of freedom, the equation of motion is:

$$M\ddot{x} + C\dot{x} + Kx = F(t)$$

where:
- $$M$$ is the mass matrix
- $$C$$ is the damping matrix
- $$K$$ is the stiffness matrix
- $$x$$ is the displacement vector
- $$F(t)$$ is the external force vector

For free vibration without damping ($$C = 0, F(t) = 0$$), the equation becomes:
$$M\ddot{x} + Kx = 0$$

Assuming harmonic motion $$x(t) = \phi e^{i\omega t}$$, we get:
$$(-\omega^2 M + K)\phi = 0$$

This is a generalized eigenvalue problem. The eigenvalues $$\lambda_i = \omega_i^2$$ give the natural frequencies $$\omega_i$$ of the system, and the eigenvectors $$\phi_i$$ represent the mode shapes.

The generalized eigenvalue problem can be rewritten as:
$$K\phi_i = \lambda_i M\phi_i$$

For mass-normalized eigenvectors ($$\phi_i^T M \phi_i = 1$$), the modal matrix $$\Phi = [\phi_1, \phi_2, ..., \phi_n]$$ satisfies:
$$\Phi^T M \Phi = I$$
$$\Phi^T K \Phi = \Lambda = \text{diag}(\lambda_1, \lambda_2, ..., \lambda_n)$$

This diagonalization allows engineers to analyze complex structures as decoupled single-degree-of-freedom systems.

From the Tacoma Narrows Bridge collapse to the design of earthquake-resistant buildings, understanding these natural vibration modes through eigenvector analysis is crucial for safe engineering design.

### Quantum Mechanics

In quantum mechanics, the state of a system is described by a wave function $$\psi$$, and physical observables are represented by Hermitian operators.

For an observable $$A$$ with corresponding operator $$\hat{A}$$, the eigenvalue equation is:
$$\hat{A}\psi_n = a_n\psi_n$$

where $$a_n$$ are the eigenvalues (possible measurement outcomes) and $$\psi_n$$ are the eigenvectors (eigenstates).

For example, the time-independent Schrödinger equation is an eigenvalue problem:
$$\hat{H}\psi = E\psi$$

where $$\hat{H}$$ is the Hamiltonian operator and $$E$$ represents energy levels.

When we measure an observable $$A$$, the probability of obtaining the value $$a_n$$ is:
$$P(a_n) = |\langle \psi_n | \psi \rangle|^2$$

where $$\psi$$ is the state before measurement and $$\langle \psi_n | \psi \rangle$$ is the inner product.

After the measurement, the system collapses to the eigenstate $$\psi_n$$ corresponding to the measured eigenvalue $$a_n$$.

For the position operator $$\hat{x}$$, the eigenvalue equation is:
$$\hat{x}\psi_x = x\psi_x$$

with eigenfunction $$\psi_x(x') = \delta(x'-x)$$ (the Dirac delta function).

For the momentum operator $$\hat{p} = -i\hbar\frac{d}{dx}$$, the eigenvalue equation is:
$$\hat{p}\psi_p = p\psi_p$$

with eigenfunction $$\psi_p(x) = \frac{1}{\sqrt{2\pi\hbar}}e^{ipx/\hbar}$$.

These examples demonstrate how deeply embedded eigenvectors are in our fundamental understanding of reality itself!

These applications show why eigenvectors and eigenvalues are not just abstract mathematical concepts but powerful tools with far-reaching practical significance across countless fields. The mathematical formulations provided here give insight into how these concepts are applied in real-world scenarios.

## Footnotes

1. [3Blue 1Brown's video on Eigenvectors & Eigenvalues](https://www.youtube.com/watch?v=PFDu9oVAE-g) is a really nice video! The animations were really helpful for me while understanding these concepts.

2. [Setosa.io's blog on Eigenvectors & Eigenvalues](https://setosa.io/ev/eigenvectors-and-eigenvalues/) are also nice tool to visualize the same.

3. [Gilbert Strang's lecture on Eigenvectors & Eigenvalues](https://www.youtube.com/watch?v=DzqE7tj7eIM) give a very theoretical insight into Eigenvectors.