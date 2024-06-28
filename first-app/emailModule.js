const customerManager = require('./costumers');

const customerManager1 = new customerManager()

function emailCustomer() {
    const customer = customerManager1.getRandomCustomer();
    console.log(`Sent email to customer: ${customer.name}`);
}

 function startEmailing() {
    setInterval(emailCustomer, 10000);
}

module.exports = {
    startEmailing
};