import Ws from "App/Services/Ws";

Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", (socket) => {
  const { token } = socket.handshake.auth;
  //TODO authenticate user
  socket.emit("news", { hello: "world" });

  socket.on("my other event", (data) => {
    console.log(data);
  });
});
