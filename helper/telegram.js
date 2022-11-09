const { TelegramClient } = require("messaging-api-telegram");
const {
  CHAT_TELEGRAM_ID,
  TELEGRAM_ACCESS_TOKEN,
  BNPL_ORDER_STATUS,
} = require("../constants");

const client = new TelegramClient({
  TELEGRAM_ACCESS_TOKEN,
});

async function sendTelegramMessage(status, orderId, referenceId) {
  let message = "";
  switch (status) {
    case BNPL_ORDER_STATUS.APPROVED:
      message = `Xin chúc mừng! ${orderId} với mã tham chiếu ${referenceId} đã được COMB chấp nhận hồ sơ thẩm định vay. Vui lòng xác nhận với khách hàng để xác nhận và tải lên tài liệu xin giải ngân.`;
      break;
    case BNPL_ORDER_STATUS.CANCELED:
      message = `${orderId} với mã tham chiếu ${referenceId}  đã không được COMB chấp nhận hồ sơ thẩm định vay.`;
      break;
    case BNPL_ORDER_STATUS.PAID:
      message = `${orderId} với mã tham chiếu ${referenceId} đã được COMB giải ngân thành công.`;
      break;
    default:
      return;
  }
  await client.sendMessage(CHAT_TELEGRAM_ID, message);
}

module.exports = {
  sendTelegramMessage,
};
