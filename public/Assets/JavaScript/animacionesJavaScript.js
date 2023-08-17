
/**
 * 
 * @param {HTMLElement} HTMLelement 
 * @param {*} duracionSegundos 
 * @param {*} horizontalmente 
 * @param {*} opacityOriginal 
 * @param {*} easing 
 * @param {*} permanent 
 * @returns 
 */
function desvanecerElemento(HTMLelement,duracionSegundos,horizontalmente=false,opacityOriginal=1,easing="ease-in",permanent=true){

    let displayOriginal = window.getComputedStyle(HTMLelement).display;

    if(horizontalmente){
        let anchoOriginal = HTMLelement.offsetWidth;
        let anchoOriginalEnPorcentaje = roundToDecimals((anchoOriginal/HTMLelement.parentNode.clientWidth)*100,2);

        const FADE_HORIZONTAL = HTMLelement.animate([
            {opacity:opacityOriginal}, //0%
            {opacity:0,width:`${anchoOriginalEnPorcentaje}%`, margin:0}, //25%
            {}, //55%
            {}, //75%
            {opacity:0,width:0,margin:`0 -${anchoOriginalEnPorcentaje/2}%`,display:"none"} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:easing,
            fill:(permanent)?'forwards':'none'
        })

        return{anchoOriginalEnPorcentaje:anchoOriginalEnPorcentaje,animacionFinalizada:FADE_HORIZONTAL.finished,displayOriginal:displayOriginal}

    }else{        
        
        let altoOriginal = HTMLelement.offsetHeight;
        let altoOriginalEnPorcentaje = (altoOriginal/HTMLelement.parentNode.clientHeight)*100;


        const FADE_VERTICAL = HTMLelement.animate([
            {opacity:opacityOriginal}, //0%
            {opacity:0,height:`${altoOriginalEnPorcentaje}%`, margin:0}, //25%
            {}, //50%
            {}, //75%
            {opacity:0,height:0,margin:`-${altoOriginalEnPorcentaje/2}% 0`,display:"none"} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:easing,
            fill:(permanent)?'forwards':'none'
        })

        return{altoOriginalEnPorcentaje:altoOriginalEnPorcentaje,animacionFinalizada:FADE_VERTICAL.finished,displayOriginal:displayOriginal}

    }
        
};



/**
 * 
 * @param {HTMLElement} HTMLelement 
 * @param {Number} duracionSegundos 
 * @param {String} dimensionOriginalCSS 
 * @param {String} displayOriginal 
 * @param {Boolean} [horizontalmente]
 * @param {String} [margenOriginal] 
 * @param {String} [opacityOriginal]
 * @param {Boolean} [permanent]
 * @returns 
 */

function aparecerElemento(HTMLelement,duracionSegundos,dimensionOriginalCSS,displayOriginal,horizontalmente=false, margenOriginal=0, opacityOriginal = 1,easing="ease-in",permanent=true){    
    let cantidad = parseFloat(dimensionOriginalCSS);
    const unidad = dimensionOriginalCSS.match(/[a-zA-Z%]+/)[0];
    
    if(horizontalmente){        

        const APPEAR_HORIZONTAL = HTMLelement.animate([
            {opacity:0,width:0,margin:`0 -${cantidad/2}${unidad}`,display:displayOriginal}, //0%
            {}, //25%
            {}, //50%
            {opacity:0,width:`${dimensionOriginalCSS}`, margin:margenOriginal, display:displayOriginal}, //75%
            {opacity:opacityOriginal, width:`${dimensionOriginalCSS}`, margin:margenOriginal, display:displayOriginal} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:easing,
            fill:((permanent)?'forwards':'none')
        })

        return{animacionFinalizada:APPEAR_HORIZONTAL.finished}

    }else{        
        
        const APPEAR_VERTICAL = HTMLelement.animate([
            {opacity:0,height:0,display:displayOriginal, margin:`-${cantidad/2}${unidad} 0`}, //0%
            {}, //25%
            {}, //50%
            {opacity:0,height:`${dimensionOriginalCSS}`, margin:margenOriginal,display:displayOriginal}, //75%
            {opacity:opacityOriginal,height:`${dimensionOriginalCSS}`, margin:margenOriginal,display:displayOriginal} //100%
        ],{
            iterations:1,
            duration: duracionSegundos * 1000, //esta propiedad recibe un valor en milisegundos
            easing:easing,
            fill:(permanent)?'forwards':'none'
        })

        return{animacionFinalizada:APPEAR_VERTICAL.finished}

    }
        
};

/**
 * 
 * @param {HTMLElement} HTMLelement 
 * @param {Number} duracionSegundos 
 * @param {Boolean} permanent 
 * @returns 
 */
function desvanecerElementoConScale(HTMLelement,duracionSegundos,permanent=true){
    
    const displayOriginal = window.getComputedStyle(HTMLelement).display;

    const FADE_SCALE = HTMLelement.animate(
        [
            {scale:1}, //0%
            {scale:0, display: "none"} //100%
        ],
        {
            iterations:1,
            duration: duracionSegundos * 1000,
            easing:"ease-in",
            fill: (permanent)?'forwards':'none'
        })

    return {animation: FADE_SCALE ,displayOriginal: displayOriginal};
}



function aparecerElementoConScale(HTMLelement,duracionSegundos,displayOriginal,permanent=true){

    const APPEAR_SCALE = HTMLelement.animate(
        [
            {scale:0, display: displayOriginal}, //0%
            {scale:1, display: displayOriginal}
        ],
        {
            iterations:1,
            duration: duracionSegundos * 1000,
            easing:"linear",
            fill: (permanent)?'forwards':'none'
        })

    return APPEAR_SCALE;
}


