import dotenv from "dotenv";
dotenv.config();

export default {
  EBAY_APP_ID: process.env.EBAY_APP_ID,
  EBAY_CERT_ID: process.env.EBAY_CERT_ID,
  EBAY_DEV_ID: process.env.EBAY_DEV_ID,
  EBAY_RU_NAME: process.env.EBAY_RU_NAME,
};
