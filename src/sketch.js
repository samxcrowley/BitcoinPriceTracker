let WIDTH = 900;
let HEIGHT = 600;

let LOWX = 100;
let HIGHX = WIDTH - 100;
let LOWY = HEIGHT - 100;
let HIGHY = 200;

let DRAW_WIDTH = HIGHX - LOWX;
let DRAW_HEIGHT = HIGHY - LOWY;

let REGULAR_FONT;
let LIGHT_FONT;
let LIGHTITALIC_FONT;
let BOLD_FONT;
let FONT_SIZE = 30;

let currentPrice;
let historicalPrices;

var startDate;
var endDate;

let lastPrice;
let priceChangeTimer;
let priceChanged;

function setup() {
    
    createCanvas(WIDTH, HEIGHT);
    frameRate(5);
    
    REGULAR_FONT = loadFont("font/Montserrat-Regular.otf");
    LIGHT_FONT = loadFont("font/Montserrat-Light.otf");
    LIGHTITALIC_FONT = loadFont("font/Montserrat-LightItalic.otf");
    BOLD_FONT = loadFont("font/Montserrat-Bold.otf");
    
    retrieveHistoricalPrices();
    
}

function draw() {
    
    background(17);
    
    // draw current price
    retrieveCurrentPrice();
    
    // if price hasn't had time to load yet or is otherwise null, don't draw
    if (currentPrice === undefined || currentPrice === null) return;
    
    noStroke();
    fill(255);
    
    textAlign(RIGHT);
    textFont(LIGHTITALIC_FONT);
    textSize(FONT_SIZE * 0.5);
    text("current price updated\nevery minute", WIDTH - 20, 30);
    
    textAlign(CENTER);
    
    textFont(REGULAR_FONT);
    textSize(FONT_SIZE * 0.75);
    text("Current Price:", WIDTH / 2, 40);
    
    if (currentPrice.bpi.USD.rate != lastPrice) {
        priceChangeTimer = 0;
    }
    
    fill(255, 0 + (priceChangeTimer * 20), 0 + (priceChangeTimer * 20));
    priceChangeTimer++;
    
    lastPrice = currentPrice.bpi.USD.rate;
    
    textFont(BOLD_FONT);
    textSize(FONT_SIZE);
    text(currentPrice.bpi.USD.rate, WIDTH / 2, 70);
    
    fill(255);
    textFont(LIGHTITALIC_FONT);
    textSize(FONT_SIZE * 0.5);
    text("(BTC / USD)", WIDTH / 2, 90);
    
    
    // draw CoinDesk watermark
    textFont(LIGHT_FONT);
    textSize(FONT_SIZE * 0.6);
    text("Powered by CoinDesk", WIDTH / 2, HEIGHT - 30);
    
    
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
        
        // draw lowest and highest value points
        noStroke();
        if (val == lowestValue) {
            
            fill(255, 50, 30);
            circle(x, y, 10);
            textAlign(CENTER);
            textSize(14);
            textFont(BOLD_FONT);
            text(str(lowestValue), x, y + 20);
            
        } else if (val == highestValue) {
            
            fill(0, 255, 100);
            circle(x, y, 10);
            textAlign(CENTER);
            textSize(14);
            textFont(BOLD_FONT);
            text(str(highestValue), x, y - 10);
            
        }
        
        // draw start and end dates
        if (historicalPrices !== undefined) {
            let dates = Object.keys(historicalPrices.bpi);
            startDate = dates[0];
            endDate = dates[dates.length - 1];
        }
        
        textSize(15);
        textFont(REGULAR_FONT);
        fill(255);
        if (i == 0) {
            textAlign(LEFT);
            text(startDate, 20, HEIGHT / 2);
        } else if (i == valuesArr.length - 1) {
            textAlign(RIGHT);
            text(endDate, WIDTH - 20, HEIGHT / 2);
        }
        
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




