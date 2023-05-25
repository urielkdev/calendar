import User from "../app/models/User";

export default {
  renderUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  },
};
