const socketIo = require("socket.io");
const {
  Types: { ObjectId },
} = require("mongoose");
const temporaryUsersController = require("../components/temporaryUsers/controller");

const CustomEvent = require("../utils/CustomEvent(Class)");

const SEGUNDOS_TOLERANCIA = 5.5;

/**
 *
 * @param {Server} server
 */
function socketManager(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    let username_temchat_actual = undefined;

    socket.on("MY-USERNAME", (username) => {
      let MI_USER_DATA;
      temporaryUsersController
        .getUserByUsername(username)
        .then((usuarioEncontrado) => {
          if (!usuarioEncontrado)
            return socket.emit("YOUR-USER-NO-LONGER-EXIST");

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

          const REQUEST_RECEIVED_EVENT = new CustomEvent();

          socket.on("GET-ALEATORY-USER", (pendingRequestsIDs) => {
            let Pending_Requests_IDs = pendingRequestsIDs
              ? JSON.parse(pendingRequestsIDs)
              : [];

            Pending_Requests_IDs = Pending_Requests_IDs.map(
              (request_id) => new ObjectId(request_id)
            );

            temporaryUsersController
              .getAleatoryUser([MI_USER_DATA._id, ...Pending_Requests_IDs])
              .then((usuarioAleatorio) => {
                socket.emit(
                  "TAKE-YOUR-ALEATORY-USER",
                  JSON.stringify(usuarioAleatorio[0])
                );
              })
              .catch((e) => {
                console.error(e);
              });
          });

          socket.on("GET-ALEATORY-MAGNETIC-USER", () => {
            temporaryUsersController
              .getAleatoryUser([MI_USER_DATA._id], 2)
              .then((usuarioAleatorio) => {
                socket.emit(
                  "TAKE-YOUR-MAGNETIC-USER",
                  JSON.stringify(usuarioAleatorio[0])
                );

                if (!usuarioAleatorio[0]) return;

                socket
                  .to(usuarioAleatorio[0].socketConectionID)
                  .emit(
                    "TEMCHAT-REQUEST-ACCEPTED-FOR-YOU",
                    JSON.stringify(usuarioAleatorio[0]),
                    JSON.stringify(MI_USER_DATA)
                  );
              })
              .catch((e) => {
                console.error(e);
              });
          });

          socket.on(
            "(SERVER)REQUEST-FOR-X-USER",
            (usernameOfUser, type, waitTime) => {
              temporaryUsersController
                .getUserByUsername(usernameOfUser)
                .then((userFound) => {
                  if (!userFound)
                    return socket.emit("USER-NO-LONGER-EXIST", usernameOfUser); //Se puede hacer algo todavia aca

                  socket
                    .to(userFound.socketConectionID)
                    .emit(
                      "TEMCHAT-REQUEST-FOR-YOU",
                      JSON.stringify(MI_USER_DATA),
                      type,
                      waitTime
                    );

                  //Promesa de recibimiento
                  const promiseOfReceipt = new Promise((resolve, reject) => {
                    let eventID;

                    eventID = REQUEST_RECEIVED_EVENT.addEventListener(
                      (username) => {
                        if (userFound.username === username) {
                          resolve();
                          if (eventID)
                            REQUEST_RECEIVED_EVENT.removeEventListener(eventID);
                        }
                      }
                    );

                    setTimeout(() => {
                      reject();
                      if (eventID)
                        REQUEST_RECEIVED_EVENT.removeEventListener(eventID);
                    }, SEGUNDOS_TOLERANCIA * 1000);
                  });

                  promiseOfReceipt.catch(() => {
                    temporaryUsersController.setDisconectionsAmount(
                      userFound._id,
                      userFound.disconectionsAmount + 1
                    );
                  });
                });
            }
          );

          socket.on("(SERVER)REQUEST-RECEIVED-WAS-RECEIVED", (username) =>
            REQUEST_RECEIVED_EVENT.dispatchEvent(username)
          );

          socket.on("(SERVER)REQUEST-RECEIVED", (username) => {
            if (!username) return;

            temporaryUsersController
              .getUserByUsername(username)
              .then((userfound) => {
                socket
                  .to(userfound.socketConectionID)
                  .emit("REQUEST-RECEIVED", MI_USER_DATA.username);
              });
          });

          socket.on("(SERVER)CANCEL-REQUEST-FOR-X-USER", (username) => {
            if (!username) return;
            temporaryUsersController
              .getUserByUsername(username)
              .then((user) => {
                if (!user) return console.log("Usuario no encontrado");

                socket
                  .to(user.socketConectionID)
                  .emit(
                    "CANCEL-REQUEST-FROM-X-USER",
                    JSON.stringify(MI_USER_DATA)
                  );
              });
          });

          socket.on("(SERVER)TEMCHAT-REJECTED-FOR-YOU", (username) => {
            temporaryUsersController
              .getUserByUsername(username)
              .then((user) => {
                if (!user) return;

                socket
                  .to(user.socketConectionID)
                  .emit(
                    "TEMCHAT-REJECTED-FOR-YOU",
                    JSON.stringify(MI_USER_DATA)
                  );
              });
          });

          socket.on("(SERVER)TEMCHAT-ACCEPTED-FOR-YOU", (username) => {
            temporaryUsersController
              .getUserByUsername(username)
              .then((user) => {
                if (!user) return;

                socket
                  .to(user.socketConectionID)
                  .emit(
                    "TEMCHAT-REQUEST-ACCEPTED-FOR-YOU",
                    JSON.stringify(user),
                    JSON.stringify(MI_USER_DATA)
                  );
              });
          });

          socket.on(
            "(SERVER)MESSAGE-FOR-YOU",
            (usernameDestinataryUser, content) => {
              temporaryUsersController
                .getUserByUsername(usernameDestinataryUser)
                .then((user) => {
                  if (!user) return;

                  socket
                    .to(user.socketConectionID)
                    .emit("MESSAGE-FOR-YOU", content);
                });
            }
          );

          socket.on("(SERVER)TEMCHAT-FINISHED-FOR-YOU", (username) => {
            console.log(username);
            temporaryUsersController
              .getUserByUsername(username)
              .then((user) => {
                if (!user) return;

                socket
                  .to(user.socketConectionID)
                  .emit("TEMCHAT-FINISHED-FOR-YOU");
              });
          });

          socket.on("SET-TEMCHAT-USERNAME-ACTUAL", (usernameTemchatActual) => {
            username_temchat_actual = usernameTemchatActual;
          });

          socket.on("REMOVE-TEMCHAT-USERNAME-ACTUAL", () => {
            username_temchat_actual = undefined;
          });

          socket.on("CHANGE-STATE", (state) => {
            temporaryUsersController.changeState(MI_USER_DATA._id, state);
          });

          socket.on("DELETE-USER-FROM-DATABASE", () => {
            temporaryUsersController.deleteTemporaryUser(MI_USER_DATA._id);

            if (!username_temchat_actual) return;

            temporaryUsersController
              .getUserByUsername(username_temchat_actual)
              .then((user) => {
                if (!user) return;

                socket
                  .to(user.socketConectionID)
                  .emit("TEMCHAT-FINISHED-FOR-YOU");
              });
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
