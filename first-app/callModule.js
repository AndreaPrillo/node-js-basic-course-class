const customerManager = require('./costumers');

const customerManager1 = new customerManager()


function callCustomer() {
    const customer = customerManager1.getRandomCustomer();
    console.log(`Called customer: ${customer.name}`);
}

 function startCalling() {
    setInterval(callCustomer, 5000);
}



module.exports = {
    startCalling
};