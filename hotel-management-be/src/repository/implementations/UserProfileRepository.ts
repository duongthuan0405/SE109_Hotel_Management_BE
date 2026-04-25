import { type UserProfile } from "../../models/UserProfile.js";
import { type IUserProfileRepository } from "../types/IUserProfileRepository.js";

const mockProfiles: UserProfile[] = [];

const userProfileRepository: IUserProfileRepository = {
  findByEmail: async (email: string): Promise<UserProfile | null> => {
    const profile = mockProfiles.find((p) => p.email === email);
    return profile || null;
  },
  create: async (profile: Omit<UserProfile, "id">): Promise<UserProfile> => {
    const newProfile: UserProfile = {
      ...profile,
      id: Math.random().toString(36).substring(7),
    };
    mockProfiles.push(newProfile);
    return newProfile;
  },
};

export default userProfileRepository;
