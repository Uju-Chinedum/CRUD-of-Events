const { Unauthorized } = require("../errors");

const confirmUser = (requestUserId, resourceUserId) => {
  if (requestUserId === resourceUserId.toString()) return;
  throw new Unauthorized(
    "Invalid User",
    "Not authorized to edit this information"
  );
};

module.exports = confirmUser;
