let WIDTH = 900;
let HEIGHT = 600;

let LOWX = 50;
let HIGHX = WIDTH - 50;
let LOWY = HEIGHT - 50;
let HIGHY = 200;

let DRAW_WIDTH = HIGHX - LOWX;
let DRAW_HEIGHT = HIGHY - LOWY;

let REGULAR_FONT;
let FONT_SIZE = 30;

let currentPrice;
let historicalPrices;

function setup() {
    
    createCanvas(WIDTH, HEIGHT);
    frameRate(1);
    
    REGULAR_FONT = loadFont("font/Montserrat-Regular.otf");
    
    retrieveCurrentPrice();
    retrieveHistoricalPrices();
    
}

function draw() {
    
    background(17);
    
    // draw current price
    noStroke();
    fill(255);
    textFont(REGULAR_FONT);
    textSize(FONT_SIZE);
    retrieveCurrentPrice();
    
    let currentPriceString = "Current Price (BTC/USD): " + currentPrice.bpi.USD.rate;
    let strWidth = textWidth(currentPriceString);
    
    text(currentPriceString, (DRAW_WIDTH / 2) - (strWidth / 2), 50);
    
    
    // draw historical prices
    let bpi = historicalPrices.bpi;
    let valuesArr = [];
    
    let lowestValue = 999999;
    let highestValue = 0;
    
    for (const [key, value] of Object.entries(bpi)) {
        
        valuesArr.push(value);
        
        if (value < lowestValue) lowestValue = value;
        if (value > highestValue) highestValue = value;
        
    }
    
    let range = highestValue - lowestValue;
    let xInterval = DRAW_WIDTH / valuesArr.length;
    
    for (var i = 0; i < valuesArr.length; i++) {
        
        let val = valuesArr[i];
        let nextVal = valuesArr[i + 1];
        
        let x = LOWX + (i * xInterval);
        let nextX = LOWX + ((i + 1) * xInterval);
        
        let y = map(val, lowestValue, highestValue, LOWY, HIGHY);
        let nextY = map(nextVal, lowestValue, highestValue, LOWY, HIGHY);
        
        strokeWeight(5);
        if (nextY < y) stroke(0, 255, 100);
        else stroke(255, 50, 30);
        
        line(x, y, nextX, nextY);
        
    }
    
}

function retrieveCurrentPrice() {
    
    let url = 'https://api.coindesk.com/v1/bpi/currentprice.json';
    httpGet(url, 'json', false, function(response) {
        currentPrice = response;
    });
    
}

function retrieveHistoricalPrices() {
    
    let url = 'https://api.coindesk.com/v1/bpi/historical/close.json';
    httpGet(url, 'json', false, function(response) {
        historicalPrices = response;
    });
    
}




