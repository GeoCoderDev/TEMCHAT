// Obtén el objeto URLSearchParams de la URL actual
const queryParams = new URLSearchParams(window.location.search);

// Obténiendo el username
const username = queryParams.get('username');

console.log(username);

// Procotol es el protocolo , y host es el dominio con el puerto incluido si es que lo hay
const newUrl = `${window.location.protocol}//${window.location.host}/chat`;
// window.history.replaceState('',undefined,newUrl);

