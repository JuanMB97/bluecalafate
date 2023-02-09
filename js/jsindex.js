const d = document;

export default function boton(){
  d.addEventListener("click", e =>{
    if(e.target.matches(boton)){
      d.querySelector().classList.toggle()
    }
  })
}

d.addEventListener("DOMContentLoaded", e=>{
  boton(".")
})

/*let counter = 1;

setInterval(function(){
  document.getElementById('radio' + counter).checked = true;
  counter++;
  if(counter > 4){
    counter = 1;
  }
},5000);
*/

