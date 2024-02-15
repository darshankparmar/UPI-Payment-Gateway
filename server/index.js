const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Participant = require("./user.model");
const UUID = require("uuid-int");
const axios = require("axios");

const port = process.env.PORT || 8080;
let app = express();

app.use(express.json({ limit: "16mb", extended: true }));
app.use(express.urlencoded({ limit: "16mb", extended: true }));
app.use(cors());

const id = {};

const mongoose = require("mongoose");
const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

mongoose.connect(
	process.env.connectionString,
	connectionOptions,
);
mongoose.Promise = global.Promise;

app.get("/",function(request,response){
    response.send("UPI Payment Gateway")
});

function formatDate(date, format) {
    const ISTOptions = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const ISTDate = date.toLocaleString('en-IN', ISTOptions);
    
    const map = {
        mm: ISTDate.slice(3, 5),
        dd: ISTDate.slice(0, 2),
        yy: ISTDate.slice(8, 10),
        yyyy: ISTDate.slice(6, 10)
    };
    
    return format.replace(/dd|mm|yyyy/gi, (matched) => map[matched]);
}

function stringToDate(dateString) {
    // Split the string into day, month, and year components
    const [day, month, year] = dateString.split('-').map(Number);

    // Create a new Date object with the components
    const date = new Date(year, month - 1, day); // month is 0-based in JavaScript Date objects

    // Set the time zone to Indian Standard Time (IST)
    date.setTime(date.getTime() + (5.5 * 60 * 60 * 1000)); // 5.5 hours ahead for IST (5 hours + 30 minutes)

    return date;
}

String.prototype.shuffle = function () {
	let a = this.split(""),
		n = a.length;

	for (let i = n - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a.join("");
}

async function checkPayment(client_txn_id, txn_date, user) {
	console.log(client_txn_id);
	console.log(txn_date);
	await axios
		.post("https://merchant.upigateway.com/api/check_order_status", {
			client_txn_id,
			txn_date,
			key: process.env.merchant_key,
		})
		.then((res) => {
			const data = res.data;
			// console.log(data);
			if (data.status === true) {
				const info = data.data;
				if (info.status === "success") {
					clearInterval(id[client_txn_id].id);
					user.client_txn_id = data.data.client_txn_id;
                    user.upi_txn_id = data.data.upi_txn_id;
					user.amount = data.data.amount;
                    user.status = true;
					user.txn_date = stringToDate(txn_date);
					create(user);
					delete id[client_txn_id];
				} else if (info.status === "failure" || id[client_txn_id].time >= 100) {
					clearInterval(id[client_txn_id].id);
					user.client_txn_id = data.data.client_txn_id;
                    user.upi_txn_id = data.data.upi_txn_id;
					user.amount = data.data.amount;
                    user.status = false;
					user.txn_date = stringToDate(txn_date);
					create(user);
					delete id[client_txn_id];
				} else {
					id[client_txn_id].time++;
				}
			}
			return res.data;
		})
		.catch((e) => {
			// console.log(e);
		});
}

async function create(user) {
	console.log(user);
	try {
		const participant = new Participant(user);
        await participant.save();
		return true;
	} catch (e) {
		console.log(e);
		return { err: "something went wrong" };
	}
}

app.post("/pay",async function (req, res, next) {
    let payload = req.body.payload;
	payload["key"] = process.env.merchant_key;
	payload["client_txn_id"] = UUID(0).uuid().toString().shuffle();
	payload["p_info"] = "UPI Payment Gateway";
	payload["redirect_url"] = process.env.fronted_url;
	// payload["udf1"] = "user defined field 1 (max 25 char)";
	// payload["udf2"] = "user defined field 2 (max 25 char)";
	// payload["udf3"] = "user defined field 3 (max 25 char)";

	let user = {
		name: payload.customer_name,
		email: payload.customer_email,
		mobileNo: payload.customer_mobile,
	};

    id[payload["client_txn_id"]] = { time: 0 };
	id[payload["client_txn_id"]].id = setInterval(
		async () =>
			await checkPayment(
				payload["client_txn_id"],
				formatDate(new Date(Date.now()), "dd-mm-yyyy"),
				user,
			),
		3000,
	);

	console.log(payload);

	let response = {
		status: true,
		msg: 'Order Created',
		data: {
		  order_id: 73861544,
		  payment_url: 'https://merchant.upigateway.com/gateway/pay/5eee618cc2b3cc69f8a7633ac8241150',
		  upi_id_hash: 'dc8522a14a62c324377cb4482fdb1d605da54bf452b9e535c59e388160994762'
		}
	  };

	// let response = await axios
	// 	.post("https://merchant.upigateway.com/api/create_order", payload)
	// 	.then((res) => {
	// 		console.log(res.data);
	// 		return res.data;
	// 	})
	// 	.catch((e) => {
	// 		console.log(e);
	// 		return e;
	// 	});

	res.json(response);
});

app.post("/payCheck",async function (req, res, next) {
	let payload = req.body;

	if(!payload.client_txn_id || payload.client_txn_id === null) {
		return res.json({ status: false });
	}

	payload["key"] = process.env.merchant_key;
	
    let user = (
		await Participant.find({ client_txn_id: payload.client_txn_id })
	)[0];

	if (!user) {
		return res.json({ status: false });
	}
    
	payload["txn_date"] = formatDate(user.txn_date, "dd-mm-yyyy");
	
	let response = await axios
		.post("https://merchant.upigateway.com/api/check_order_status", payload)
		.then((res) => {
			return res.data;
		})
		.catch((e) => {
			console.log(e);
		});

	response["user"] = user;

	res.json(response);
});

app.get("/getAllUser", async function(req, res, next) {
	let response = await Participant.find({}).sort({'txn_date': -1});
	res.json(response);
});

app.listen(port, function () {
    console.log("Started application on port %d", port)
});