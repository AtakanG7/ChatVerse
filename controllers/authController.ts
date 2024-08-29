import { createUser, verifyUser, getUserByEmail } from '../models/User';
import { sendVerificationEmail } from '../lib/email';

export const registerUser = async (name: string, email: string) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await createUser(name, email);
  await sendVerificationEmail(user.email, user.id);
  return user;
};

export const verifyUserEmail = async (userId: string) => {
  const user = await verifyUser(userId);
  return user;
};