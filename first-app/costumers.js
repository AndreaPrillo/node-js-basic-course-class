class CustomerManager {
    constructor() {
        this.customers = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `Customer${i + 1}`
        }));
    }

    getCustomers() {
        return this.customers;
    }

    setCustomers(newCustomers) {
        this.customers = newCustomers;
    }

    getRandomCustomer() {
        const randomIndex = Math.floor(Math.random(20) * this.customers.length);
        return this.customers[randomIndex];
    }

}

module.exports = CustomerManager;