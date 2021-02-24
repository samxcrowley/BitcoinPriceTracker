let WIDTH = 900;
let HEIGHT = 600;

let LOWX = 50;
let HIGHX = WIDTH - 50;
let LOWY = HEIGHT - 50;
let HIGHY = 200;

let DRAW_WIDTH = HIGHX - LOWX;
let DRAW_HEIGHT = HIGHY - LOWY;

let currentPrice;
let historicalPrices;

function setup() {
    
    createCanvas(WIDTH, HEIGHT);
    frameRate(1);
    
    retrieveCurrentPrice();
    retrieveHistoricalPrices();
    
}

function draw() {
    
    background(17);
    strokeWeight(5);
    
    let bpi = historicalPrices.bpi;
    let valuesArr = [];
    
    let lowestValue = 999999;
    let highestValue = 0;
    
    for (const [key, value] of Object.entries(bpi)) {
        
        valuesArr.push(value);
        
        if (value < lowestValue) lowestValue = value;
        if (value > highestValue) highestValue = value;
        
    }
    
}

function retrieveCurrentPrice() {
    
    let url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    httpGet(url, 'json', false, function(response) {
        currentPrice = response;
        console.log(currentPrice);
    });
    
}

function retrieveHistoricalPrices() {
    
    let url = 'https://api.coindesk.com/v1/bpi/historical/close.json';
    httpGet(url, 'json', false, function(response) {
        historicalPrices = response;
        console.log(historicalPrices);
    });
    
}




