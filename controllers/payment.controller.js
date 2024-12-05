import axios from "axios";
import crypto from "crypto";

function generateChecksum(payload, saltKey, saltIndex) {
  // Step 1: Base64 encode the JSON payload
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

  // Step 2: Concatenate the required components
  const concatenatedString = base64Payload + "/pg/v1/pay" + saltKey;

  // Step 3: Generate the SHA-256 hash
  const hash = crypto
    .createHash("sha256")
    .update(concatenatedString)
    .digest("hex");

  // Step 4: Append "###" and the salt index
  return `${hash}###${saltIndex}`;
}

class PaymentController {
  async newPayment(req, res) {
    try {
      const merchantTransactionId = "M" + Date.now();
      const data = {
        merchantId: "M110NES2UDXSUAT",
        merchantTransactionId: merchantTransactionId,
        merchantUserId: "MUID",
        name: "name",
        amount: 10000,
        redirectUrl: `${process.env.BACKEND_URL}/api/payment/status/${merchantTransactionId}`,
        redirectMode: "GET",
        mobileNumber: 9999999999,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };
      const payload = JSON.stringify(data);
      const payloadMain = Buffer.from(payload).toString("base64");
      const keyIndex = 2;
      const string =
        payloadMain + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
      const sha256 = crypto.createHash("sha256").update(string).digest("hex");
      const checksum = sha256 + "###" + "1";
      const prod_URL =
        "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
      const options = {
        method: "POST",
        url: prod_URL,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        data: {
          request: payloadMain,
        },
      };
      console.log(merchantTransactionId);
      axios
        .request(options)
        .then(function (response) {
          // redirect to the payment page
          return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        success: false,
      });
    }
  }

  async checkStatus(req, res) {
    const merchantTransactionId = req.params["txnId"];
    const merchantId = "M110NES2UDXSUAT";
    const keyIndex = 1;
    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
      process.env.PHONEPE_SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;
    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${merchantId}`,
      },
    };
    
    axios
      .request(options)
      .then(async (response) => {
        if (response.data.success === true) {
          console.log(response.data);
          return res.redirect(`${process.env.FRONTEND_URL}/payment/success`);
        } else {
          return res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ msg: err.message });
      });
  }
}

export default new PaymentController();
