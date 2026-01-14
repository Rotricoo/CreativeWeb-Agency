(function () {
  "use strict";

  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#contact-name").value.trim();
    const email = form.querySelector("#contact-email").value.trim();
    const message = form.querySelector("#contact-message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    // Esconde o botão
    const submitBtn = form.querySelector(".contact__form--btn");
    submitBtn.style.display = "none";

    // Cria mensagem de sucesso
    const successMsg = document.createElement("div");
    successMsg.className = "contact__form--success";
    successMsg.textContent = "✓ Message sent successfully!";
    submitBtn.parentNode.insertBefore(successMsg, submitBtn);

    // Limpa o form
    form.reset();

    // Fecha ao clicar em qualquer lugar da página
    const closeSuccess = () => {
      successMsg.remove();
      submitBtn.style.display = "inline-block";
      document.removeEventListener("click", closeSuccess);
    };

    document.addEventListener("click", closeSuccess);
  });
})();
