const mathUtils = require("./math-utils");

console.log("Program will be blocked :(");

request1(2, 1000, 10);

console.log("Now, I'm able to do other works");
otherRequests();

function otherRequests() {
    setInterval(() => {
        console.log("other requests...");
    }, 1000);
}

 function request1(start, end, chunkSize) {
    let primes = [];
    console.log("**start calc prime numbers**");

    async function processChunk(lowerBound) {
        if (lowerBound >= end) {
            console.log("**end calc prime numbers**. Found primes: ", primes.join(", "));
            return;
        }
        let upperBound = Math.min(lowerBound + chunkSize, end);
        console.log(`calc prime numbers ${lowerBound}...${upperBound}`);
        primes = primes.concat(mathUtils.getPrimeNumbersWithinRange(lowerBound, upperBound));
         setTimeout(() => processChunk(lowerBound + chunkSize), 1000);
    }

     processChunk(start);
}
