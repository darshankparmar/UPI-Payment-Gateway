function authHeader() {
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",

		"Access-Control-Allow-Headers": "*",
		"Access-Control-Allow-Methods": "*",
	};
	
	return headers;
}

export default authHeader;
