const moment = require("moment");

const validateRequired = (fields, body, res) => {
  const invalidFields = fields.filter((f) => !body[f]);
  if (!!invalidFields.length) {
    return res
      .status(500)
      .send(
        `${invalidFields.join(", ")} ${
          invalidFields?.length > 1 ? " are " : " is "
        } required!`
      );
  }
  return;
};

const formatDate = (d = new Date()) => {
  return moment(d).format("YYYY-MM-DD[T00:00:00.000Z]");
};

const QueryBuilder = (query, fields) => {
  const availableKeys = Object.keys(fields);
  if (!query) return null;
  let result = {};

  for (const key in query) {
    const value = safeJSONParse(query[key]);
    const type = availableKeys[key];

    if (Array.isArray(value)) {
      result = { ...result, ...handleArrayQuery(key, value, type) };
    } else {
      result = { ...result, ...handleObjectQuery(key, value, type) };
    }
  }

  //exceptions
  //should have done camelCase on keys because of this operators implementation (created_at_gt / created_at_lt)
  if (result.createdAt) {
    const { createdAt, ...others } = result;
    result = { ...others, created_at: createdAt };
  }

  return { ...result };
};

const handleArrayQuery = (key, array) => {
  const [param, operator] = key.split("_");

  if (!operator)
    return {
      [key]: {
        $in: [...array],
      },
    };

  const Operator = operator
    ? `$${operator === "like" ? "regex" : operator}`
    : `$eq`;
  let value = type === "Date" ? array.map((e) => formatDate(e)) : array;
  switch (operator) {
    case "like":
      value = array.map((e) => {
        return { [Operator]: `^${e}` };
      });
      break;
    default:
      value = array.map((e) => {
        return { [Operator]: `${e}` };
      });
      break;
  }

  return {
    [param]: {
      $in: [...value],
    },
  };
};

const handleObjectQuery = (key, object, type) => {
  const [param, operator] = key.split("_");
  const Operator = operator
    ? `$${operator === "like" ? "regex" : operator}`
    : `$eq`;

  let value = type === "Date" ? formatDate(object) : object;
  switch (operator) {
    case "like":
      value = `^${object}`;
      break;
    default:
      value = object;
      break;
  }

  return { [param]: { [Operator]: value } };
};

const safeJSONParse = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
};

const handleComplexSearchQuery = (search, searchKeys = []) => {
  //could possibly make an integration with some AI API (maybe chatgpt search for a more accurate text)
  //or
  //implement some king of an elastic search?!? still searching for a better solution

  //this is an amateur solution i think
  //In the example: "I lost my iphone XS", it doesn't return only the Iphone XS
  //it will search for color, brand and name that contains some of the words of the sentence

  const keywords = search.split(" ").map((e) => new RegExp(e));
  const result = searchKeys.map((k) => ({ [k]: keywords }));

  return { $or: [...result] };
};

module.exports = {
  validateRequired,
  formatDate,
  QueryBuilder,
  handleComplexSearchQuery,
};
