import UserStatus from "App/Enums/UserStatus";
import User from "App/Models/User";

export default class AccountController {
  public async setup({ auth, request, response }) {
    const { UserId } = await auth.getUser();
    const firstName = request.input("firstName");
    const lastName = request.input("lastName");
    const mobile = request.input("mobile");

    //Check user status from database
    const user = await User.find(UserId);
    user!.FirstName = firstName;
    user!.LastName = lastName;
    if (mobile) user!.Mobile = mobile;
    user!.UserStatusId = UserStatus.Active;
    await user!.save();
    return response.created();
  }

  public async resetPassword({ auth, request, response }) {
    const { UserId } = await auth.getUser();
    const newPassword = request.input("password");

    //Check user status from database
    const user = await User.find(UserId);
    if (!user) {
      return response.unauthorized();
    }
    user.Password = newPassword;
    await user.save();
    return response.created();
  }

  public async updatePassword({ auth, request, response }) {
    const { UserId } = await auth.getUser();
    const currentPassword = request.input("currentPassword");
    const newPassword = request.input("newPassword");

    //Check user status from database
    const user = await User.find(UserId);
    if (!user) {
      return response.unauthorized();
    }
    if (user.Password !== currentPassword) {
      return response.unauthorized();
    }
    user.Password = newPassword;
    await user.save();
    return response.created();
  }
}
