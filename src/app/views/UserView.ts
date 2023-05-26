import User from "../entities/UserEntity";

function renderUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function renderUsers(users: User[]) {
  return {
    users: users.map(renderUser),
  };
}

export default {
  renderUser,
  renderUsers,
};
