const { BadRequestError } = require("../expressError");

/** Turn an object of user data to update into a SQL query
 * 
 * Object keys are names of columns to be updated
 * jsToSql paramter is a "dictionary" that relates user paraments to column names
 * 
 * Consturct query by taking all keys (column names) and setting them equal to their index, plus one, to account for zero indexing
 * 
 * Each column is then joined into a string to make the query
 * The updated values are stored in their own array
 * 
 * Together they are used to make the complete query
 * 
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  // throw error if no data present
  if (keys.length === 0) throw new BadRequestError("No data");

  // replace postalColde with postal_code, (also for minTemp and maxTemp) otherwise use the provided column name
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate)
  }
}

module.exports = sqlForPartialUpdate;