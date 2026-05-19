/**
 * Pondering upon Eigenvectors - PCA Interactive Visualization Script
 * High-performance HTML5 Canvas simulation of 2D Principal Component Analysis.
 * 
 * Features:
 * - Interactive scatter plot: click grid to add points, drag to move, double-click to delete.
 * - Live math: computes mean, 2x2 covariance matrix, eigenvalues, and eigenvectors in real-time.
 * - Dynamic covariance ellipse and orthogonal principal component axes.
 * - Interpolated projection animation squashing 2D data onto the 1D PC1 axis.
 * - Theme-aware styling, high-DPI canvas scaling, and fluid animations.
 */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".pca-vis-container");
    if (!container) return; // Exit if not on the correct page

    const canvas = document.getElementById("pcaCanvas");
    const ctx = canvas.getContext("2d");

    // UI Controls
    const sliderProj = document.getElementById("sliderProj");
    const valProj = document.getElementById("valProj");
    const animBtn = document.getElementById("animProjBtn");
    const clearBtn = document.getElementById("clearPcaBtn");

    // Matrix cells
    const cellXX = document.getElementById("cellXX");
    const cellXY = document.getElementById("cellXY");
    const cellYX = document.getElementById("cellYX");
    const cellYY = document.getElementById("cellYY");

    // Stats
    const statMean = document.getElementById("statMean");
    const statVar1 = document.getElementById("statVar1");
    const statVar2 = document.getElementById("statVar2");
    const statPca1 = document.getElementById("statPca1");
    const statPca2 = document.getElementById("statPca2");
    const statRatio = document.getElementById("statRatio");

    const tooltip = document.getElementById("pcaTooltip");

    // Presets
    const presets = {
      linear: [
        {x: -2.2, y: -1.6}, {x: -1.7, y: -1.1}, {x: -1.2, y: -0.9}, {x: -0.8, y: -0.4}, 
        {x: -0.3, y: -0.1}, {x: 0.1, y: 0.2}, {x: 0.6, y: 0.5}, {x: 1.1, y: 0.8}, 
        {x: 1.6, y: 1.2}, {x: 2.1, y: 1.5}, {x: -0.6, y: -0.9}, {x: 0.5, y: 0.9}, 
        {x: -1.3, y: -0.7}, {x: 1.4, y: 0.8}, {x: -0.1, y: -0.4}, {x: 0.2, y: 0.4}
      ],
      circular: [
        {x: 0.0, y: 1.8}, {x: 1.3, y: 1.3}, {x: 1.8, y: 0.0}, {x: 1.3, y: -1.3}, 
        {x: 0.0, y: -1.8}, {x: -1.3, y: -1.3}, {x: -1.8, y: 0.0}, {x: -1.3, y: 1.3}, 
        {x: 0.6, y: 0.6}, {x: -0.6, y: 0.6}, {x: -0.6, y: -0.6}, {x: 0.6, y: -0.6}, 
        {x: 0.1, y: -0.1}, {x: -0.2, y: 0.1}, {x: 0.2, y: -0.2}
      ],
      outliers: [
        {x: -1.0, y: 0.2}, {x: -0.8, y: -0.1}, {x: -1.1, y: 0.1}, {x: -0.9, y: 0.3}, 
        {x: -1.2, y: 0.0}, {x: -1.0, y: -0.2}, {x: -1.1, y: -0.1}, {x: -0.7, y: 0.0}, 
        {x: -0.9, y: -0.1}, {x: -1.0, y: 0.1}, {x: 2.8, y: -2.4}
      ]
    };

    // State Variables
    let points = []; // Array of {x, y} in grid coordinates
    let activeDragIdx = -1;
    let isMouseOverCanvas = false;

    // Projection animation state
    let projectionStrength = 0.0; // 0.0 to 1.0
    let isAnimating = false;
    let animDirection = 1; // 1 = projecting, -1 = returning
    let animFrameId = null;

    // Coordinate conversion variables
    const gridRange = 4.0; // Show from -4 to +4 on both axes
    let scaleX, scaleY; // Pixels per unit
    let centerX, centerY; // Canvas origin coordinates

    // Theme colors
    let colors = {};

    function updateColors() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      colors = {
        bg: isDark ? "#0c0e14" : "#f8f9fa",
        gridLine: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
        axis: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)",
        point: isDark ? "#fb6340" : "#fb6340", // High contrast orange
        pointGlow: isDark ? "rgba(251, 99, 64, 0.4)" : "rgba(251, 99, 64, 0.25)",
        projectedPoint: isDark ? "#11cdef" : "#11cdef", // Cyan
        mean: isDark ? "#ffffff" : "#1a1a1a",
        pc1: isDark ? "#11cdef" : "#0099b8", // Cyan/Teal
        pc2: isDark ? "#2dce89" : "#2dce89", // Green
        ellipse: isDark ? "rgba(124, 58, 237, 0.2)" : "rgba(94, 114, 228, 0.15)",
        ellipseBorder: isDark ? "rgba(124, 58, 237, 0.5)" : "rgba(94, 114, 228, 0.4)",
        projLine: isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.18)",
        text: isDark ? "#e8eaed" : "#1a1a1a",
        textSecondary: isDark ? "#9aa0a6" : "#6c757d"
      };
    }

    // Set high-DPI canvas scaling
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Recalculate scale ratios
      scaleX = rect.width / (gridRange * 2);
      scaleY = rect.height / (gridRange * 2);
      centerX = rect.width / 2;
      centerY = rect.height / 2;

      draw();
    }

    // Projections
    function toCanvasCoords(gx, gy) {
      return {
        x: centerX + gx * scaleX,
        y: centerY - gy * scaleY
      };
    }

    function toGridCoords(cx, cy) {
      return {
        x: (cx - centerX) / scaleX,
        y: (centerY - cy) / scaleY
      };
    }

    // Real-Time PCA Math Solver
    function solvePCA() {
      const N = points.length;
      if (N === 0) {
        return {
          meanX: 0, meanY: 0,
          sXX: 0, sXY: 0, sYY: 0,
          lambda1: 0, lambda2: 0,
          v1: { x: 1, y: 0 },
          v2: { x: 0, y: 1 },
          ratio: 0
        };
      }

      // 1. Calculate centroid (Mean)
      let sumX = 0, sumY = 0;
      for (let i = 0; i < N; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
      }
      const meanX = sumX / N;
      const meanY = sumY / N;

      // 2. Compute symmetric Covariance Matrix Elements
      let sXX = 0, sYY = 0, sXY = 0;
      if (N > 1) {
        for (let i = 0; i < N; i++) {
          const dx = points[i].x - meanX;
          const dy = points[i].y - meanY;
          sXX += dx * dx;
          sYY += dy * dy;
          sXY += dx * dy;
        }
        sXX /= (N - 1);
        sYY /= (N - 1);
        sXY /= (N - 1);
      }

      // 3. Eigendecomposition of 2x2 symmetric matrix
      const trace = sXX + sYY;
      const det = sXX * sYY - sXY * sXY;
      // Discriminant = (sXX - sYY)^2 + 4 * sXY^2 (always >= 0 for symmetric matrices)
      const discriminant = Math.max(0, (sXX - sYY) * (sXX - sYY) + 4 * sXY * sXY);
      const sqrtDisc = Math.sqrt(discriminant);

      let lambda1 = (trace + sqrtDisc) / 2;
      let lambda2 = (trace - sqrtDisc) / 2;

      let v1 = { x: 1, y: 0 };
      let v2 = { x: 0, y: 1 };

      if (N > 1) {
        if (Math.abs(sXY) > 1e-6) {
          // General case for non-diagonal symmetric matrices
          v1.x = sXY;
          v1.y = lambda1 - sXX;
          const len1 = Math.hypot(v1.x, v1.y);
          v1.x /= len1;
          v1.y /= len1;

          // Second eigenvector is orthogonal to the first
          v2.x = -v1.y;
          v2.y = v1.x;
        } else {
          // Diagonal matrix
          if (sXX >= sYY) {
            v1 = { x: 1, y: 0 };
            v2 = { x: 0, y: 1 };
          } else {
            v1 = { x: 0, y: 1 };
            v2 = { x: -1, y: 0 };
          }
        }
      }

      // Ensure v1 points generally rightward/upward for rendering consistency
      if (v1.x < 0 || (v1.x === 0 && v1.y < 0)) {
        v1.x = -v1.x;
        v1.y = -v1.y;
      }
      if (v2.x < 0 || (v2.x === 0 && v2.y < 0)) {
        v2.x = -v2.x;
        v2.y = -v2.y;
      }

      const totalVar = lambda1 + lambda2;
      const ratio = totalVar > 1e-6 ? (lambda1 / totalVar) * 100 : 0;

      return { meanX, meanY, sXX, sXY, sYY, lambda1, lambda2, v1, v2, ratio };
    }

    // Live UI updates
    function updateUIValues() {
      const stats = solvePCA();

      // Readouts for Covariance Matrix cells
      cellXX.textContent = stats.sXX.toFixed(2);
      cellXY.textContent = stats.sXY.toFixed(2);
      cellYX.textContent = stats.sXY.toFixed(2);
      cellYY.textContent = stats.sYY.toFixed(2);

      // Centroid
      statMean.textContent = `μ = (${stats.meanX.toFixed(2)}, ${stats.meanY.toFixed(2)})`;

      // Eigenvalues / Variances
      statVar1.textContent = stats.lambda1.toFixed(3);
      statVar2.textContent = stats.lambda2.toFixed(3);

      // Eigenvectors / Principal Components
      statPca1.textContent = `[${stats.v1.x.toFixed(2)}, ${stats.v1.y.toFixed(2)}]`;
      statPca2.textContent = `[${stats.v2.x.toFixed(2)}, ${stats.v2.y.toFixed(2)}]`;

      // Variance ratio badge
      statRatio.textContent = `${stats.ratio.toFixed(1)}%`;
    }

    // Dynamic rendering
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateColors();

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Draw background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      // 1. Draw grid lines
      drawGrid(w, h);

      // Solve PCA for active configuration
      const stats = solvePCA();

      // 2. Draw covariance ellipse
      if (points.length >= 2 && stats.lambda1 > 1e-4) {
        drawCovarianceEllipse(stats);
      }

      // 3. Draw projection guide lines & projected coordinates
      if (points.length > 0) {
        drawProjections(stats);
      }

      // 4. Draw PCA arrows starting from mean
      if (points.length >= 2) {
        drawPcaAxes(stats);
      }

      // 5. Draw Mean Centroid
      if (points.length > 0) {
        drawMeanCenter(stats);
      }

      // 6. Draw original points as glowing dots
      drawPoints();
    }

    function drawGrid(w, h) {
      ctx.save();
      ctx.strokeStyle = colors.gridLine;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let xGrid = -Math.floor(gridRange); xGrid <= gridRange; xGrid++) {
        if (xGrid === 0) continue;
        const p1 = toCanvasCoords(xGrid, -gridRange);
        const p2 = toCanvasCoords(xGrid, gridRange);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Horizontal lines
      for (let yGrid = -Math.floor(gridRange); yGrid <= gridRange; yGrid++) {
        if (yGrid === 0) continue;
        const p1 = toCanvasCoords(-gridRange, yGrid);
        const p2 = toCanvasCoords(gridRange, yGrid);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Core Axes
      ctx.strokeStyle = colors.axis;
      ctx.lineWidth = 2;

      const left = toCanvasCoords(-gridRange, 0);
      const right = toCanvasCoords(gridRange, 0);
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();

      const bottom = toCanvasCoords(0, -gridRange);
      const top = toCanvasCoords(0, gridRange);
      ctx.beginPath();
      ctx.moveTo(bottom.x, bottom.y);
      ctx.lineTo(top.x, top.y);
      ctx.stroke();

      ctx.restore();
    }

    function drawCovarianceEllipse(stats) {
      // semi-major axis = 2 * std_dev1 = 2 * sqrt(lambda1)
      // semi-minor axis = 2 * std_dev2 = 2 * sqrt(lambda2)
      const a = 2 * Math.sqrt(stats.lambda1);
      const b = 2 * Math.sqrt(stats.lambda2);
      const angle = Math.atan2(stats.v1.y, stats.v1.x);

      const center = toCanvasCoords(stats.meanX, stats.meanY);

      ctx.save();
      ctx.fillStyle = colors.ellipse;
      ctx.strokeStyle = colors.ellipseBorder;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.ellipse(
        center.x, center.y, 
        a * scaleX, b * scaleY, 
        -angle, // Negated since canvas y-axis points down
        0, Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    function drawPcaAxes(stats) {
      // Lengths are double the standard deviation along each principal component direction
      const len1 = 2 * Math.sqrt(stats.lambda1);
      const len2 = 2 * Math.sqrt(stats.lambda2);

      // Draw PC1 arrow (scaled by double std_dev)
      if (len1 > 0.05) {
        drawArrow(
          stats.meanX, stats.meanY,
          stats.meanX + stats.v1.x * len1, stats.meanY + stats.v1.y * len1,
          colors.pc1, 4, "PC1"
        );
      }

      // Draw PC2 arrow (scaled by double std_dev)
      if (len2 > 0.05) {
        drawArrow(
          stats.meanX, stats.meanY,
          stats.meanX + stats.v2.x * len2, stats.meanY + stats.v2.y * len2,
          colors.pc2, 2.5, "PC2"
        );
      }
    }

    function drawMeanCenter(stats) {
      const center = toCanvasCoords(stats.meanX, stats.meanY);
      ctx.save();
      ctx.fillStyle = colors.mean;
      ctx.strokeStyle = colors.bg;
      ctx.lineWidth = 2.5;

      // Draw highlighted crosshair or dot
      ctx.beginPath();
      ctx.arc(center.x, center.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner plus sign
      ctx.strokeStyle = colors.bg;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(center.x - 4, center.y);
      ctx.lineTo(center.x + 4, center.y);
      ctx.moveTo(center.x, center.y - 4);
      ctx.lineTo(center.x, center.y + 4);
      ctx.stroke();

      ctx.fillStyle = colors.text;
      ctx.font = "bold 9px sans-serif";
      ctx.fillText("Mean (μ)", center.x + 10, center.y + 3);

      ctx.restore();
    }

    function drawPoints() {
      // Loop over points and render them
      for (let i = 0; i < points.length; i++) {
        // Calculate rendering position based on the active projection strength
        const pt = points[i];
        const stats = solvePCA();

        // Centered vector
        const cx = pt.x - stats.meanX;
        const cy = pt.y - stats.meanY;

        // Dot product with PC1 eigenvector (v1)
        const dot = cx * stats.v1.x + cy * stats.v1.y;

        // Projected coordinate in original space
        const projX = stats.meanX + dot * stats.v1.x;
        const projY = stats.meanY + dot * stats.v1.y;

        // Interpolate coordinate
        const rx = (1 - projectionStrength) * pt.x + projectionStrength * projX;
        const ry = (1 - projectionStrength) * pt.y + projectionStrength * projY;

        const canvasPos = toCanvasCoords(rx, ry);

        ctx.save();
        // Outer glowing shadow
        ctx.fillStyle = colors.pointGlow;
        ctx.beginPath();
        ctx.arc(canvasPos.x, canvasPos.y, 9, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        // Transition core color to cyan when projected
        ctx.fillStyle = blendColors(colors.point, colors.projectedPoint, projectionStrength);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(canvasPos.x, canvasPos.y, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawProjections(stats) {
      if (projectionStrength <= 1e-4) return;

      ctx.save();
      ctx.strokeStyle = colors.projLine;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 4]);

      // Faint representation of the infinite PC1 axis line
      if (points.length >= 2 && stats.lambda1 > 1e-4) {
        ctx.strokeStyle = colors.pc1 + "44"; // Adding transparency
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        
        const dist = gridRange * 1.5;
        const p1 = toCanvasCoords(stats.meanX - stats.v1.x * dist, stats.meanY - stats.v1.y * dist);
        const p2 = toCanvasCoords(stats.meanX + stats.v1.x * dist, stats.meanY + stats.v1.y * dist);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      ctx.strokeStyle = colors.projLine;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);

      // Draw connecting lines from original point to projected landing
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const cx = pt.x - stats.meanX;
        const cy = pt.y - stats.meanY;
        const dot = cx * stats.v1.x + cy * stats.v1.y;

        const projX = stats.meanX + dot * stats.v1.x;
        const projY = stats.meanY + dot * stats.v1.y;

        const pStart = toCanvasCoords(pt.x, pt.y);
        const pEnd = toCanvasCoords(projX, projY);

        ctx.globalAlpha = projectionStrength * 0.8; // Fades in as we project
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Helper functions
    function drawArrow(startX, startY, endX, endY, color, width = 3, label = "") {
      const start = toCanvasCoords(startX, startY);
      const end = toCanvasCoords(endX, endY);

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);

      if (length < 5) return;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      const arrowSize = width * 3.5;
      const angle = Math.atan2(dy, dx);

      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - arrowSize * Math.cos(angle - Math.PI / 6),
        end.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        end.x - arrowSize * Math.cos(angle + Math.PI / 6),
        end.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      if (label) {
        ctx.font = "bold 12px sans-serif";
        ctx.shadowColor = colors.bg;
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(label, end.x + 8 * Math.cos(angle), end.y + 8 * Math.sin(angle) + 4);
      }

      ctx.restore();
    }

    // Blend standard hex colors
    function blendColors(color1, color2, percentage) {
      // Standard linear blending
      const r1 = parseInt(color1.substring(1, 3), 16);
      const g1 = parseInt(color1.substring(3, 5), 16);
      const b1 = parseInt(color1.substring(5, 7), 16);

      const r2 = parseInt(color2.substring(1, 3), 16);
      const g2 = parseInt(color2.substring(3, 5), 16);
      const b2 = parseInt(color2.substring(5, 7), 16);

      const r = Math.round((1 - percentage) * r1 + percentage * r2);
      const g = Math.round((1 - percentage) * g1 + percentage * g2);
      const b = Math.round((1 - percentage) * b1 + percentage * b2);

      const rHex = r.toString(16).padStart(2, '0');
      const gHex = g.toString(16).padStart(2, '0');
      const bHex = b.toString(16).padStart(2, '0');

      return `#${rHex}${gHex}${bHex}`;
    }

    // Event handlers
    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function onPointerDown(e) {
      const pos = getMousePos(e);
      const gridPos = toGridCoords(pos.x, pos.y);

      // Check if clicking near an existing point (threshold of ~15 pixels / 0.3 grid units)
      const threshold = 0.3;
      let clickedIdx = -1;

      for (let i = 0; i < points.length; i++) {
        // Since points might be visually projected, we check collision with their active rendering position!
        // To be safe and simple, let's check distance to their active coordinate.
        const stats = solvePCA();
        const pt = points[i];
        const cx = pt.x - stats.meanX;
        const cy = pt.y - stats.meanY;
        const dot = cx * stats.v1.x + cy * stats.v1.y;
        const projX = stats.meanX + dot * stats.v1.x;
        const projY = stats.meanY + dot * stats.v1.y;

        const rx = (1 - projectionStrength) * pt.x + projectionStrength * projX;
        const ry = (1 - projectionStrength) * pt.y + projectionStrength * projY;

        const dist = Math.hypot(gridPos.x - rx, gridPos.y - ry);
        if (dist < threshold) {
          clickedIdx = i;
          break;
        }
      }

      if (clickedIdx !== -1) {
        // Selected an existing point to drag
        activeDragIdx = clickedIdx;
        e.preventDefault();
      } else {
        // Add new point at this position, but only if not projecting (to avoid confusion)
        if (projectionStrength < 0.05) {
          const limit = gridRange * 0.95;
          if (Math.abs(gridPos.x) <= limit && Math.abs(gridPos.y) <= limit) {
            points.push({ x: gridPos.x, y: gridPos.y });
            activeDragIdx = points.length - 1; // Drag immediately
            updateUIValues();
            draw();
            updateActivePreset();
          }
        }
      }
    }

    function onPointerMove(e) {
      const pos = getMousePos(e);
      const gridPos = toGridCoords(pos.x, pos.y);

      // Tooltip position coordinate readout
      if (isMouseOverCanvas) {
        tooltip.textContent = `(${gridPos.x.toFixed(2)}, ${gridPos.y.toFixed(2)})`;
      }

      if (activeDragIdx === -1) return;

      // Restrict point to visual box bounds
      const limit = gridRange * 0.95;
      gridPos.x = Math.max(-limit, Math.min(limit, gridPos.x));
      gridPos.y = Math.max(-limit, Math.min(limit, gridPos.y));

      // Drag point (only possible if projectionStrength is 0, otherwise drag is disabled/confusing)
      if (projectionStrength < 0.05) {
        points[activeDragIdx].x = gridPos.x;
        points[activeDragIdx].y = gridPos.y;
        updateUIValues();
        draw();
        updateActivePreset();
      }

      e.preventDefault();
    }

    function onPointerUp() {
      activeDragIdx = -1;
    }

    // Double-click to delete a point
    function onDoubleClick(e) {
      const pos = getMousePos(e);
      const gridPos = toGridCoords(pos.x, pos.y);
      const threshold = 0.35;

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const dist = Math.hypot(gridPos.x - pt.x, gridPos.y - pt.y);
        if (dist < threshold) {
          // Remove point
          points.splice(i, 1);
          activeDragIdx = -1;
          updateUIValues();
          draw();
          updateActivePreset();
          break;
        }
      }
    }

    // Wire up sliders
    sliderProj.addEventListener("input", () => {
      // Pause automatic animations if manual slide is touched
      if (isAnimating) {
        pauseAnimation();
      }
      projectionStrength = parseFloat(sliderProj.value);
      valProj.textContent = `${Math.round(projectionStrength * 100)}%`;
      draw();
    });

    // Play/Pause Projection Animation
    animBtn.addEventListener("click", () => {
      if (isAnimating) {
        pauseAnimation();
      } else {
        startAnimation();
      }
    });

    function startAnimation() {
      isAnimating = true;
      animBtn.innerHTML = `⏸ Pause Projection`;
      
      // Determine which direction to animate
      if (projectionStrength >= 0.98) {
        animDirection = -1; // Fade back
      } else if (projectionStrength <= 0.02) {
        animDirection = 1; // Project forward
      }

      animateLoop();
    }

    function pauseAnimation() {
      isAnimating = false;
      animBtn.innerHTML = `▶ Animate Projection`;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }

    function animateLoop() {
      if (!isAnimating) return;

      projectionStrength += animDirection * 0.02; // Step size

      if (projectionStrength >= 1.0) {
        projectionStrength = 1.0;
        pauseAnimation();
      } else if (projectionStrength <= 0.0) {
        projectionStrength = 0.0;
        pauseAnimation();
      }

      sliderProj.value = projectionStrength;
      valProj.textContent = `${Math.round(projectionStrength * 100)}%`;
      draw();

      animFrameId = requestAnimationFrame(animateLoop);
    }

    // Load presets
    document.querySelectorAll(".pca-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-preset");
        if (presets[type]) {
          points = JSON.parse(JSON.stringify(presets[type])); // Deep copy
          projectionStrength = 0.0;
          sliderProj.value = 0.0;
          valProj.textContent = "0%";
          pauseAnimation();
          updateUIValues();
          draw();

          document.querySelectorAll(".pca-preset-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        }
      });
    });

    function updateActivePreset() {
      let matched = false;
      document.querySelectorAll(".pca-preset-btn").forEach(btn => {
        const type = btn.getAttribute("data-preset");
        const presetPoints = presets[type];
        if (presetPoints && points.length === presetPoints.length) {
          // Compare points
          let match = true;
          for (let i = 0; i < points.length; i++) {
            if (Math.abs(points[i].x - presetPoints[i].x) > 0.02 || 
                Math.abs(points[i].y - presetPoints[i].y) > 0.02) {
              match = false;
              break;
            }
          }
          if (match) {
            btn.classList.add("active");
            matched = true;
          } else {
            btn.classList.remove("active");
          }
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // Clear Button
    clearBtn.addEventListener("click", () => {
      points = [];
      projectionStrength = 0.0;
      sliderProj.value = 0.0;
      valProj.textContent = "0%";
      pauseAnimation();
      updateUIValues();
      draw();
      document.querySelectorAll(".pca-preset-btn").forEach(b => b.classList.remove("active"));
    });

    // Attach core listeners
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("dblclick", onDoubleClick);

    canvas.addEventListener("pointerenter", () => {
      isMouseOverCanvas = true;
      tooltip.style.display = "block";
    });
    canvas.addEventListener("pointerleave", () => {
      isMouseOverCanvas = false;
      tooltip.style.display = "none";
      activeDragIdx = -1;
    });

    window.addEventListener("resize", resizeCanvas);

    // Initial load: Pre-populate with the linear correlation preset
    points = JSON.parse(JSON.stringify(presets.linear));
    updateColors();
    resizeCanvas();
    updateUIValues();
    updateActivePreset();
  });
})();
