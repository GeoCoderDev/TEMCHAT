const socketIo = require("socket.io");
const {
  Types: { ObjectId },
} = require("mongoose");
const temporaryUsersController = require("../components/temporaryUsers/controller");

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

          socket.on(
            "(SERVER)REQUEST-FOR-X-USER",
            (usernameOfUser, type, waitTime) => {
              temporaryUsersController
                .getUserByUsername(usernameOfUser)
                .then((userFound) => {
                  socket
                    .to(userFound.socketConectionID)
                    .emit(
                      "TEMCHAT-REQUEST-FOR-YOU",
                      JSON.stringify(MI_USER_DATA),
                      type,
                      waitTime
                    );
                });
            }
          );

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
