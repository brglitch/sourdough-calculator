const totalDough = document.getElementById("totalDough");
const starter = document.getElementById("starter");
const hydration = document.getElementById("hydration");
const slider = document.getElementById("hydrationSlider");

const hydrationResult = document.getElementById("hydrationResult");
const addFlourEl = document.getElementById("addFlour");
const addWaterEl = document.getElementById("addWater");
const saltEl = document.getElementById("salt");
const feelEl = document.getElementById("feel");
const hintEl = document.getElementById("bassinage");

const quickButtons = document.querySelectorAll(".quick button");
const SALT_PCT = 0.02;

/* ---------- 工具 ---------- */
const num = v => Number(String(v).replace(/,/g, "") || 0);
const fmt = n => n.toLocaleString("en-US");

function feel(h) {
  if (h < 65) return "新手友善，偏乾、好整形";
  if (h < 75) return "經典酸種，最好操作";
  if (h < 82) return "高含水，較黏手";
  return "超高含水（接近麵糊）";
}

function animate() {
  const el = document.querySelector(".result-number");
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = null;
}

/* ---------- 一般數字欄位 ---------- */
[totalDough, starter].forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/[^\d]/g, "");
    calc();
  });

  input.addEventListener("blur", () => {
    if (input.value !== "") input.value = fmt(num(input.value));
  });
});

/* =====================================================
   ✅ 方案 A：目標含水量（UX 正確版）
===================================================== */

/* 1️⃣ input：只收集意圖 */
hydration.addEventListener("input", () => {
  hydration.value = hydration.value.replace(/[^\d]/g, "");
});

/* 2️⃣ Enter：確認意圖（不回彈） */
hydration.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  const h = num(hydration.value);
  if (!h) return;

  if (h > 90) {
    hintEl.textContent =
      "已輸入超高含水（90%+），僅適用於 Pan de Cristal 等接近麵糊的配方";
  } else {
    hintEl.textContent = "";
  }

  calc();        // ✅ 用使用者輸入值計算
  hydration.blur(); // 結束輸入狀態（但 blur 才會回彈）
});

/* 3️⃣ blur：回到產品預設世界 */
hydration.addEventListener("blur", () => {
  if (hydration.value === "") return;

  let h = num(hydration.value);

  if (h > 90) {
    h = 90;
    hintEl.textContent =
      "已回到預設上限 90%。如需超高含水，建議使用進階模式";
  } else if (h < 55) {
    h = 55;
    hintEl.textContent = "含水量下限為 55%，已自動調整";
  } else {
    hintEl.textContent = "";
  }

  hydration.value = h;
  slider.value = h;
  calc();
});

/* ---------- Slider ---------- */
slider.oninput = () => {
  hydration.value = slider.value;
  hintEl.textContent = "";
  quickButtons.forEach(b =>
    b.classList.toggle("active", b.dataset.h === slider.value)
  );
  calc();
};

/* ---------- 快捷鍵 ---------- */
quickButtons.forEach(btn => {
  btn.onclick = () => {
    hydration.value = btn.dataset.h;
    slider.value = btn.dataset.h;
    hintEl.textContent = "";
    quickButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    calc();
  };
});

/* ---------- 計算 ---------- */
function calc() {
  const T = num(totalDough.value);
  const S = num(starter.value);
  const H_raw = num(hydration.value);

  if (!T || !S || !H_raw) return;

  const H = H_raw / 100;
  const flourTotal = T / (1 + H + SALT_PCT);
  const waterTotal = flourTotal * H;

  const addFlour = flourTotal - S / 2;
  const addWater = waterTotal - S / 2;
  const salt = flourTotal * SALT_PCT;

  hydrationResult.textContent = `${Math.round(H_raw)}%`;
  addFlourEl.textContent = fmt(Math.round(addFlour));
  addWaterEl.textContent = fmt(Math.round(addWater));
  saltEl.textContent = fmt(Math.round(salt));

  feelEl.textContent = feel(H_raw);
  animate();
}

calc();
``
