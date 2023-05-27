const isTest = () => ["tst", "test"].includes(process.env.NODE_ENV || "");

const isProduction = () =>
  ["prod", "production"].includes(process.env.NODE_ENV || "");

export default { isTest, isProduction };
