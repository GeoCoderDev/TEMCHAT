// POR EL MOMENTO SOLO SOPORTA EN SEGUNDOS ENTEROS

export class CountdownTimer {
  /**
   *
   * @param {Number} segundos
   * @param {Boolean} include0
   * @param {Number} ADDITIONAL_SECONDS
   * @param {HTMLElement} elementoHTML
   * @param {Boolean} animation
   * @param {Number} duracionDeAnimacionEnSegundos
   * @param {String} textoFinal
   * @param {Map} styleMapForTextFinal
   * @param {Number} playBackRate
   */
  constructor(
    segundos,
    playBackRate = 1,
    include0 = true,
    ADDITIONAL_SECONDS = undefined,
    elementoHTML = undefined,
    animation = false,
    duracionDeAnimacionEnSegundos = undefined,
    textoFinal = undefined,
    styleMapForTextFinal = undefined
  ) {
    this.segundos = segundos.toFixed(0);
    this.elementoHTML = elementoHTML;
    this.include0 = include0;
    this.animation = animation;
    this.duracionDeAnimacionEnSegundos = duracionDeAnimacionEnSegundos;
    this.textoFinal = textoFinal;
    this.ADDITIONAL_SECONDS = ADDITIONAL_SECONDS;
    this.styleMapForTextFinal = styleMapForTextFinal;
    this.playBackRate = playBackRate;
  }

  start() {
    return new Promise((resolve, reject) => {
      let tiempoInicial = this.segundos;
      const contenedorSegundos = this.elementoHTML;
      const include0 = this.include0;
      const animation = this.animation;
      const duracionDeAnimacionEnSegundos = this.duracionDeAnimacionEnSegundos;
      const textoFinal = this.textoFinal;
      const ADDITIONAL_SECONDS = this.ADDITIONAL_SECONDS;
      const styleMapForTextFinal = this.styleMapForTextFinal;
      const playBackRate = this.playBackRate;

      this.forceFinish = resolve;

      const countDownRECURSIVO = () => {
        if (contenedorSegundos) {
          if (animation) {
            aparecerElementoConScale(
              contenedorSegundos,
              duracionDeAnimacionEnSegundos,
              "block"
            ).finished.then(() => {
              setTimeout(() => {
                desvanecerElementoConScale(
                  contenedorSegundos,
                  duracionDeAnimacionEnSegundos
                );
              }, (1 - duracionDeAnimacionEnSegundos * 2 * playBackRate) * 1000 * playBackRate);
            });
          }

          contenedorSegundos.innerText = tiempoInicial;
        }

        if (tiempoInicial == (include0 ? 0 : 1)) {
          setTimeout(() => {
            if (!textoFinal) {
              setTimeout(() => {
                resolve();
              }, ADDITIONAL_SECONDS * 1000 * playBackRate);
              return;
            }

            let estilosParaTextoFinalElement;

            if (styleMapForTextFinal) {
              let estilos = "#Count-Down-Timer{";

              for (const [
                propertyName,
                value,
              ] of styleMapForTextFinal.entries()) {
                estilos += `${propertyName}: ${value};`;
              }

              estilos += "}";

              estilosParaTextoFinalElement =
                insertarReglasCSSAdicionales(estilos);
            }

            contenedorSegundos.innerText = textoFinal;

            aparecerElementoConScale(
              contenedorSegundos,
              duracionDeAnimacionEnSegundos,
              "block"
            ).finished.then(() => {
              setTimeout(() => {
                desvanecerElementoConScale(
                  contenedorSegundos,
                  duracionDeAnimacionEnSegundos
                ).animation.finished.then(() => {
                  setTimeout(() => {
                    if (estilosParaTextoFinalElement)
                      eliminarReglasCSSAdicionales(
                        estilosParaTextoFinalElement
                      );

                    resolve();
                  }, ADDITIONAL_SECONDS * 1000 * playBackRate);
                });
              }, (1 - duracionDeAnimacionEnSegundos * 2 * playBackRate) * 1000 * playBackRate);
            });
          }, 1000 * playBackRate);

          return;
        }

        setTimeout(() => {
          countDownRECURSIVO();
        }, 1000 * playBackRate);

        tiempoInicial--;
      };

      countDownRECURSIVO();
    });
  }
}
