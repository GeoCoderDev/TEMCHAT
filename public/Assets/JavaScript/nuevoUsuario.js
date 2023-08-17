
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