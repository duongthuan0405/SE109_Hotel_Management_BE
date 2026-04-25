import { type UserProfile } from "../../models/UserProfile.js";

export type IUserProfileRepository = {
  findByEmail(email: string): Promise<UserProfile | null>;
  create(profile: Omit<UserProfile, "id">): Promise<UserProfile>;
};
