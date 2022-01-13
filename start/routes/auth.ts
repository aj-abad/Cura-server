import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";

Route.post("auth/checkemail", async (ctx) => {
  ctx;
  return Database.from("users").select("*");
});
