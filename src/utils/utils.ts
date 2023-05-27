const isTest = () => ["tst", "test"].includes(process.env.NODE_ENV || "");

const isProduction = () =>
  ["prod", "production"].includes(process.env.NODE_ENV || "");

const roundDecimalPlaces = (num: number, decimalPlaces: number = 2) => {
  const powerDecimalPlaces = 10 ** decimalPlaces;
  return (
    Math.round((num + Number.EPSILON) * powerDecimalPlaces) / powerDecimalPlaces
  );
};

const dateToMySqlFormat = (date: Date | string) => {
  if (!date) return;

  const time = new Date(date).getTime() + 500;
  return new Date(time).toISOString().slice(0, 19).replace("T", " ");
};

export default {
  isTest,
  isProduction,
  roundDecimalPlaces,
  dateToMySqlFormat,
};
