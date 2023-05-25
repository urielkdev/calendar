export const isProduction = () =>
  ["prod", "production"].includes(process.env.NODE_ENV || "");
