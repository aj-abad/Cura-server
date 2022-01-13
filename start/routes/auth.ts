import Route from "@ioc:Adonis/Core/Route";

Route.post("auth/checkemail", async (ctx) => {
  console.log(ctx.request.body().email);
  return true;
});
