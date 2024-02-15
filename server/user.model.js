const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
	name: { type: String },
	email: { type: String },
	mobileNo: { type: String },
	amount: { type: String },
	upi_txn_id: { type: String },
	client_txn_id: { type: String },
    status: { type: Boolean },
	txn_date: { type: Date },
});

module.exports = mongoose.model("Participant", schema);