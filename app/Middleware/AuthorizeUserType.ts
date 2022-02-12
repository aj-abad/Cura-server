import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthorizeUserType {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    authorizedType: any[]
  ) {
    const authorized: number[] = authorizedType.map((status) =>
      parseInt(status.toString())
    );
    const { UserTypeId } = auth.use("api").user!;
    if (!authorized.includes(UserTypeId)) {
      return response.unauthorized({
        errorMessage: "You are not authorized to perform this action",
      });
    }
    await next();
  }
}
