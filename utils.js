const { CATEGORY, CATEGORY_TYPE, DOMAIN_VALID } = require("./constants");
const cors = require("cors");

const formKey = (data) => {
  return `-----BEGIN PRIVATE KEY-----
${data}
-----END PRIVATE KEY-----`;
};

const getCategoryItem = (categoryType) => {
  if (CATEGORY.COMPUTER.includes(categoryType)) {
    return CATEGORY_TYPE.COMPUTER;
  }

  if (CATEGORY.MOBILE_DEVICE.includes(categoryType)) {
    return CATEGORY_TYPE.MOBILE_DEVICE;
  }

  if (CATEGORY.ELECTRONIC_DEVICE.includes(categoryType)) {
    return CATEGORY_TYPE.ELECTRONIC_DEVICE;
  }
  return "";
};

const mapCategoryFromOrderLine = (orderLines) => {
  if(!orderLines) return [];

  const result = JSON.parse(JSON.stringify(orderLines));

  return result.map((orderLine) => {
    orderLine.category = getCategoryItem(orderLine.category);
    return orderLine;
  });
};

const allowCrossDomain = (req, res, next) => {
  const originUrl = req.get("origin");
  return cors({
    origin: DOMAIN_VALID.includes(originUrl),
  })(req, res, next);
};

module.exports = {
  formKey,
  getCategoryItem,
  mapCategoryFromOrderLine,
  allowCrossDomain,
};
