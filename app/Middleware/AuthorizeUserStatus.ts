import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthorizeUserStatus {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    authorizedStatus: any[]
  ) {
    const authorized: number[] = authorizedStatus.map((status) =>
      parseInt(status.toString())
    );
    const { UserStatusId } = await User.findOrFail(auth.user?.UserId);

    if (!authorized.includes(UserStatusId)) {
      return response.unauthorized({
        errorMessage: "You are not authorized to perform this action",
      });
    }
    await next();
  }
}
  