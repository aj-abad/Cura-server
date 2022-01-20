import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import User from "App/Models/User";

export default class AuthorizeUserStatus {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    authorizedStatus: number[]
  ) {
    const userId = request.input("userId");
    const { UserStatusId } = await User.findOrFail(userId);
    if (!authorizedStatus.includes(UserStatusId)) {
      return response.unauthorized();
    }

    await next();
  }
}
