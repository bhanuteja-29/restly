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
// Simple Bug-Free Page Loader
// -------------------------------

const loader = document.getElementById("pageLoader");

function showLoader() {
  if (loader) loader.classList.remove("d-none");
}

function hideLoader() {
  if (loader) loader.classList.add("d-none");
}

// Hide loader when page loads
window.addEventListener("load", hideLoader);

// Fix for mobile back/forward cache
window.addEventListener("pageshow", function () {
  hideLoader();
});

// Show loader on link click
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");

  if (
    link &&
    link.href &&
    !link.target &&
    !link.classList.contains("no-loader") &&
    !link.href.startsWith("#")
  ) {
    showLoader();
  }
});

// Show loader on valid form submit
document.addEventListener("submit", function (e) {
  if (e.target.checkValidity()) {
    showLoader();
  }
});