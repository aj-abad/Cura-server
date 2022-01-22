import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthorizeUserStatus {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    authorizedStatus: number[]
  ) {
    const { UserStatusId } = auth.use("api").user!;
    if (!authorizedStatus.includes(UserStatusId)) {
      return response.unauthorized();
    }
    await next();
  }
}
