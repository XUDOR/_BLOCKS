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
  { name: "Creamcheese II", hex: "#FCFBE3" },
  { name: "Fresh Cream", hex: "#F4F3C3" },
  // Greys
  { name: "Milan II", hex: "#DFE2CF" },
  { name: "Venician Coat", hex: "#C1BBA0" },
  { name: "Old Flag", hex: "#C1BEA4" },
  { name: "Oyster 2", hex: "#BAB5A0" },
  { name: "Oyster 3", hex: "#999B89" },
  { name: "Lichen III", hex: "#B7B69E" },
  { name: "Wooden Boat", hex: "#B8BFAC" },
  { name: "Concrete", hex: "#777068" },
  { name: "Shark", hex: "#BDC2C6" },
  { name: "Slate II", hex: "#44423A" }
];

// Get grid container reference
const container = document.getElementById("grid-container");

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
  let num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return `#${(0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1)}`;
}

// Function to create a tile
function createTile(x, y, width, height) {
  const tile = document.createElement("div");
  tile.style.position = "absolute";
  tile.style.left = `${x}px`;
  tile.style.top = `${y}px`;
  tile.style.width = `${width}px`;
  tile.style.height = `${height}px`;
  tile.style.backgroundColor = getRandomColor();
  container.appendChild(tile);
}

// Function to get a random color variation
function getRandomColor() {
  const shuffledColors = shuffle(colors);
  const colorVariations = generateColorVariations(shuffledColors[0]);
  return colorVariations[Math.floor(Math.random() * colorVariations.length)];
}

// Reduced variance in Fibonacci sequence
const fibonacci = [2, 3, 5, 8];

// Quad-tree subdivision function with reduced variance
function quadTree(x, y, width, height, depth = 0) {
  return new Promise((resolve) => {
    const minSize = 50;
    if (width < minSize || height < minSize || depth > 4) {
      createTile(x, y, width, height);
      resolve();
      return;
    }

    const ratio = fibonacci[Math.floor(Math.random() * fibonacci.length)];
    const newWidth = width / ratio;
    const newHeight = height / ratio;

    Promise.all([
      quadTree(x, y, newWidth, newHeight, depth + 1),
      quadTree(x + newWidth, y, width - newWidth, newHeight, depth + 1),
      quadTree(x, y + newHeight, newWidth, height - newHeight, depth + 1),
      quadTree(x + newWidth, y + newHeight, width - newWidth, height - newHeight, depth + 1)
    ]).then(resolve);
  });
}

// Initialize the layout
function init() {
  container.style.position = "relative";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.margin = "0";
  container.style.padding = "0";
  container.style.overflow = "hidden";
  container.innerHTML = "";

  quadTree(0, 0, container.clientWidth, container.clientHeight);
}

// Reinitialize the layout on window resize
window.onload = init;
window.onresize = init;
