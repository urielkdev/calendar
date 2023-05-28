import User from "../entities/UserEntity";

import utils from "../../utils/utils";

function renderUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: utils.dateToMySqlFormat(user.createdAt),
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
    totalHours: utils.roundDecimalPlaces(user.totalHours),
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
