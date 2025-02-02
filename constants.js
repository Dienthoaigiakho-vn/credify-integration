const WEBHOOK_EVENTS = {
  OFFER_TX_STATUS_UPDATED: "OFFER_TRANSACTION_STATUS_UPDATED",
  DISPUTE_COMPLETED: "OFFER_TRANSACTION_DISPUTE_STATUS_UPDATED",
  ORDER_STATUS_UPDATED: "BNPL_ORDER_STATUS_UPDATED",
  DISBURSEMENT_STATUS_UPDATED: "BNPL_DISBURSEMENT_REQUIREMENT_STATUS_UPDATED",
};
const CATEGORY = {
  MOBILE_DEVICE: ["Điện thoại"],
  COMPUTER: ["Máy tính bảng", "Macbook"],
  ELECTRONIC_DEVICE: ["Đồng hồ", "Âm thanh", "Phụ kiện"],
};

const CATEGORY_TYPE = {
  MOBILE_DEVICE: "MOBILE_DEVICE",
  COMPUTER: "COMPUTER",
  ELECTRONIC_DEVICE: "ELECTRONIC_DEVICE",
};

const BNPL_ORDER_STATUS = {
  SIGNED: "SIGNED",
  FAILED: "FAILED",
  REJECTED: "REJECTED",
  PAID: "PAID",
};

const CHAT_TELEGRAM_ID = "-860112640";
const TELEGRAM_ACCESS_TOKEN = "5746897807:AAGsl-IGV4Mr-2o3S-CoiubblqD6jAzbnVw";

const DOMAIN_VALID = [
  "https://next.giakho.vn",
  "https://giakho.vn",
  "https://dienthoaigiakho.vn",
];

module.exports = {
  WEBHOOK_EVENTS,
  CATEGORY,
  CATEGORY_TYPE,
  CHAT_TELEGRAM_ID,
  TELEGRAM_ACCESS_TOKEN,
  BNPL_ORDER_STATUS,
  DOMAIN_VALID,
};
