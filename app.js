// app.js

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

// Get grid container reference
const container = document.getElementById("grid-container");

// Grab references to block-count and show-numbers elements
const blockCountDisplay = document.getElementById("block-count");
const showNumbersCheckbox = document.getElementById("show-numbers");

// Global variables for user controls
let userMinSize = 100;
let userMaxDepth = 3;

// We'll track how many tiles are created
let blockCount = 0;

// We'll store tile info for export
let layoutData = [];

// Function to shuffle colors
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Generate lighter and darker variations for each color
function generateColorVariations(color) {
  return [
    color.hex,
    shadeColor(color.hex, -10), // Darker shade
    shadeColor(color.hex, 10)   // Lighter shade
  ];
}

// Function to lighten or darken a color
function shadeColor(color, percent) {
  let num = parseInt(color.slice(1), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) + amt;
  let G = ((num >> 8) & 0x00FF) + amt;
  let B = (num & 0x0000FF) + amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}

// Function to create a tile
function createTile(x, y, width, height) {
  const tile = document.createElement("div");
  tile.style.position = "absolute";
  tile.style.left = `${x}px`;
  tile.style.top = `${y}px`;
  tile.style.width = `${width}px`;
  tile.style.height = `${height}px`;

  const color = getRandomColor();
  tile.style.backgroundColor = color;

  // Add a subtle border
  tile.style.border = "1px solid rgba(0,0,0,0.03)";
  tile.style.boxSizing = "border-box";

  container.appendChild(tile);

  // Increment the global blockCount
  blockCount++;

  // If 'Show Block Numbers' is checked, add a small label
  if (showNumbersCheckbox && showNumbersCheckbox.checked) {
    const label = document.createElement("div");
    label.textContent = blockCount; // tile number
    label.style.position = "absolute";
    label.style.top = "5px";
    label.style.left = "5px";
    label.style.fontSize = "0.7em";
    label.style.color = "black";
    label.style.fontWeight = "bold";
    tile.appendChild(label);
  }

  // Update the displayed block count in the header
  if (blockCountDisplay) {
    blockCountDisplay.textContent = `Blocks: ${blockCount}`;
  }

  // Store tile info so we can export it if desired
  layoutData.push({
    blockNumber: blockCount,
    x,
    y,
    width,
    height,
    color
  });
}

// Function to get a random color variation
function getRandomColor() {
  const shuffledColors = shuffle(colors);
  const colorVariations = generateColorVariations(shuffledColors[0]);
  return colorVariations[Math.floor(Math.random() * colorVariations.length)];
}

// More consistent ratio options (1:1, 1:2, 2:1)
const ratios = [
  { x: 1, y: 1 }, // Square
  { x: 2, y: 1 }, // Horizontal rectangle
  { x: 1, y: 2 }  // Vertical rectangle
];

// Simplified subdivision function with user-defined parameters
function createGrid(x, y, width, height, depth = 0) {
  return new Promise((resolve) => {
    // Use user-defined values for minimum size and max depth
    if (width < userMinSize || height < userMinSize || depth >= userMaxDepth) {
      createTile(x, y, width, height);
      resolve();
      return;
    }

    // Choose a ratio from our predefined options
    const ratio = ratios[Math.floor(Math.random() * ratios.length)];

    // Determine how to split (horizontally or vertically)
    const splitVertical = Math.random() > 0.5;

    if (splitVertical) {
      // Vertical split
      const part1Height = height * (ratio.y / (ratio.x + ratio.y));
      Promise.all([
        createGrid(x, y, width, part1Height, depth + 1),
        createGrid(x, y + part1Height, width, height - part1Height, depth + 1)
      ]).then(resolve);
    } else {
      // Horizontal split
      const part1Width = width * (ratio.x / (ratio.x + ratio.y));
      Promise.all([
        createGrid(x, y, part1Width, height, depth + 1),
        createGrid(x + part1Width, y, width - part1Width, height, depth + 1)
      ]).then(resolve);
    }
  });
}

// Initialize the layout
function init() {
  // Reset counters
  blockCount = 0;
  layoutData = [];

  container.style.position = "relative";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.margin = "0";
  container.style.padding = "0";
  container.style.overflow = "hidden";
  container.innerHTML = "";

  createGrid(0, 0, container.clientWidth, container.clientHeight);
}

// Function to update from user inputs and redraw
function updateAndRedraw() {
  // Get values from inputs
  const minSizeInput = document.getElementById("min-size");
  const maxDepthInput = document.getElementById("max-depth");

  // Update global variables
  userMinSize = parseInt(minSizeInput.value) || 100; // Default to 100 if invalid
  userMaxDepth = parseInt(maxDepthInput.value) || 3; // Default to 3 if invalid

  // Redraw the grid
  init();
}

// Export layoutData as JSON
function exportLayoutAsJson() {
  // Convert layoutData to JSON string
  const jsonString = JSON.stringify(layoutData, null, 2);

  // Create a Blob for the file
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'layout.json';
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
}

// Set up event listeners when page loads
window.onload = function () {
  // Create input fields and controls if they don't exist in HTML
  if (!document.getElementById("min-size")) {
    createControls();
  }

  // Set initial values in input fields
  document.getElementById("min-size").value = userMinSize;
  document.getElementById("max-depth").value = userMaxDepth;

  // Set up the redraw button
  const redrawButton = document.getElementById("redraw");
  if (redrawButton) {
    redrawButton.addEventListener("click", updateAndRedraw);
  }

  // Also set up the toggle for showNumbers
  if (showNumbersCheckbox) {
    showNumbersCheckbox.addEventListener("change", updateAndRedraw);
  }

  // Create and hook up an "Export JSON" button
  const exportButton = document.createElement('button');
  exportButton.id = 'export-json';
  exportButton.textContent = 'Export JSON';
  exportButton.style.marginLeft = '1rem'; // optional styling

  // Insert next to the existing redraw button
  if (redrawButton && redrawButton.parentNode) {
    redrawButton.parentNode.appendChild(exportButton);
  }

  // Add click handler
  exportButton.addEventListener('click', exportLayoutAsJson);

  // Initialize with default values
  init();
};

// Function to create controls if they don't exist in HTML
function createControls() {
  const header = document.querySelector("header");
  if (!header) return;

  // Create controls container
  const controls = document.createElement("div");
  controls.className = "controls";

  // Create min size input
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

  // Create max depth input
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

  // Create update button
  const redrawButton = document.createElement("button");
  redrawButton.id = "redraw";
  redrawButton.textContent = "Update";

  // Add everything to controls
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

// Handle window resize
window.onresize = init;
