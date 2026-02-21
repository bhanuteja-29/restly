// -------------------------------
// Bootstrap Form Validation
// -------------------------------
(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();


// -------------------------------
// Loading Modal Logic
// -------------------------------

// Get modal element safely
const loaderElement = document.getElementById("loadingModal");
let loadingModal = null;

if (loaderElement) {
  loadingModal = new bootstrap.Modal(loaderElement, {
    backdrop: 'static',
    keyboard: false
  });
}

// Function to completely reset loader (VERY important for mobile)
function resetLoader() {
  if (!loaderElement) return;

  loaderElement.classList.remove("show");
  loaderElement.style.display = "none";

  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";

  document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
}

// Hide loader when page fully loads
window.addEventListener("load", () => {
  resetLoader();
});

// 🔥 Critical fix for mobile back navigation (bfcache)
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    resetLoader();
  }
});

// Show loader on normal link clicks
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");

  if (
    loadingModal &&
    link &&
    link.href &&
    !link.target &&
    !link.classList.contains("no-loader") &&
    !link.href.startsWith("#")
  ) {
    loadingModal.show();
  }
});

// Show loader on valid form submission
document.addEventListener("submit", function (e) {
  if (loadingModal && e.target.checkValidity()) {
    loadingModal.show();
  }
});