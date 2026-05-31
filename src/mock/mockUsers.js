import { USER_ROLES, USERS_KEY } from "../utils/constants";

export const defaultMockUsers = [
  {
    id: "user-admin",
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "admin123",
    role: USER_ROLES.ADMIN,
    department: "Operations"
  },
  {
    id: "user-001",
    name: "Demo User",
    email: "user@demo.com",
    password: "user123",
    role: USER_ROLES.USER,
    department: "Client Success"
  }
];

export const mockUsers = defaultMockUsers;

function canUseLocalStorage() {
  return typeof localStorage !== "undefined";
}

function normalizeUsers(users) {
  if (!Array.isArray(users)) return [];
  return users.filter((user) => user?.id && user?.email);
}

function uniqueByEmail(users) {
  const seen = new Set();
  return users.filter((user) => {
    const email = user.email.toLowerCase();
    if (seen.has(email)) return false;
    seen.add(email);
    return true;
  });
}

export function getRegisteredUsers() {
  if (!canUseLocalStorage()) return [];

  try {
    return normalizeUsers(JSON.parse(localStorage.getItem(USERS_KEY) || "[]"));
  } catch (error) {
    localStorage.removeItem(USERS_KEY);
    return [];
  }
}

export function getMockUsers() {
  return uniqueByEmail([...defaultMockUsers, ...getRegisteredUsers()]);
}

export function saveRegisteredUser(user) {
  if (!canUseLocalStorage()) return user;

  const registeredUsers = getRegisteredUsers();
  const nextUsers = uniqueByEmail([
    ...registeredUsers.filter((item) => item.email.toLowerCase() !== user.email.toLowerCase()),
    user
  ]);

  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  return user;
}

export function initializeMockUsers() {
  if (!canUseLocalStorage()) return getMockUsers();

  const registeredUsers = getRegisteredUsers();
  localStorage.setItem(USERS_KEY, JSON.stringify(uniqueByEmail(registeredUsers)));
  return getMockUsers();
}
