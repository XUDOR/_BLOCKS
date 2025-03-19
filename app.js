// app.js with ratio-based geometry export

// Complete set of Whites, Neutrals, and Greys
const colors = [
  // Whites
  { name: "Cardboard", hex: "#F9F9F7" },
  { name: "Estate", hex: "#FAFAFA" },
  { name: "Ice", hex: "#F9F9F7" },
  { name: "Perfumed Letter", hex: "#F7F5F5" },
  { name: "Gimlet", hex: "#F7F7F7" },
  { name: "Frost", hex: "#F7F7F5" },
  { name: "Confident", hex: "#FFFFFD" },
  { name: "Testament", hex: "#F9F9F2" },
  // Neutrals
  { name: "GoatMilk", hex: "#FFFEF5" },
  { name: "Ivory", hex: "#FCFBF2" },
  { name: "Book", hex: "#F9F7E8" },
  { name: "Document", hex: "#FFFFFA" },
  { name: "Parchment", hex: "#FFFADF" },
  { name: "Linen", hex: "#FBFBF4" },
  { name: "Milk", hex: "#FFFFE5" },
  { name: "Creamcheese", hex: "#F9F8D4" },
  // Greys
  { name: "Milan II", hex: "#DFE2CF" },
  { name: "Venician Coat", hex: "#C1BBA0" },
  { name: "Old Flag", hex: "#C1BEA4" },
  { name: "Oyster 2", hex: "#BAB5A0" },
  { name: "Oyster 3", hex: "#999B89" },
  { name: "Wooden Boat", hex: "#B8BFAC" }
];

// Container and controls
const container = document.getElementById("grid-container");
const blockCountDisplay = document.getElementById("block-count");
const showNumbersCheckbox = document.getElementById("show-numbers");

// We'll let users specify container width & height
// We assume these inputs exist in HTML for container width/height
typeCheckOrCreateContainerInputs();

function typeCheckOrCreateContainerInputs() {
  // If the user doesn't have inputs for container width/height, create them.
  // Otherwise, we assume they exist in the page.
  const existingWidth = document.getElementById("container-width");
  const existingHeight = document.getElementById("container-height");

  if (!existingWidth || !existingHeight) {
    // We'll just show how you'd create them on the fly.
    // If your HTML already has them, skip this.
    const header = document.querySelector("header");
    if (!header) return;

    // container dimension group
    const containerDimGroup = document.createElement("div");
    containerDimGroup.style.display = "flex";
    containerDimGroup.style.gap = "10px";

    // Label & input for container width
    const widthLabel = document.createElement("label");
    widthLabel.textContent = "Container Width:";
    const widthInput = document.createElement("input");
    widthInput.type = "number";
    widthInput.id = "container-width";
    widthInput.value = "1440";

    // Label & input for container height
    const heightLabel = document.createElement("label");
    heightLabel.textContent = "Container Height:";
    const heightInput = document.createElement("input");
    heightInput.type = "number";
    heightInput.id = "container-height";
    heightInput.value = "900";

    containerDimGroup.appendChild(widthLabel);
    containerDimGroup.appendChild(widthInput);
    containerDimGroup.appendChild(heightLabel);
    containerDimGroup.appendChild(heightInput);

    // Insert at top of the header (or wherever you want)
    header.insertBefore(containerDimGroup, header.firstChild);
  }
}

// Global user controls
let userMinSize = 100;
let userMaxDepth = 3;
let blockCount = 0;

// For ratio-based approach:
// We'll store the baseWidth and baseHeight so we can compute ratios.
let baseWidth = 0;
let baseHeight = 0;

// We'll store tile info (with ratio-based geometry) for export
let layoutData = [];

// Shuffle function
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateColorVariations(color) {
  return [
    color.hex,
    shadeColor(color.hex, -10),
    shadeColor(color.hex, 10)
  ];
}

function shadeColor(color, percent) {
  let num = parseInt(color.slice(1), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00ff) + amt;
  let B = (num & 0x0000ff) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

function getRandomColor() {
  const shuffledColors = shuffle(colors);
  const colorVariations = generateColorVariations(shuffledColors[0]);
  return colorVariations[Math.floor(Math.random() * colorVariations.length)];
}

// We'll define the ratio options
const ratios = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 2 }
];

// createTile: store ratio-based data in layoutData
function createTile(x, y, width, height) {
  // We'll place the tile in the container normally.
  // But we'll also compute ratio-based geometry.

  // Create the tile div
  const tile = document.createElement("div");
  tile.style.position = "absolute";
  tile.style.left = `${x}px`;
  tile.style.top = `${y}px`;
  tile.style.width = `${width}px`;
  tile.style.height = `${height}px`;

  const color = getRandomColor();
  tile.style.backgroundColor = color;

  tile.style.border = "1px solid rgba(0,0,0,0.03)";
  tile.style.boxSizing = "border-box";

  container.appendChild(tile);

  // Increment block count
  blockCount++;

  // If showing numbers, add label
  if (showNumbersCheckbox && showNumbersCheckbox.checked) {
    const label = document.createElement("div");
    label.textContent = blockCount;
    label.style.position = "absolute";
    label.style.top = "5px";
    label.style.left = "5px";
    label.style.fontSize = "0.7em";
    label.style.color = "black";
    label.style.fontWeight = "bold";
    tile.appendChild(label);
  }

  // Update the displayed block count
  if (blockCountDisplay) {
    blockCountDisplay.textContent = `Blocks: ${blockCount}`;
  }

  // Compute ratio-based geometry:
  // baseWidth & baseHeight are set in init()
  const xRatio = x / baseWidth;
  const yRatio = y / baseHeight;
  const wRatio = width / baseWidth;
  const hRatio = height / baseHeight;

  // Store in layoutData
  layoutData.push({
    blockNumber: blockCount,
    xRatio,
    yRatio,
    wRatio,
    hRatio,
    color
  });
}

function createGrid(x, y, width, height, depth = 0) {
  return new Promise((resolve) => {
    if (width < userMinSize || height < userMinSize || depth >= userMaxDepth) {
      createTile(x, y, width, height);
      resolve();
      return;
    }

    const ratio = ratios[Math.floor(Math.random() * ratios.length)];
    const splitVertical = Math.random() > 0.5;

    if (splitVertical) {
      const part1Height = height * (ratio.y / (ratio.x + ratio.y));
      Promise.all([
        createGrid(x, y, width, part1Height, depth + 1),
        createGrid(x, y + part1Height, width, height - part1Height, depth + 1)
      ]).then(resolve);
    } else {
      const part1Width = width * (ratio.x / (ratio.x + ratio.y));
      Promise.all([
        createGrid(x, y, part1Width, height, depth + 1),
        createGrid(x + part1Width, y, width - part1Width, height, depth + 1)
      ]).then(resolve);
    }
  });
}

function init() {
  // We read user container size from #container-width, #container-height (if they exist)
  const widthInput = document.getElementById("container-width");
  const heightInput = document.getElementById("container-height");

  let desiredWidth = container.clientWidth; // fallback if input not found
  let desiredHeight = container.clientHeight;

  if (widthInput && heightInput) {
    desiredWidth = parseInt(widthInput.value) || container.clientWidth;
    desiredHeight = parseInt(heightInput.value) || container.clientHeight;
  }

  // Set the container size in CSS
  container.style.width = desiredWidth + "px";
  container.style.height = desiredHeight + "px";

  // Now that container is sized, we can measure again if needed
  const cW = container.clientWidth;
  const cH = container.clientHeight;

  // Store these as our base
  baseWidth = cW;
  baseHeight = cH;

  // Reset counters
  blockCount = 0;
  layoutData = [];
  container.style.position = "relative";
  container.style.margin = "0";
  container.style.padding = "0";
  container.style.overflow = "hidden";
  container.innerHTML = "";

  // Create the layout
  createGrid(0, 0, cW, cH);
}

function updateAndRedraw() {
  const minSizeInput = document.getElementById("min-size");
  const maxDepthInput = document.getElementById("max-depth");

  userMinSize = parseInt(minSizeInput.value) || 100;
  userMaxDepth = parseInt(maxDepthInput.value) || 3;

  init();
}

function exportLayoutAsJson() {
  // layoutData has ratio-based geometry.
  // We'll export it.

  const jsonString = JSON.stringify(layoutData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "layout.json";
  link.click();

  URL.revokeObjectURL(url);
}

window.onload = function () {
  // If the user doesn't have controls in their HTML, create them
  if (!document.getElementById("min-size")) {
    createControls();
  }

  // Setup initial input values
  const minSizeInput = document.getElementById("min-size");
  const maxDepthInput = document.getElementById("max-depth");

  if (minSizeInput) {
    minSizeInput.value = userMinSize;
  }
  if (maxDepthInput) {
    maxDepthInput.value = userMaxDepth;
  }

  // Hook up existing buttons
  const redrawButton = document.getElementById("redraw");
  if (redrawButton) {
    redrawButton.addEventListener("click", updateAndRedraw);
  }

  if (showNumbersCheckbox) {
    showNumbersCheckbox.addEventListener("change", updateAndRedraw);
  }

  // Create an Export JSON button
  const exportButton = document.createElement("button");
  exportButton.id = "export-json";
  exportButton.textContent = "Export JSON";
  exportButton.style.marginLeft = "1rem";

  // Insert next to the existing redraw button
  if (redrawButton && redrawButton.parentNode) {
    redrawButton.parentNode.appendChild(exportButton);
  }
  exportButton.addEventListener("click", exportLayoutAsJson);

  // Start
  init();
};

function createControls() {
  const header = document.querySelector("header");
  if (!header) return;

  const controls = document.createElement("div");
  controls.className = "controls";

  const minSizeGroup = document.createElement("div");
  minSizeGroup.className = "input-group";

  const minSizeLabel = document.createElement("label");
  minSizeLabel.setAttribute("for", "min-size");
  minSizeLabel.textContent = "Min Size:";

  const minSizeInput = document.createElement("input");
  minSizeInput.type = "number";
  minSizeInput.id = "min-size";
  minSizeInput.value = userMinSize;
  minSizeInput.min = "10";
  minSizeInput.max = "700";
  minSizeInput.step = "10";

  minSizeGroup.appendChild(minSizeLabel);
  minSizeGroup.appendChild(minSizeInput);

  const maxDepthGroup = document.createElement("div");
  maxDepthGroup.className = "input-group";

  const maxDepthLabel = document.createElement("label");
  maxDepthLabel.setAttribute("for", "max-depth");
  maxDepthLabel.textContent = "Max Depth:";

  const maxDepthInput = document.createElement("input");
  maxDepthInput.type = "number";
  maxDepthInput.id = "max-depth";
  maxDepthInput.value = userMaxDepth;
  maxDepthInput.min = "1";
  maxDepthInput.max = "10";
  maxDepthInput.step = "1";

  maxDepthGroup.appendChild(maxDepthLabel);
  maxDepthGroup.appendChild(maxDepthInput);

  const redrawButton = document.createElement("button");
  redrawButton.id = "redraw";
  redrawButton.textContent = "Update";

  controls.appendChild(minSizeGroup);
  controls.appendChild(maxDepthGroup);
  controls.appendChild(redrawButton);

  // Insert controls after logo or at beginning of header
  const logo = header.querySelector(".logo");
  if (logo) {
    header.insertBefore(controls, logo.nextSibling);
  } else {
    header.insertBefore(controls, header.firstChild);
  }
}

// Re-init on window resize (optional if you want dynamic resizing)
window.onresize = init;
