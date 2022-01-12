import Route from "@ioc:Adonis/Core/Route";

Route.post("auth/checkemail", async (ctx) => {
  ctx.response.send(true);
});
