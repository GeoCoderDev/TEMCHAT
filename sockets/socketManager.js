const socketIo = require("socket.io");
const uuid = require("uuid");
const temporaryUsersController = require("../components/temporaryUsers/controller");
const controller = require("../components/temporaryUsers/controller");
const CountdownTimer = require("../utils/CountdownTimer(class)");

/**
 *
 * @param {Server} server
 */
function socketManager(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("MY-USERNAME", (username) => {
      let MI_USER_DATA;
      controller
        .getUserByUsername(username)
        .then((usuarioEncontrado) => {
          MI_USER_DATA = usuarioEncontrado;

          temporaryUsersController
            .setSocketIdConnection(MI_USER_DATA._id, socket.id)
            .catch((e) => {
              console.error(e);
            });

          // ALMACENANDO EN EL OBJETO DE INFORMACION EL SOCKET CONNECTION ID TAMBIEN
          MI_USER_DATA.socketConectionID = socket.id;

          socket.emit("TAKE-YOUR-USER-DATA", JSON.stringify(MI_USER_DATA));

          console.log(`${MI_USER_DATA.username} conectado`);

          socket.on("GET-ALEATORY-USER", () => {
            temporaryUsersController
              .getAleatoryUser(MI_USER_DATA._id)
              .then((usuarioAleatorio) => {
                socket.emit(
                  "TAKE-YOUR-ALEATORY-USER",
                  JSON.stringify(usuarioAleatorio),
                  JSON.stringify(MI_USER_DATA)
                );
              })
              .catch((e) => {
                console.error(e);
              });
          });

          socket.on("TEMCHAT-REQUEST-FOR-ALEATORY-USER", () => {
            temporaryUsersController
              .getAleatoryUser(MI_USER_DATA._id)
              .then((usuarioAleatorio) => {
                const Usuario_Aleatorio = usuarioAleatorio[0];
                socket
                  .to(Usuario_Aleatorio.socketConectionID)
                  .emit(
                    "TEMCHAT-REQUEST-FOR-YOU",
                    JSON.stringify(MI_USER_DATA),
                    "Random-Temchat"
                  );
              })
              .catch((e) => {
                console.error(e);
              });
          });

          socket.on("(SERVER)TEMCHAT-ACCEPTED-FOR-YOU", (dataUserRequester) => {
            const DATA_USER_REQUESTER = JSON.parse(dataUserRequester);
            socket
              .to(DATA_USER_REQUESTER.socketConectionID)
              .emit(
                "TEMCHAT-REQUEST-ACCEPTED-FOR-YOU",
                dataUserRequester,
                JSON.stringify(MI_USER_DATA)
              );
          });

          socket.on("(SERVER)MESSAGE-FOR-YOU", (destinataryUser, content) => {
            const DESTINATARY_DATA = JSON.parse(destinataryUser);

            socket
              .to(DESTINATARY_DATA.socketConectionID)
              .emit("MESSAGE-FOR-YOU", content);
          });

          socket.on("(SERVER)REQUEST-FOR-X-USER", (destinataryUser) => {
            const DESTINATARY_DATA = JSON.parse(destinataryUser);

            socket
              .to(DESTINATARY_DATA.socketConectionID)
              .emit(
                "TEMCHAT-REQUEST-FOR-YOU",
                JSON.stringify(MI_USER_DATA),
                "Temchat-Request"
              );
          });

          socket.on("(SERVER)CANCEL-REQUEST-FOR-X-USER", (userInfo) => {
            const DATA_USER_INFO = JSON.parse(userInfo);

            socket
              .to(DATA_USER_INFO.socketConectionID)
              .emit("CANCEL-REQUEST-FROM-X-USER", JSON.stringify(MI_USER_DATA));
          });

          socket.on("(SERVER)TEMCHAT-REJECTED-FOR-YOU", (requesterData) => {
            const REQUESTER_DATA = JSON.parse(requesterData);

            socket
              .to(REQUESTER_DATA.socketConectionID)
              .emit("TEMCHAT-REJECTED-FOR-YOU", JSON.stringify(MI_USER_DATA));
          });

          socket.on("(SERVER)TEMCHAT-FINISHED-FOR-YOU", (destinataryUser) => {
            const DESTINATARY_DATA = JSON.parse(destinataryUser);
            socket
              .to(DESTINATARY_DATA.socketConectionID)
              .emit("TEMCHAT-FINISHED-FOR-YOU");
          });

          socket.on("CHANGE-STATE", (state) => {
            temporaryUsersController.changeState(MI_USER_DATA._id, state);
          });

          socket.on("DELETE-USER-FROM-DATABASE", () => {
            temporaryUsersController.deleteTemporaryUser(MI_USER_DATA._id);
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });

    // En caso el usuario se desconecte
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = socketManager;
