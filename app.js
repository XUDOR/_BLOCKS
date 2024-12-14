// app.js

const whites = [
  { name: "Cardboard", hex: "#F9F9F7" },
  { name: "Estate", hex: "#FAFAFA" },
  { name: "Ice", hex: "#F9F9F7" },
  { name: "Perfumed Letter", hex: "#F7F5F5" },
  { name: "Gimlet", hex: "#F7F7F7" },
  { name: "Frost", hex: "#F7F7F5" },
  { name: "Confident", hex: "#FFFFFD" },
  { name: "Testament", hex: "#f9f9f2" }
];

const neutrals = [
  { name: "GoatMilk", hex: "#FFFEF5" },
  { name: "Ivory", hex: "#FCFBF2" },
  { name: "Book", hex: "#F9F7E8" },
  { name: "Document", hex: "#FFFFFA" },
  { name: "Parchment", hex: "#FFFADF" },
  { name: "Linen", hex: "#FBFBF4" },
  { name: "Milk", hex: "#FFFFE5" },
  { name: "Creamcheese", hex: "#F9F8D4" },
  { name: "Creamcheese II", hex: "#FCFBE3" },
  { name: "Fresh Cream", hex: "#F4F3C3" }
];

const greys = [
  { name: "Milan II", hex: "#DFE2CF" },
  { name: "Venician Coat", hex: "#C1BBA0" },
  { name: "Old Flag", hex: "#C1BEA4" },
  { name: "Concrete", hex: "#777068" },
  { name: "Shark", hex: "#BDC2C6" },
  { name: "Smoke", hex: "#D3D3CB" },
  { name: "Pebble", hex: "#EDECE2" },
  { name: "Slate II", hex: "#44423A" },
  { name: "Boot", hex: "#494842" },
  { name: "Pottery", hex: "#BBBCA7" }
];

const colors = [...whites, ...neutrals, ...greys];

const container = document.getElementById("grid-container");

// Function to shuffle array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to create a color square
function createSquare(name, hex) {
  const square = document.createElement("div");
  square.classList.add("square");
  square.style.backgroundColor = hex;
  square.style.borderColor = hex;
  square.innerHTML = `<p>${name}</p>`;
  return square;
}

// Generate and display the squares
function generateSquares() {
  const shuffledColors = shuffle(colors);
  shuffledColors.forEach(color => {
    container.appendChild(createSquare(color.name, color.hex));
  });
}

// Initialize
generateSquares();
