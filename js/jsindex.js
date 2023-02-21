const d = document;

d.addEventListener("click", (e)=>{

  if(e.target.matches(".boton-reserva")){
    console.log("Es un boton de reserva")
  }
});