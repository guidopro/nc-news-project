const db = require("../db/connection");
const format = require("pg-format");

const checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);
  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return false;
    // resource DOES exist
  } else return true;
};

module.exports = checkExists;
