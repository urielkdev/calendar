import User from "../entities/UserEntity";

function renderUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function renderUsers(users: User[]) {
  return {
    users: users.map(renderUser),
  };
}

function renderUserWithAccumulatedShiftLength(
  user: User & { totalHours: number }
) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    totalHours: user.totalHours,
  };
}

function renderUsersWithAccumulatedShiftLength(
  users: (User & { totalHours: number })[]
) {
  return {
    users: users.map(renderUserWithAccumulatedShiftLength),
  };
}

export default {
  renderUser,
  renderUsers,
  renderUsersWithAccumulatedShiftLength,
};
