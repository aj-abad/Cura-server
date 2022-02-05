import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthorizeUserStatus {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    authorizedStatus: any[]
  ) {
    const authorized: number[] = authorizedStatus.map((status) => parseInt(status.toString()));
    const { UserStatusId } = auth.use("api").user!;
    if (!authorized.includes(UserStatusId)) {
      return response.unauthorized({
        errorMessage: "You are not authorized to perform this action",
      });
    }
    await next();
  }
}
