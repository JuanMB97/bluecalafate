const d = document;
const $form = d.querySelector(".contact-form");
d.addEventListener("DOMContentLoaded", () => {
  const $inputs = d.querySelectorAll(".contact-form [required]");
  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error", "none");
    input.insertAdjacentElement("afterend", $span);
  });
});

d.addEventListener("keyup", (e) => {
  if (e.target.matches(".contact-form [required]")) {
    let $input = e.target;
    let pattern = $input.pattern;

    if (pattern && $input.value !== "") {
      let regex = new RegExp(pattern);
      return !regex.exec($input.value)
        ? d.getElementById($input.name).classList.add("is-active")
        : d.getElementById($input.name).classList.remove("is-active");
    }
  }
});

d.addEventListener("submit", (e) => {
  e.preventDefault();
  const $loader = d.querySelector(".contact-form-loader"),
        $response = d.querySelector(".contact-form-response");

  $loader.classList.remove("none");

  fetch("https://formsubmit.co/ajax/37d4326f809f42ecef5106e3e5cc6d24", {
    method: "POST",
    body: new FormData(e.target)
  })
  .then(res => res.ok ? res.json(): Promise.reject(res))
  .then(json => {
    $loader.classList.add("none");
    $response.classList.remove("none");
    $response.innerHTML = `<p>Reserva enviada, nos contactaremos contigo a la brevead</p>`;
    $form.reset();
  })
  .catch(err => {
    let message = err.statusText || "Ocurrio un error al reservar";
    $response.innerHTML = `<p>Error: ${err.status}: ${message}</p>`;
  })
  .finally(() => setTimeout(() => {
    $response.classList.add("none");
    $response.innerHTML = "";
    },3000));
});
