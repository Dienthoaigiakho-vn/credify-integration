const { Router } = require("express")
const { Credify } = require("@credify/nodejs")
const { formKey } = require("./utils")
const {WEBHOOK_EVENTS} = require("./constants");

const signingKey = ""
const apiKey = ""
const mode = "sandbox" // "sandbox" or "production"
const apiDomain = "https://example.com"
const bnplCallbackUrl = "https://example.com"

module.exports = () => {
  const api = Router()

  api.get("/", (req, res) => {
    res.status(200).json({ message: "OK" })
  })

  api.post("/orders", async (req, res) => {
    // TODO: Please update this request body

    // This should be string
    const referenceId = req.reference_id

    /**
     * {Object}
     * @example
     * {
     *   "value": "9000000",
     *   "currency": "VND"
     * }
     */
    const totalAmount = req.total_amount

    /**
     * {Array<Object>}
     * @example
     * [
     *   {
     *     "name": "iPhone 12",
     *     "reference_id": "iphone-12-black",
     *     "image_url": "https://www.apple.com/v/iphone-12/j/images/specs/finish_iphone12__ctf4hoqpbnki_large_2x.jpg",
     *     "product_url": "https://www.apple.com/vn/iphone-12/specs/",
     *     "quantity": 1,
     *     "unit_price": {
     *       "value": "9000000",
     *       "currency": "VND"
     *     },
     *     "subtotal": {
     *       "value": "9000000",
     *       "currency": "VND"
     *     },
     *     "measurement_unit": "EA"
     *   }
     * ]
     */
    const orderLines = req.order_lines

    // This is a recipient bank account info
    /**
     * {Object}
     * @example
     * {
     *   "name": "Apple VN",
     *   "number": "190123123123",
     *   "branch": "",
     *   "bank": "Techcombank"
     * }
     */
    const paymentRecipient = {
      name: "Demo store",
      number: "xxxxxxxxxxx",
      branch: "",
      bank: "XXX Bank",
      type: "BANK_ACCOUNT"
    }

    try {
      const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
      const data = await credify.bnpl.createOrder(
        referenceId,
        totalAmount,
        orderLines,
        paymentRecipient
      )
      res.json(data)
    } catch (e) {
      res.status(400).json({ error: { message: e.message } })
    }
  })

  api.post("/simulate", async (req, res) => {
    const productType = "consumer-financing:unsecured-loan:bnpl"

    // TODO: Please update this request body

    // This should be string array (can be empty)
    const providerIds = req.body.provider_ids

    // This should be an object
    /**
     * {
     *   "market_id": "",
     *   "transaction_amount": {
     *     "value": "1200000",
     *     "currency": "VND"
     *   },
     *   "loan_tenor": {
     *     "value": 30,
     *     "unit": "DAY"
     *   },
     *   "disbursement_date": "2022-12-25",
     *   "product": {
     *     "manufacturer": "",
     *     "category": "",
     *     "name": ""
     *   },
     *   "down_payment": {
     *     "value": "200000",
     *     "currency": "VND"
     *   }
     * }
     */
    const inputs = req.body.inputs

    try {
      const credify = await Credify.create(formKey(signingKey), apiKey, { mode })
      const response = await credify.offer.simulate(productType, providerIds, inputs)
      res.json(response)
    } catch (e) {
      res.status(400).json({ error: { message: e.message } })
    }
  })

  api.post("/webhook", async (req, res) => {
    try {
      const credify = await Credify.create(formKey(signingKey), apiKey, { mode })

      // Validate Webhook request
      const signature = req.headers["signature"] || req.headers["Signature"];
      if (!signature) {
        return res.status(401).send({ message: "Unauthorized" })
      }
      const eventId = req.headers["X-Event-Id"] || req.headers["x-event-id"];
      if (!eventId) {
        return res.status(401).send({ message: "Unauthorized" })
      }
      const timestamp = req.headers["X-Event-Timestamp"] || req.headers["x-event-timestamp"];
      if (!timestamp) {
        return res.status(401).send({ message: "Unauthorized" })
      }

      const trimmedDomain = apiDomain.endsWith("/") ? apiDomain.slice(0, -1) : apiDomain;
      const webhookEndpoint = `${trimmedDomain}/v1/webhook`;
      const valid = await credify.auth.verifyWebhook(signature, req.body, webhookEndpoint, eventId, timestamp);
      if (!valid) {
        return res.status(401).send({ message: "Unauthorized" })
      }

      // Handle webhook

      let orderId;
      switch (req.body.type) {
        case WEBHOOK_EVENTS.OFFER_TX_STATUS_UPDATED:
          // Offer status is updated
          break
        case WEBHOOK_EVENTS.DISPUTE_COMPLETED:
          // Dispute status is updated
          break
        case WEBHOOK_EVENTS.ORDER_STATUS_UPDATED:
          // BNPL order is updated
          orderId = req.body.order_id;
          const status = req.body.order_status;
          // TODO: BNPL order status is updated
          break
        case WEBHOOK_EVENTS.DISBURSEMENT_STATUS_UPDATED:
          // BNPL disbursement docs are confirmed
          break
        default:
          break
      }

    } catch (e) {
      res.json({ error: { message: e.message } })
    }
  })

  api.get("/bnpl/orders/:orderId/redirect", async (req, res) => {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.sendStatus(500).json({ message: "No order ID" })
    }
    res.redirect(bnplCallbackUrl)
  })

  return api
}