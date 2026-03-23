import * as userRepo from "./user.repository";

export const fetchUsers = async () => {
  return userRepo.getAllUsers();
};

export const fetchActiveUsers = async () => {
  return userRepo.getActiveUsers();
};

export const fetchUserById = async (id: number) => {
  return userRepo.getUserById(id);
};
