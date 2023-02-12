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

const getCurrentDate = () => {
  return new Date();
};

module.exports = { validateRequired, getCurrentDate };
