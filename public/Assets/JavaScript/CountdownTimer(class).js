
// POR EL MOMENTO SOLO SOPORTA EN SEGUNDOS ENTEROS

const ADDITIONAL_SECONDS = 0.5;

export class CountdownTimer{

    /**
     * 
     * @param {Number} segundos 
     * @param {HTMLElement} elementoHTML 
     */
    constructor(segundos,elementoHTML){

        this.segundos = segundos.toFixed(0);
        this.elementoHTML = elementoHTML

    }

    start(){
        return new Promise((resolve,reject)=>{
            
            let tiempoInicial = this.segundos;
            const contenedorSegundos = this.elementoHTML;

            function countDownRECURSIVO(){
                
                if(contenedorSegundos){
                    contenedorSegundos.innerText = tiempoInicial;
                }   

                if(tiempoInicial==0){
                    setTimeout(()=>{
                        resolve()
                    },ADDITIONAL_SECONDS*1000)
                    return                  
                };

                setTimeout(()=>{
                    countDownRECURSIVO();
                },1000)
                
                tiempoInicial--;

            }   

            countDownRECURSIVO();

            this.forceFinish = resolve;

        })
    }



}