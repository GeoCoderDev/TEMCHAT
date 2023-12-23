
function eliminarUsuarioAnteriorDeLaBaseDeDatos(){

    if(!sessionStorage.getItem('USER-DATA')) return;

    const LAST_DATA_USER = JSON.parse(sessionStorage.getItem('USER-DATA'));
    
    fetch(`/users/${LAST_DATA_USER._id}`,{method:"DELETE"})
        .catch((e)=>{
            console.error(e);
        })

}

function eliminarDatosPersistentes(){

    // PROBANDO A ELIMINAR MIS DATOS DE LA BASE DE DATOS POR PRECAUCION
    eliminarUsuarioAnteriorDeLaBaseDeDatos();

    // ELIMINANDO MIS DATOS DE USUARIO ANTERIORES
    sessionStorage.removeItem('USER-DATA');

}

window.addEventListener('load',()=>{

    eliminarDatosPersistentes();

    const usernameInput = document.getElementById('username');

    document.getElementById('KJ').addEventListener('click',()=>{

        // CONSULTANDO SI EXISTE EL USUARIO INGRESADO
        fetch(`/users/${usernameInput.value}`,{method:'GET'})
            .then((res)=>{
                return res.json();
            })
            .then((data)=>{
                console.log(data);
                if(data.error?.name=='USER-NOT-FOUND'){
                    window.location.href = `/chat?username=${usernameInput.value}`;
                }                                                     
            })           

    })

})


window.addEventListener('popstate',()=>{
    eliminarDatosPersistentes();
})

document.addEventListener('visibilitychange',()=>{
    eliminarDatosPersistentes();
})