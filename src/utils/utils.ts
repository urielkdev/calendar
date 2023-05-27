const isProduction = () =>
  ["prod", "production"].includes(process.env.NODE_ENV || "");

export default { isProduction };
