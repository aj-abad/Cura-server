import Redis from "@ioc:Adonis/Addons/Redis";
import User from "App/Models/User";
import { base64 } from "@ioc:Adonis/Core/Helpers";

export default async function socketAuthenticate(
  token: string
): Promise<User | null> {
  const encodedTokenId = token?.replace("Bearer ", "")?.split(".")?.[0];
  if (!encodedTokenId) return null;
  const tokenId = base64.urlDecode(encodedTokenId);
  const userStr = await Redis.get(`api:${tokenId}`);
  if (!userStr) return null;
  const { user_id: userId } = JSON.parse(userStr);
  return User.find(userId);
}
