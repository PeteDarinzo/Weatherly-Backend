const sqlForPartialUpdate = require("./sql");

let dataToUpdate = { postalCode: "11111", countryCode: "US" };

const jsToSql = {
  postalCode: "postal_code",
  countryCode: "country_code"
};

/************************************** update */

describe("sqlForPartialUpdate", function () {
  test("works", function () {
    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(setCols).toEqual('"postal_code"=$1, "country_code"=$2');
    expect(values).toEqual(["11111", "US"]);
  });
});