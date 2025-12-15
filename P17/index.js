let lista = [
    "levantarse",
    "Hacer Ejercicio",
    "Desayunar saludable",
    "Estudiar Js"
];

let nombrecompleto = "Axel Trujillo";
let edad = 23;
console.log(nombrecompleto+" tiene "+ edad + " años.");
let datos = document.getElementById("datos");
datos.innerHTML = nombrecompleto + " tiene "+ edad +" años.";
let actividadesList = "<ul>" + lista.map(actividad => "<li>" + actividad + "</li>").join("") + "</ul>";
datos.innerHTML += "<br>Actividades: " + actividadesList;
