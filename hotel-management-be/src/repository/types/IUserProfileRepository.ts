import { type UserProfile } from "../../models/UserProfile.js";

export type IUserProfileRepository = {
  findByUserId(userId: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  create(profile: Omit<UserProfile, "id">): Promise<UserProfile>;
  save(profile: UserProfile): Promise<void>;
};
