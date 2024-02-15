import '../assets/receipt.css';
import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import paymentService from "../services/service";
import { useReactToPrint } from "react-to-print";
import { Row, Col, Container, Button } from 'react-bootstrap';

function Receipt() {

    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			try {

				let response = await paymentService.payCheck(
					searchParams.get("client_txn_id"),
				);
				let data = response.data;
				setData(data);
			} catch (e) {
				console.log(e);
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, [searchParams]);

    const componentRef = useRef();
	const printSuccessReceipt = useReactToPrint({
		content: () => componentRef.current,
	});

    return (
        <div className="receipt componentHeight">
			{isLoading && <p>Loading...</p>}
			{!isLoading && data.status === false && (
				<div className="container-404-page">
					<h1>404</h1>
					<h2>Page Not Found</h2>
					<p>
						The Page you are looking for doesn`t exist or an other error
						occurred. Go to{" "}
						<Link to="/" className="m-0">
							Home
						</Link> 
                        {" "}or
                        refresh page.
					</p>
				</div>
			)}
			{!isLoading &&
				data &&
				data.msg === "Transaction found" &&
				!data.data.upi_txn_id && (
					<Container className="tra-fail-box my-5 card p-3" ref={componentRef}>
						<div className="notify-failbox d-flex">
							<h1 className="success-msg">Transaction Failed</h1>
							<span className="alertIcon mx-2">
								<i className="fa-solid fa-circle-exclamation"></i>
							</span>
							<br />
						</div>
                        <hr />
						<small>
							The transaction failed due to a technical error. <br />
							If your money was debited, you should get refund within the next 7
							days.
						</small>
						<hr />
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Name</Col>
							<Col>{data.data.customer_name}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Email</Col>
							<Col>{data.user.email}</Col>
						</Row>
                        <Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Mobile No</Col>
							<Col>{data.user.mobileNo}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Amount</Col>
							<Col>{data.data.amount}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">client_txn_id</Col>
							<Col>{data.data.client_txn_id}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Date</Col>
							<Col>
								{new Date(data.user.txn_date).toString()}
							</Col>
						</Row>
						<hr />
						<div className="tran-table-buttons text-center">
							<Button
								variant="primary"
								className="mx-2"
								onClick={printSuccessReceipt}
							>
								Print
							</Button>
							<Button variant="primary" className="mx-2">
								<Link to="/" className="text-white m-0">
									Home
								</Link>
							</Button>
						</div>
					</Container>
				)}
			{!isLoading &&
				data &&
				data.msg === "Transaction found" &&
				data.data.upi_txn_id && (
					<Container
						className="tra-success-box my-5 card p-3"
						id="tra-success-box"
						ref={componentRef}
					>
						<div className="notify-successBox d-flex">
							<h1 className="success-msg">Transaction Successful!</h1>
							<span className="alertIcon mx-2">
								<i className="fa-solid fa-circle-check"></i>
							</span>
							<br />
						</div>
						<hr />
						<p style={{ margin: 0 }}>
							Stay connected with me
						</p>
						<p className="text-center" style={{ margin: 0 }}>
							<a
								href="https://www.youtube.com/DarshanParmarK"
								target="_blank"
								className="social-link"
							>
								@darshankparmar
							</a>
						</p>
						<hr />
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Payee Name</Col>
							<Col>{data.data.customer_name}</Col>
						</Row>
                        <Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Payee VPN</Col>
							<Col>{data.data.customer_vpa}</Col>
						</Row>
                        <Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Name</Col>
							<Col>{data.user.name}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Email</Col>
							<Col>{data.user.email}</Col>
						</Row>
                        <Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Mobile No</Col>
							<Col>{data.user.mobileNo}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Amount</Col>
							<Col>{data.data.amount}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">client_txn_id</Col>
							<Col>{data.data.client_txn_id}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">upi_txn_id</Col>
							<Col>{data.data.upi_txn_id}</Col>
						</Row>
						<Row className="tran-table-row my-2">
							<Col className="tran-table-col-1">Transaction Date</Col>
							<Col>{new Date(data.user.txn_date).toString()}</Col>
						</Row>
						<hr />
						<div className="tran-table-buttons text-center">
							<Button
								variant="primary"
								className="mx-2"
								onClick={printSuccessReceipt}
							>
								Print
							</Button>
							<Button variant="primary" className="mx-2">
								<Link to="/" className="text-white m-0">
									Home
								</Link>
							</Button>
						</div>
					</Container>
				)}
		</div>
    )
}

export default Receipt