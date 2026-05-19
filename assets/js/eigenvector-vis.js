/**
 * Pondering upon Eigenvectors - Interactive Visualization Script
 * High-performance HTML5 Canvas simulation of 2D Linear Transformations.
 * 
 * Features:
 * - Direct drag handles for transforming basis vectors i-hat and j-hat.
 * - Draggable input vector x and real-time output vector Ax.
 * - Real-time calculation of eigenvalues and eigenvectors.
 * - Visual snapping when x aligns with an eigenvector.
 * - Presets for standard linear transformations (scaling, shearing, rotation, reflection, projection).
 * - Full touch support and theme compatibility (detecting light/dark modes).
 */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".eigen-vis-container");
    if (!container) return; // Exit if not on the correct page

    const canvas = document.getElementById("eigenCanvas");
    const ctx = canvas.getContext("2d");

    // UI Elements
    const sliderA = document.getElementById("sliderA");
    const sliderB = document.getElementById("sliderB");
    const sliderC = document.getElementById("sliderC");
    const sliderD = document.getElementById("sliderD");

    const valA = document.getElementById("valA");
    const valB = document.getElementById("valB");
    const valC = document.getElementById("valC");
    const valD = document.getElementById("valD");

    const cellA = document.getElementById("cellA");
    const cellB = document.getElementById("cellB");
    const cellC = document.getElementById("cellC");
    const cellD = document.getElementById("cellD");

    const badge = document.getElementById("eigenBadge");
    const tooltip = document.getElementById("canvasTooltip");

    // Stats elements
    const statTrace = document.getElementById("statTrace");
    const statDet = document.getElementById("statDet");
    const statEigen1 = document.getElementById("statEigen1");
    const statEigen2 = document.getElementById("statEigen2");

    // Presets
    const presets = {
      scale: [1.5, 0.0, 0.0, 0.8],
      shear: [1.0, 1.0, 0.0, 1.0],
      rotation: [0.71, -0.71, 0.71, 0.71],
      reflection: [0.0, 1.0, 1.0, 0.0],
      projection: [0.5, 0.5, 0.5, 0.5]
    };

    // State Variables
    // Matrix A = [[a, b], [c, d]]
    let a = 1.5;
    let b = 0.5;
    let c = 0.2;
    let d = 1.0;

    // Draggable custom vector x = [x, y]
    let xVec = 2.0;
    let yVec = 1.0;

    // Interaction State
    let activeDrag = null; // 'iHat', 'jHat', 'xVec'
    let isMouseOverCanvas = false;

    // Coordinate conversion variables
    const gridRange = 4.0; // Show from -4 to +4 on both axes
    let scaleX, scaleY; // Pixels per unit
    let centerX, centerY; // Canvas origin coordinates

    // Snapping configuration
    const SNAP_ANGLE_THRESHOLD = 0.04; // ~2.3 degrees in sine

    // Theme detection (Light / Dark Mode colors)
    let colors = {};

    function updateColors() {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      colors = {
        bg: isDark ? "#0c0e14" : "#f8f9fa",
        gridLine: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
        axis: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)",
        transGrid: isDark ? "rgba(124, 58, 237, 0.08)" : "rgba(94, 114, 228, 0.06)",
        transGridLine: isDark ? "rgba(124, 58, 237, 0.15)" : "rgba(94, 114, 228, 0.12)",
        iHat: "#f5365c", // Coral red
        jHat: "#2dce89", // Emerald green
        xVec: "#fb6340", // Orange
        axVec: "#11cdef", // Cyan
        eigenLine: isDark ? "rgba(251, 175, 40, 0.45)" : "rgba(216, 147, 10, 0.5)",
        text: isDark ? "#e8eaed" : "#1a1a1a",
        textSecondary: isDark ? "#9aa0a6" : "#6c757d"
      };
    }

    // Set high-DPI canvas scaling for razor-sharp rendering
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

    // Mathematical coordinate projections
    function toCanvasCoords(gx, gy) {
      return {
        x: centerX + gx * scaleX,
        y: centerY - gy * scaleY // Canvas y-axis points down
      };
    }

    function toGridCoords(cx, cy) {
      return {
        x: (cx - centerX) / scaleX,
        y: (centerY - cy) / scaleY
      };
    }

    // Eigenvalue & Eigenvector Solver
    function solveEigen() {
      const trace = a + d;
      const det = a * d - b * c;
      const discriminant = trace * trace - 4 * det;

      let lambda1 = null;
      let lambda2 = null;
      let v1 = null;
      let v2 = null;

      if (discriminant >= 0) {
        // Real eigenvalues
        lambda1 = (trace + Math.sqrt(discriminant)) / 2;
        lambda2 = (trace - Math.sqrt(discriminant)) / 2;

        // Calculate eigenvector for lambda1
        v1 = findEigenvector(lambda1);
        // Calculate eigenvector for lambda2
        v2 = findEigenvector(lambda2);
      }

      return { trace, det, lambda1, lambda2, v1, v2 };
    }

    function findEigenvector(lambda) {
      // Solves (A - lambda*I) v = 0
      const a_prime = a - lambda;
      const b_prime = b;
      const c_prime = c;
      const d_prime = d - lambda;

      let vx, vy;

      if (Math.abs(b_prime) > 1e-5) {
        // [a_prime, b_prime] * [vx, vy]^T = 0 => vx = -b_prime, vy = a_prime
        vx = -b_prime;
        vy = a_prime;
      } else if (Math.abs(c_prime) > 1e-5) {
        // [c_prime, d_prime] * [vx, vy]^T = 0 => vx = d_prime, vy = -c_prime
        vx = d_prime;
        vy = -c_prime;
      } else {
        // Diagonal matrix or zero blocks
        if (Math.abs(a_prime) < 1e-5) {
          vx = 1.0;
          vy = 0.0;
        } else if (Math.abs(d_prime) < 1e-5) {
          vx = 0.0;
          vy = 1.0;
        } else {
          // Fallback
          vx = 1.0;
          vy = 0.0;
        }
      }

      // Normalize eigenvector
      const len = Math.hypot(vx, vy);
      if (len > 0) {
        vx /= len;
        vy /= len;
      }

      return { x: vx, y: vy };
    }

    // Dynamic Updates
    function updateUIValues() {
      // Set sliders
      sliderA.value = a;
      sliderB.value = b;
      sliderC.value = c;
      sliderD.value = d;

      // Set text labels
      valA.textContent = a.toFixed(1);
      valB.textContent = b.toFixed(1);
      valC.textContent = c.toFixed(1);
      valD.textContent = d.toFixed(1);

      // Set matrix cells
      cellA.value = a.toFixed(2);
      cellB.value = b.toFixed(2);
      cellC.value = c.toFixed(2);
      cellD.value = d.toFixed(2);

      // Update statistics
      const stats = solveEigen();
      statTrace.textContent = stats.trace.toFixed(2);
      statDet.textContent = stats.det.toFixed(2);

      if (stats.lambda1 !== null) {
        statEigen1.textContent = `λ₁ = ${stats.lambda1.toFixed(2)} (vector: [${stats.v1.x.toFixed(2)}, ${stats.v1.y.toFixed(2)}])`;
        statEigen2.textContent = `λ₂ = ${stats.lambda2.toFixed(2)} (vector: [${stats.v2.x.toFixed(2)}, ${stats.v2.y.toFixed(2)}])`;
      } else {
        statEigen1.textContent = "Complex Conjugate";
        statEigen2.textContent = "Complex Conjugate";
      }

      // Check alignment snapping with x vector
      checkAlignment(stats);
    }

    function checkAlignment(stats) {
      if (stats.lambda1 === null) {
        badge.classList.remove("show");
        return;
      }

      const xLen = Math.hypot(xVec, yVec);
      if (xLen < 0.1) {
        badge.classList.remove("show");
        return;
      }

      const ux = xVec / xLen;
      const uy = yVec / xLen;

      let aligned = false;
      let alignedLambda = 0;

      // Check eigenvector 1
      const crossProduct1 = Math.abs(ux * stats.v1.y - uy * stats.v1.x);
      if (crossProduct1 < SNAP_ANGLE_THRESHOLD) {
        aligned = true;
        alignedLambda = stats.lambda1;
        if (activeDrag === "xVec") {
          // Snap vector x to the exact eigenvector line!
          const projection = xVec * stats.v1.x + yVec * stats.v1.y;
          xVec = stats.v1.x * projection;
          yVec = stats.v1.y * projection;
        }
      }

      // Check eigenvector 2
      const crossProduct2 = Math.abs(ux * stats.v2.y - uy * stats.v2.x);
      if (!aligned && crossProduct2 < SNAP_ANGLE_THRESHOLD) {
        aligned = true;
        alignedLambda = stats.lambda2;
        if (activeDrag === "xVec") {
          // Snap
          const projection = xVec * stats.v2.x + yVec * stats.v2.y;
          xVec = stats.v2.x * projection;
          yVec = stats.v2.y * projection;
        }
      }

      if (aligned) {
        badge.textContent = `⚡ Aligned with Eigenvector! Scale factor λ = ${alignedLambda.toFixed(2)}`;
        badge.classList.add("show");
      } else {
        badge.classList.remove("show");
      }
    }

    // Event handlers for inputs
    function onSliderChange() {
      a = parseFloat(sliderA.value);
      b = parseFloat(sliderB.value);
      c = parseFloat(sliderC.value);
      d = parseFloat(sliderD.value);
      updateUIValues();
      draw();
      updateActivePreset();
    }

    function onCellChange(e) {
      const val = parseFloat(e.target.value);
      if (isNaN(val)) return;

      if (e.target === cellA) a = val;
      if (e.target === cellB) b = val;
      if (e.target === cellC) c = val;
      if (e.target === cellD) d = val;

      updateUIValues();
      draw();
      updateActivePreset();
    }

    // Set presets
    document.querySelectorAll(".eigen-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-preset");
        const vals = presets[type];
        if (vals) {
          a = vals[0];
          b = vals[1];
          c = vals[2];
          d = vals[3];
          updateUIValues();
          draw();

          document.querySelectorAll(".eigen-preset-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        }
      });
    });

    function updateActivePreset() {
      let matched = false;
      document.querySelectorAll(".eigen-preset-btn").forEach(btn => {
        const type = btn.getAttribute("data-preset");
        const vals = presets[type];
        if (vals && Math.abs(a - vals[0]) < 0.05 && Math.abs(b - vals[1]) < 0.05 && 
                    Math.abs(c - vals[2]) < 0.05 && Math.abs(d - vals[3]) < 0.05) {
          btn.classList.add("active");
          matched = true;
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // Drawing functions
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateColors();

      // Get dimensions
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Draw background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, w, h);

      // 1. Draw Transformed Grid Lines (warped background coordinate system)
      drawTransformedGrid(w, h);

      // 2. Draw Original Cartesian Grid (Faint)
      drawOriginalGrid(w, h);

      // 3. Draw Eigenvector Dotted Lines
      drawEigenvectorLines(w, h);

      // 4. Draw basis vectors
      // Transformed i-hat = [a, c]^T
      // Transformed j-hat = [b, d]^T
      drawArrow(0, 0, a, c, colors.iHat, 3, "î'");
      drawArrow(0, 0, b, d, colors.jHat, 3, "ĵ'");

      // 5. Draw input vector x and its output Ax
      const ax = a * xVec + b * yVec;
      const ay = c * xVec + d * yVec;

      drawArrow(0, 0, xVec, yVec, colors.xVec, 4, "x");
      drawArrow(0, 0, ax, ay, colors.axVec, 4, "Ax");

      // Draw drag handle indicator circles
      drawHandle(a, c, colors.iHat);
      drawHandle(b, d, colors.jHat);
      drawHandle(xVec, yVec, colors.xVec);
    }

    function drawOriginalGrid(w, h) {
      ctx.save();
      ctx.strokeStyle = colors.gridLine;
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let xGrid = -Math.floor(gridRange); xGrid <= gridRange; xGrid++) {
        if (xGrid === 0) continue;
        const p1 = toCanvasCoords(xGrid, -gridRange);
        const p2 = toCanvasCoords(xGrid, gridRange);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let yGrid = -Math.floor(gridRange); yGrid <= gridRange; yGrid++) {
        if (yGrid === 0) continue;
        const p1 = toCanvasCoords(-gridRange, yGrid);
        const p2 = toCanvasCoords(gridRange, yGrid);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Main Axes
      ctx.strokeStyle = colors.axis;
      ctx.lineWidth = 2;

      // X-Axis
      const left = toCanvasCoords(-gridRange, 0);
      const right = toCanvasCoords(gridRange, 0);
      ctx.beginPath();
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(right.x, right.y);
      ctx.stroke();

      // Y-Axis
      const bottom = toCanvasCoords(0, -gridRange);
      const top = toCanvasCoords(0, gridRange);
      ctx.beginPath();
      ctx.moveTo(bottom.x, bottom.y);
      ctx.lineTo(top.x, top.y);
      ctx.stroke();

      ctx.restore();
    }

    function drawTransformedGrid(w, h) {
      ctx.save();
      ctx.strokeStyle = colors.transGridLine;
      ctx.lineWidth = 1.2;

      // We draw the grid of the transformed space.
      // A line from (x, -4) to (x, 4) in the original grid transforms under A
      // to a line between A*[x, -4]^T and A*[x, 4]^T.
      // Since it is a linear transformation, straight grid lines remain straight!

      for (let gridCoord = -Math.floor(gridRange); gridCoord <= gridRange; gridCoord++) {
        // Vertical grid lines (constant x)
        // x-component of line ends is gridCoord, y-component goes from -gridRange to gridRange
        const bottomTrans = transformVector(gridCoord, -gridRange);
        const topTrans = transformVector(gridCoord, gridRange);

        const p1 = toCanvasCoords(bottomTrans.x, bottomTrans.y);
        const p2 = toCanvasCoords(topTrans.x, topTrans.y);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Horizontal grid lines (constant y)
        const leftTrans = transformVector(-gridRange, gridCoord);
        const rightTrans = transformVector(gridRange, gridCoord);

        const p3 = toCanvasCoords(leftTrans.x, leftTrans.y);
        const p4 = toCanvasCoords(rightTrans.x, rightTrans.y);

        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      ctx.restore();
    }

    function transformVector(vx, vy) {
      return {
        x: a * vx + b * vy,
        y: c * vx + d * vy
      };
    }

    function drawEigenvectorLines(w, h) {
      const stats = solveEigen();
      if (stats.lambda1 === null) return; // Complex eigenvectors not drawn

      ctx.save();
      ctx.strokeStyle = colors.eigenLine;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);

      // Helper to draw infinite line in vector direction
      function drawInfiniteLine(v, label) {
        if (Math.hypot(v.x, v.y) < 1e-4) return;

        // Find boundary intersections
        const maxDist = gridRange * 1.5;
        const p1 = toCanvasCoords(-v.x * maxDist, -v.y * maxDist);
        const p2 = toCanvasCoords(v.x * maxDist, v.y * maxDist);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Add small label text on the line near boundary
        const labelPos = toCanvasCoords(v.x * 3.3, v.y * 3.3);
        ctx.fillStyle = colors.eigenLine;
        ctx.font = "bold 9px monospace";
        ctx.fillText(label, labelPos.x + 8, labelPos.y - 4);
      }

      drawInfiniteLine(stats.v1, "E₁");
      drawInfiniteLine(stats.v2, "E₂");

      ctx.restore();
    }

    function drawArrow(startX, startY, endX, endY, color, width = 3, label = "") {
      const start = toCanvasCoords(startX, startY);
      const end = toCanvasCoords(endX, endY);

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);

      if (length < 5) return; // Don't draw tiny arrows

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";

      // Draw main shaft
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw arrowhead
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

      // Draw text label near arrow head
      if (label) {
        ctx.font = "bold 13px sans-serif";
        ctx.shadowColor = colors.bg;
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText(label, end.x + 8 * Math.cos(angle), end.y + 8 * Math.sin(angle) + 4);
      }

      ctx.restore();
    }

    function drawHandle(gridX, gridY, color) {
      const pos = toCanvasCoords(gridX, gridY);
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = colors.bg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Interactive Drag Mechanics
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

      // Check distance in grid units
      const d_iHat = Math.hypot(gridPos.x - a, gridPos.y - c);
      const d_jHat = Math.hypot(gridPos.x - b, gridPos.y - d);
      const d_xVec = Math.hypot(gridPos.x - xVec, gridPos.y - yVec);

      // Threshold in grid units (~0.3 units is about 15-20 pixels)
      const threshold = 0.35;

      if (d_xVec < threshold) {
        activeDrag = "xVec";
      } else if (d_iHat < threshold) {
        activeDrag = "iHat";
      } else if (d_jHat < threshold) {
        activeDrag = "jHat";
      }

      if (activeDrag) {
        e.preventDefault(); // Stop scrolling on touch devices
      }
    }

    function onPointerMove(e) {
      const pos = getMousePos(e);
      const gridPos = toGridCoords(pos.x, pos.y);

      // Update tooltip coordinate text
      if (isMouseOverCanvas) {
        tooltip.textContent = `(${gridPos.x.toFixed(2)}, ${gridPos.y.toFixed(2)})`;
      }

      if (!activeDrag) return;

      // Constrain grid position to visual boundaries
      const limit = gridRange * 0.95;
      gridPos.x = Math.max(-limit, Math.min(limit, gridPos.x));
      gridPos.y = Math.max(-limit, Math.min(limit, gridPos.y));

      // Standard snapping to integers on grid axes
      if (Math.abs(gridPos.x - Math.round(gridPos.x)) < 0.08) {
        gridPos.x = Math.round(gridPos.x);
      }
      if (Math.abs(gridPos.y - Math.round(gridPos.y)) < 0.08) {
        gridPos.y = Math.round(gridPos.y);
      }

      if (activeDrag === "xVec") {
        xVec = gridPos.x;
        yVec = gridPos.y;
      } else if (activeDrag === "iHat") {
        a = gridPos.x;
        c = gridPos.y;
      } else if (activeDrag === "jHat") {
        b = gridPos.x;
        d = gridPos.y;
      }

      updateUIValues();
      draw();
      updateActivePreset();
      e.preventDefault();
    }

    function onPointerUp() {
      activeDrag = null;
    }

    // Attach Event Listeners
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Mouse over canvas tooltip utilities
    canvas.addEventListener("pointerenter", () => {
      isMouseOverCanvas = true;
      tooltip.style.display = "block";
    });
    canvas.addEventListener("pointerleave", () => {
      isMouseOverCanvas = false;
      tooltip.style.display = "none";
      activeDrag = null;
    });

    // Wire up slider inputs
    [sliderA, sliderB, sliderC, sliderD].forEach(slider => {
      slider.addEventListener("input", onSliderChange);
    });

    // Wire up matrix cell direct inputs
    [cellA, cellB, cellC, cellD].forEach(cell => {
      cell.addEventListener("change", onCellChange);
      cell.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          onCellChange(e);
          cell.blur();
        }
      });
    });

    // Listen for window resize
    window.addEventListener("resize", resizeCanvas);

    // Initial setup
    updateColors();
    resizeCanvas();
    updateUIValues();
    updateActivePreset();
  });
})();
