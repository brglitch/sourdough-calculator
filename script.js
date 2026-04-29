const totalDough = document.getElementById("totalDough");
const starter = document.getElementById("starter");
const hydration = document.getElementById("hydration");
const slider = document.getElementById("hydrationSlider");

const hydrationResult = document.getElementById("hydrationResult");
const addFlourEl = document.getElementById("addFlour");
const addWaterEl = document.getElementById("addWater");
const saltEl = document.getElementById("salt");
const feelEl = document.getElementById("feel");
const bassinageEl = document.getElementById("bassinage");

const quickButtons = document.querySelectorAll(".quick button");
const SALT_PCT = 0.02;

function feel(h) {
  if (h < 65) return "新手友善，偏乾、好整形";
  if (h < 75) return "經典酸種，最好操作";
  if (h < 82) return "高含水，較黏手";
  return "進階高含水，需要技巧";
}

function animate(el) {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = null;
}

function calc() {
  const T = +totalDough.value;
  const S = +starter.value;
  const H = +hydration.value / 100;

  const flourTotal = T / (1 + H + SALT_PCT);
  const waterTotal = flourTotal * H;

  const starterFlour = S / 2;
  const starterWater = S / 2;

  const addFlour = flourTotal - starterFlour;
  const addWater = waterTotal - starterWater;
  const salt = flourTotal * SALT_PCT;

  hydrationResult.textContent = Math.round(H * 100) + "%";
  addFlourEl.textContent = Math.round(addFlour);
  addWaterEl.textContent = Math.round(addWater);
  saltEl.textContent = Math.round(salt);
  feelEl.textContent = feel(H * 100);

  animate(document.querySelector(".result-number"));

  if (H * 100 >= 78) {
    bassinageEl.textContent = "高含水建議保留 20–40g 水，後續分次加入（bassinage）";
  } else {
    bassinageEl.textContent = "";
  }
}

quickButtons.forEach(btn => {
  btn.onclick = () => {
    hydration.value = btn.dataset.h;
    slider.value = btn.dataset.h;
    quickButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    calc();
  };
});

[totalDough, starter, hydration].forEach(i => {
  i.oninput = () => {
    slider.value = hydration.value;
    calc();
  };
});

slider.oninput = () => {
  hydration.value = slider.value;
  quickButtons.forEach(b =>
    b.classList.toggle("active", b.dataset.h === slider.value)
  );
  calc();
};

calc();
``