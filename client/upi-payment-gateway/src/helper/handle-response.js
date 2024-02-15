function handleResponse(err) {
	console.log(err);
	const response = err.response;
	const data = response.data;
	console.log(data);

	return Promise.reject(data);
}

export default handleResponse;