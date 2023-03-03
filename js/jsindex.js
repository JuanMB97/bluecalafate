const d = document;
const boton = d.querySelector('.logo');
const menu = d.querySelector('.header-2');
const btmMenu = d.querySelector('.menu');
const opc = d.querySelector('.barra-principal');

d.addEventListener("DOMContentLoaded", () => {
    boton.addEventListener('click', () =>{
        menu.classList.toggle("visibility");
        btmMenu.classList.toggle("menuHidden");
        boton.classList.toggle("logoHidden");
    });

    btmMenu.addEventListener('click', () =>{
      menu.classList.toggle("visibility");
      btmMenu.classList.toggle("menuHidden");
      boton.classList.toggle("logoHidden");
    });
    
    opc.addEventListener('click', () =>{
      menu.classList.toggle("visibility");
      btmMenu.classList.toggle("menuHidden");
      boton.classList.toggle("logoHidden");
    });

});

