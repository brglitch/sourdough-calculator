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

/* ---------- 工具 ---------- */
const fmt = n => n.toLocaleString("en-US");
const num = v => Number(String(v).replace(/,/g, "") || 0);

function feel(h) {
  if (h < 65) return "新手友善，偏乾、好整形";
  if (h < 75) return "經典酸種，最好操作";
  if (h < 82) return "高含水，較黏手";
  return "進階高含水，需要技巧";
}

function animate() {
  const el = document.querySelector(".result-number");
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = null;
}

/* ---------- 輸入行為 ---------- */
[totalDough, starter].forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^\d]/g, "");
    calc();
  });

  input.addEventListener("blur", () => {
    if (input.value !== "") input.value = fmt(num(input.value));
  });
});

hydration.addEventListener("input", () => {
  hydration.value = hydration.value.replace(/[^\d]/g, "");
  let h = num(hydration.value);

  if (h > 90) {
    h = 90;
    bassinageEl.textContent = "含水量上限為 90%，已自動調整";
  } else if (h < 55 && hydration.value !== "") {
    h = 55;
    bassinageEl.textContent = "含水量下限為 55%，已自動調整";
  } else {
    bassinageEl.textContent = "";
  }

  hydration.value = h;
  slider.value = h;
  calc();
});

/* ---------- 滑桿 / 快捷 ---------- */
slider.oninput = () => {
  hydration.value = slider.value;
  quickButtons.forEach(b =>
    b.classList.toggle("active", b.dataset.h === slider.value)
  );
  calc();
};

quickButtons.forEach(btn => {
  btn.onclick = () => {
    hydration.value = btn.dataset.h;
    slider.value = btn.dataset.h;
    quickButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    calc();
  };
});

/* ---------- 計算 ---------- */
function calc() {
  const T = num(totalDough.value);
  const S = num(starter.value);
  const H = num(hydration.value) / 100;

  const flourTotal = T / (1 + H + SALT_PCT);
  const waterTotal = flourTotal * H;

  const addFlour = flourTotal - S / 2;
  const addWater = waterTotal - S / 2;
  const salt = flourTotal * SALT_PCT;

  hydrationResult.textContent = `${Math.round(H * 100)}%`;
  addFlourEl.textContent = fmt(Math.round(addFlour));
  addWaterEl.textContent = fmt(Math.round(addWater));
  saltEl.textContent = fmt(Math.round(salt));

  feelEl.textContent = feel(H * 100);
  animate();
}

calc();
