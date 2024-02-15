import { Table } from 'react-bootstrap';
import paymentService from "../services/service";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ListOfTransaction() {

    const [users, setUsers] = useState({});

    async function loadData() {
        let response = await paymentService.getAllUser();
        setUsers(response.data);
    }

    useEffect(() => {
        loadData();
    }, []);

    function formatDateTime(dateString) {
        const userDate = new Date(dateString);
        const formattedDate = `${userDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })}, ${userDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        })}`;
    
        return formattedDate;
    }

  return (
    <Table responsive striped bordered hover variant="dark">
      <thead>
        <tr>
          <th key="0">#</th>
          <th key="1">Name</th>
          <th key="2">Email</th>
          <th key="3">Mobile No</th>
          <th key="4">Amount</th>
          <th key="5">Date</th>
          <th key="6">Status</th>
          <th key="7">Client Txn Id</th>
          <th key="8">UPI Txn Id</th>
          <th key="9">View</th>
        </tr>
      </thead>
      <tbody>
        {(users.length > 0) 
        ? 
            users.map((user, index) => {
                return [
                    <tr key={index}>
                        <td key="0">{index+1}</td>
                        <td key="1">{user.name}</td>
                        <td key="2">{user.email}</td>
                        <td key="3">{user.mobileNo}</td>
                        <td key="4">{user.amount}</td>
                        <td key="5">
                            {formatDateTime(user.txn_date)}
                        </td>
                        <td key="6">{(user.status) ? "Success" : "Failed"}</td>
                        <td key="7">{user.client_txn_id}</td>
                        <td key="8">{user.upi_txn_id}</td>
                        <td key="9">
                            <Link to={"/receipt?client_txn_id=" + user.client_txn_id} className="text-white m-0">
                                <i className="fa fa-eye" aria-hidden="true"></i>
                            </Link>
                        </td>
                    </tr>
                ];
            })
        : 
            null
        }
      </tbody>
    </Table>
  )
}

export default ListOfTransaction;