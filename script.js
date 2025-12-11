// ===============================
// SKIN + EYELID SYSTEM
// ===============================

// Which skin & eyelid style are active?
// skinId examples: "skin01", "skin02", "skin03"
// styleId examples: "style01", "style02"
let currentSkin = "skin01";
let currentEyelidStyle = "style01";

// Build the eyelid file path based on style + state + skin
// e.g. eyelids_style01_open_skin01.png
function getEyelidPath(state) {
  return `assets/eyelids_${currentEyelidStyle}_${state}_${currentSkin}.png`;
}

// Change skin and update body + eyelids to match
// Expects body files like: body_skin01.png, body_skin02.png, ...
function changeSkin(skinId) {
  currentSkin = skinId;

  // Update body
  document.getElementById("layer-body").src = `assets/body_${skinId}.png`;

  // Reset eyelids to "open" for this skin & current style
  document.getElementById("layer-eyelids").src = getEyelidPath("open");
}

// Change eyelid style (natural, eyeliner, etc.)
// and keep blinking + skin color in sync
function changeEyelidStyle(styleId) {
  currentEyelidStyle = styleId;
  // Immediately update eyelids to "open" with this style & current skin
  document.getElementById("layer-eyelids").src = getEyelidPath("open");
}

// Optional: manually set eyelid pose (open / half / closed) using current skin+style
function setEyelidState(state) {
  document.getElementById("layer-eyelids").src = getEyelidPath(state);
}

// ===============================
// EQUIP OTHER ITEMS
// ===============================

function equipItem(category, imagePath) {
  // We no longer use equipItem("skin", ...) or equipItem("eyelids", ...)
  // Use changeSkin(...) and changeEyelidStyle(...) instead.

  if (category === "eyes") {
    document.getElementById("layer-eyes").src = imagePath;

  } else if (category === "eyebrows") {
    document.getElementById("layer-eyebrows").src = imagePath;

  } else if (category === "mouth") {
    document.getElementById("layer-mouth").src = imagePath;

  } else if (category === "cheeks") {
    document.getElementById("layer-cheeks").src = imagePath;

  } else if (category === "hair-front") {
    document.getElementById("layer-hair-front").src = imagePath;

  } else if (category === "hair-back") {
    document.getElementById("layer-hair-back").src = imagePath;

  } else if (category === "top") {
        document.getElementById("layer-top").src = imagePath;
        updateUnderwearVisibility();

  } else if (category === "bottom") {
        document.getElementById("layer-bottom").src = imagePath;
        updateUnderwearVisibility();

  } else if (category === "socks") {                      
    document.getElementById("layer-socks").src = imagePath;

  } else if (category === "shoes") {
    document.getElementById("layer-shoes").src = imagePath;

  } else if (category === "accessory") {
    document.getElementById("layer-accessory").src = imagePath;
  }
}

// Clear only clothes + accessories
function clearClothes() {
  document.getElementById("layer-top").src = "";
  document.getElementById("layer-bottom").src = "";
  document.getElementById("layer-socks").src = "";
  document.getElementById("layer-shoes").src = "";
  document.getElementById("layer-accessory").src = "";

  updateUnderwearVisibility();
}

function updateUnderwearVisibility() {
    const topLayer = document.getElementById("layer-top");
    const bottomLayer = document.getElementById("layer-bottom");
    const uwTop = document.getElementById("layer-underwear-top");
    const uwBottom = document.getElementById("layer-underwear-bottom");

    const topSrc = topLayer ? topLayer.getAttribute("src") : "";
    const bottomSrc = bottomLayer ? bottomLayer.getAttribute("src") : "";

    const hasTop = topSrc && topSrc !== "";
    const hasBottom = bottomSrc && bottomSrc !== "";

    if (uwTop) {
        uwTop.style.opacity = hasTop ? "0" : "1";
    }

    if (uwBottom) {
        uwBottom.style.opacity = hasBottom ? "0" : "1";
    }
}

// ===============================
// AUTO BLINKING (uses skin + style)
// ===============================

function blinkOnce() {
  const eyelids = document.getElementById("layer-eyelids");
  if (!eyelids) return;

  eyelids.src = getEyelidPath("half");
  setTimeout(() => {
    eyelids.src = getEyelidPath("closed");
    setTimeout(() => {
      eyelids.src = getEyelidPath("open");
    }, 200); // how long eyes stay fully closed
  }, 400);   // speed from half → fully closed
}

function scheduleBlink() {
  const delay = 2000 + Math.random() * 4000; // 2–6 seconds
  setTimeout(() => {
    blinkOnce();
    scheduleBlink();
  }, delay);
}

// ===============================
// DRAG & DROP CLOTHES
// ===============================

function startDrag(event, category, imagePath) {
  event.dataTransfer.setData("category", category);
  event.dataTransfer.setData("imagePath", imagePath);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropItem(event) {
  event.preventDefault();
  const category = event.dataTransfer.getData("category");
  const imagePath = event.dataTransfer.getData("imagePath");
  if (category && imagePath) {
    equipItem(category, imagePath);
  }
}

// ===============================
// RECOLOUR SLIDERS
// ===============================

function updateHairHue(value) {
  const deg = value + "deg";
  document.documentElement.style.setProperty("--hair-hue", deg);
}

function updateTopHue(value) {
  const deg = value + "deg";
  document.documentElement.style.setProperty("--top-hue", deg);
}

function updateEyesHue(value) {
  const deg = value + "deg";
  document.documentElement.style.setProperty("--eyes-hue", deg);
}

// ===============================
// INITIALIZE ON PAGE LOAD
// ===============================

function generateHairFront() {
    const container = document.getElementById("hair-front-container");

    for (let i = 1; i <= 8; i++) {                    
        const num = String(i).padStart(2, '0');         
        const file = `assets/hair_front${num}.png`;     

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('hair-front', file);
        img.ondragstart = (event) => startDrag(event, 'hair-front', file);

        container.appendChild(img);
    }
}

function generateHairBack() {
    const container = document.getElementById("hair-back-container");

    for (let i = 1; i <= 10; i++) {                      
        const num = String(i).padStart(2, '0');          
        const file = `assets/hair_back${num}.png`;       

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('hair-back', file);
        img.ondragstart = (event) => startDrag(event, 'hair-back', file);

        container.appendChild(img);
    }
}

function generateTops() {
    const container = document.getElementById("tops-container");
    for (let i = 1; i <= 12; i++) {
        const num = String(i).padStart(2, '0');
        const file = `assets/top${num}.png`;

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('top', file);
        img.ondragstart = (event) => startDrag(event, 'top', file);

        container.appendChild(img);
    }
}

function generateBottoms() {
    const container = document.getElementById("bottoms-container");
    for (let i = 1; i <= 09; i++) {      
        const num = String(i).padStart(2, '0'); // 01, 02, 03 …
        const file = `assets/bottom${num}.png`;

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('bottom', file);
        img.ondragstart = (event) => startDrag(event, 'bottom', file);

        container.appendChild(img);
    }
}

function generateSocks() {
    const container = document.getElementById("socks-container");
    for (let i = 1; i <= 6; i++) {
        const num = String(i).padStart(2, '0'); // 01, 02, 03 …
        const file = `assets/socks${num}.png`; 

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('socks', file);
        img.ondragstart = (event) => startDrag(event, 'socks', file);

        container.appendChild(img);
    }
}

function generateSocks() {
    const container = document.getElementById("socks-container");

    for (let i = 1; i <= 6; i++) {         
        const num = String(i).padStart(2, '0');  
        const file = `assets/socks${num}.png`;   

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('socks', file);
        img.ondragstart = (event) => startDrag(event, 'socks', file);

        container.appendChild(img);
    }
}

function generateShoes() {
    const container = document.getElementById("shoes-container");

    for (let i = 1; i <= 6; i++) {
        const num = String(i).padStart(2, '0');  
        const file = `assets/shoes${num}.png`;   

        const img = document.createElement("img");
        img.src = file;
        img.classList.add("item-icon");
        img.draggable = true;

        img.onclick = () => equipItem('shoes', file);
        img.ondragstart = (event) => startDrag(event, 'shoes', file);

        container.appendChild(img);
    }
}

function clearTop() {
    const topLayer = document.getElementById("layer-top");
    if (topLayer) topLayer.src = "";
    updateUnderwearVisibility();
}

function clearBottom() {
    const bottomLayer = document.getElementById("layer-bottom");
    if (bottomLayer) bottomLayer.src = "";
    updateUnderwearVisibility();
}

function clearSocks() {
    const socksLayer = document.getElementById("layer-socks");
    if (socksLayer) socksLayer.src = "";
}

function clearShoes() {
    const shoesLayer = document.getElementById("layer-shoes");
    if (shoesLayer) shoesLayer.src = "";
}

function updateHairSaturation(value) {
    document.documentElement.style.setProperty("--hair-sat", value + "%");
}

function updateEyesSaturation(value) {
    document.documentElement.style.setProperty("--eyes-sat", value + "%");
}

// ============ MENU PAGE NAVIGATION ============

const menuPages = [
  "menu-page-1",
  "menu-page-2",
  "menu-page-3",
  "menu-page-4",
  "menu-page-5",
  "menu-page-6"
];

let currentMenuPageIndex = 0;

function showMenuPage(index) {
  // clamp index
  if (index < 0) index = 0;
  if (index >= menuPages.length) index = menuPages.length - 1;
  currentMenuPageIndex = index;

  // hide all pages
  menuPages.forEach((id, i) => {
    const page = document.getElementById(id);
    if (!page) return;
    page.classList.toggle("active", i === index);
  });

  // update indicator text, e.g. "Page 1 / 4"
  const indicator = document.getElementById("menu-page-indicator");
  if (indicator) {
    indicator.textContent = `Page ${index + 1} / ${menuPages.length}`;
  }
}

function nextMenuPage() {
  showMenuPage(currentMenuPageIndex + 1);
}

function prevMenuPage() {
  showMenuPage(currentMenuPageIndex - 1);
}


window.addEventListener("load", () => {
    generateTops();
    generateBottoms();
    generateSocks();
    generateShoes();
    generateHairFront();
    generateHairBack();

    updateUnderwearVisibility();
  document.getElementById("layer-eyelids").src = getEyelidPath("open");
  scheduleBlink();

  showMenuPage(0);

});
