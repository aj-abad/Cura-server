import Redis from "@ioc:Adonis/Addons/Redis";
import User from "App/Models/User";
import { base64 } from "@ioc:Adonis/Core/Helpers";

export default async function socketAuthenticate(token: string): Promise<User> {
  const encodedTokenId = token?.replace("Bearer ", "")?.split(".")?.[0];
  if (!encodedTokenId) throw new Error("Invalid token.");
  const tokenId = base64.urlDecode(encodedTokenId);
  const userStr = await Redis.get(`api:${tokenId}`);
  if (!userStr) throw new Error("Invalid token.");
  const { user_id: userId } = JSON.parse(userStr);
  return User.findOrFail(userId);
}
