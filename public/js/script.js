// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Create bootstrap modal instance
const loadingModal = new bootstrap.Modal(
  document.getElementById("loadingModal")
);

// Hide loader when page finishes loading
window.addEventListener("load", () => {
  loadingModal.hide();
});

// Show loader on link click
document.addEventListener("click", function (e) {
  const link = e.target.closest("a");

  if (link && link.href && !link.target && !link.classList.contains("no-loader")) {
    loadingModal.show();
  }
});

// Show loader on form submit
document.addEventListener("submit", function () {
  loadingModal.show();
});

// Hide loader when page fully loads
window.addEventListener("load", function () {
    const loader = document.getElementById("loadingModal");
    if (loader) {
        const modalInstance = bootstrap.Modal.getInstance(loader);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
});

// Extra fix for browser back/forward cache
window.addEventListener("pageshow", function () {
    const loader = document.getElementById("loadingModal");
    if (loader) {
        loader.classList.remove("show");
        loader.style.display = "none";
        document.body.classList.remove("modal-open");
        const backdrops = document.querySelectorAll(".modal-backdrop");
        backdrops.forEach(el => el.remove());
    }
});