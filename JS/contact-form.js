/**
 * Contact Form Handler
 * Validates form inputs, displays success message, and handles form reset
 */
(function () {
  "use strict";

  const form = document.getElementById("contactForm");

  // Early exit if form doesn't exist on the page
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get trimmed form values
    const name = form.querySelector("#contact-name").value.trim();
    const email = form.querySelector("#contact-email").value.trim();
    const message = form.querySelector("#contact-message").value.trim();

    // Validate all fields are filled
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    // Hide submit button after successful validation
    const submitBtn = form.querySelector(".contact__form--btn");
    submitBtn.style.display = "none";

    // Create and display success message
    const successMsg = document.createElement("div");
    successMsg.className = "contact__form--success";
    successMsg.textContent = "✓ Message sent successfully!";
    submitBtn.parentNode.insertBefore(successMsg, submitBtn);

    // Reset form fields
    form.reset();

    // Close success message and restore button on any page click
    const closeSuccess = () => {
      successMsg.remove();
      submitBtn.style.display = "inline-block";
      document.removeEventListener("click", closeSuccess);
    };

    document.addEventListener("click", closeSuccess);
  });
})();
