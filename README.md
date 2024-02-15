# UPI Payment Gateway

  **https://youtu.be/Xlg78BR7krg**

## Tech 
MERN Stack

👉 Download the zip file or clone this repository

👉 Extract the file and open **UPI-Payment-Gateway** folder in visual studio code

## Client-side 

👉 change baseUrl in config.js file in **UPI-Payment-Gateway\client\upi-payment-gateway** folder

👉 baseUrl is your server(backend) url.

👉 Run this command
  
    npm install

👉 Run this command for Start Project
  
    npm run dev

## Server-side

👉 create .env file in **UPI-Payment-Gateway\server** folder(copy of .eve.sample file)

    PORT=10000
    merchant_key={write your merchant key of https://upigateway.com/}
    fronted_url=https://www.mitramgroup.in/receipt
    connectionString=mongodb://localhost:27017/upiPaymentGateway

👉 fronted_url means it is redirect url for payment gateway. localhost not working for that that's why enter random any site for testing.

👉 for generate merchant_key, all steps written below.

👉 Run this command
  
    npm install

👉 Run this command for Start Project
  
    npm start

##  Generate Merchant Key

👉 open given site and create new account or login with existing account.
   
   **https://upigateway.com**

👉 for first time login you get TRIAL plan for 1 week.

👉 now click on Connect Merchant and connect any merchant account of your.

👉 now click on Connect Merchant and connect any merchant account of your.

👉 for connect merchant account, you need staff account of that merchant. all steps for create that account are given in their site.

👉 After Successfully done all above step, open API Keys tab.

👉 Copy API Key and paste in .env file for merchant key.

## Download Node JS : 

  **https://nodejs.org/en/download/**

## Download MongoDB Compass : 

  **https://www.mongodb.com/try/download/compass**

## Youtube Channel : 
 
  **https://www.youtube.com/DarshanParmarK**
