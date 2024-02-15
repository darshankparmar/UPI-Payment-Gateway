import axios from "axios";
import handleResponse from "../helper/handle-response";

const paymentService = {
    pay,
    payCheck,
	getAllUser
};

async function pay(payload) {
	return axios
		.post("/pay", payload)
		.catch(handleResponse)
		.then((res) => res.data);
}

async function payCheck(txn_id) {
	return axios
		.post("/payCheck", {"client_txn_id":txn_id})
		.catch(handleResponse)
		.then((res) => res);
}

async function getAllUser() {
	return axios
		.get("/getAllUser")
		.catch(handleResponse)
		.then((res) => res);
}

export default paymentService;