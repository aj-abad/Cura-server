import Ws from "App/Services/Ws";
import socketAuthenticate from "App/Modules/SocketAuth";
import User from "App/Models/User";
Ws.boot();

/**
 * Listen for incoming socket connections
 */
Ws.io.on("connection", async (socket) => {
  const { token } = socket.handshake.auth;
  const user: User = await socketAuthenticate(token);
  if (!user) return socket.disconnect(true);
  socket.join(user.UserId);

  socket.emit("news", { hello: "world" });
  socket.on("my other event", (data) => {
    console.log(data);
  });
});
