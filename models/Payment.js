import { DataTypes } from "sequelize";
import { database } from "../util/util.js";

/**
 * Payment Model
 */
const Payment = database.define("payment", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Payment;
