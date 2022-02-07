import Redis from "@ioc:Adonis/Addons/Redis";
import UserStatus from "App/Enums/UserStatus";
import PasswordReset from "App/Models/Redis/PasswordReset";
import User from "App/Models/User";

export default class AccountController {
  public async getUserDetails({auth, request, response}){
    const { UserId } = await auth.user!;
    const user = await User.find(UserId);
    if (!user) {
      return response.unauthorized();
    }
    return response.ok(user);
  }
  
  
  public async setup({ auth, request, response }) {
    const { UserId } = await auth.user!;
    const {firstName, lastName, birthDate} = request.all();

    //Check user status from database
    const user = await User.find(UserId);
    user!.FirstName = firstName;
    user!.LastName = lastName;
    user!.UserStatusId = UserStatus.Active;
    await user!.save();
    return response.created();
  }

  public async setMobile({ auth, request, response }) {
    const { UserId } = await auth.user!;
    const mobile = request.input("mobile");

    //Check user status from database
    const user = await User.find(UserId);
    if (!user) {
      return response.unauthorized();
    }
    user.Mobile = mobile;
    await user.save();
    return response.created();
  }

  public async resetPassword({ request, response }) {
    const email = request.input("email");
    const code = request.input("code");
    const newPassword = request.input("password");

    //Check if user exists
    const user = await User.findBy("email", email);
    if (!user || user.UserStatusId !== UserStatus.Active) {
      return response.unauthorized();
    }

    //Check if code is valid
    //TODO add meaningful error message
    const resetPasswordRecord = await Redis.get(`passwordReset:${email}`);
    if (!resetPasswordRecord) return response.unauthorized();
    const resetPasswordRecordObject = <PasswordReset>(
      JSON.parse(resetPasswordRecord)
    );
    if (resetPasswordRecordObject.Code !== code) return response.unauthorized();

    //successful validation
    user.Password = newPassword;
    await user.save();
    return response.ok(null);
  }

  public async updatePassword({ auth, request, response }) {
    const { UserId } = await auth.user!;
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
