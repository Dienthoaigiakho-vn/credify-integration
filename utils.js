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

const buildPostIntentsPayload = (req) => {
  /**
   * Required if type is OFFER.
   * {Enum} "BNPL" | "OFFER"
   * @example BNPL
   */
  const type = req.body.type;

  const bnplOrder = {
    ...req.body.bnpl_order,
    order_lines: mapCategoryFromOrderLine(req.body.bnpl_order.order_lines),
  };
  console.log("bnplOrder", mapCategoryFromOrderLine(req.body.bnpl_order.order_lines));
  /**
   * Required if type is OFFER.
   * {object}
   * @example
   *  {
      "offer_code": "string",
      "product_code": "string"
    }
  */
  const offer = null;

  /**
   * Required if type is OFFER.
   * {object}
   * @example
   *   {
        "id": "string",
        "credify_id": "38e67621-b57e-4eb1-b2ae-66eb3f9817f0",
        "name": "string",
        "email": "string",
        "phone": {
        "phone_number": "string",
        "country_code": "+84"
        },e"
        "gender": "male"
    }
  */

  /**
   * Required if type is OFFER.
   * {Object<UserInfo>}
   * @example
   *   {
        "id": "string",
        "credify_id": "38e67621-b57e-4eb1-b2ae-66eb3f9817f0",
        "name": "string",
        "email": "string",
        "phone": {
        "phone_number": "string",
        "country_code": "+84"
        },e"
        "gender": "male"
    }
  */
  const user = req.body.user;

  /**
   * {Object<ServiceInfo>}
   * @example
   *  {
        "available_provider_ids": [
          "497f6eca-6276-4993-bfeb-53cbbbba6f08"
        ],
        "available_product_codes": [
          "string"
        ],
        "available_offer_codes": [
          "string"
        ],
        "product_code": "string",
        "offer_code": null,
        "package_code": "string",
        "ui": {
          "theme": {},
          "locale": "vi-VN"
        }
      }
  */
  const service = req.body.service;

  return { type, bnplOrder, offer, service, user };
};

module.exports = {
  formKey,
  getCategoryItem,
  mapCategoryFromOrderLine,
  allowCrossDomain,
  buildPostIntentsPayload,
};
