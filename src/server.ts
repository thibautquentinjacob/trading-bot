/*
 * File: server.js
 * Project: server
 * File Created: Tuesday, 19th March 2019 12:21:16 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 11th September 2019 12:41:07 am
 * Modified By: Thibaut Jacob (thibautquentinjacob@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2019 Thibaut Jacob
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


import { AccountController } from './controllers/AccountController';
import { Account } from './models/Account';
import { yellow } from 'colors';
import { ClockController } from "./controllers/ClockController";
import { Clock } from "./models/Clock";
import { QuoteController } from './controllers/QuoteController';
import { Quote } from './models/Quote';
import { Constants } from './constants';
import { StrategicDecision } from './models/StragegicDecision';
import { OrderController } from './controllers/OrderController';
import { Side } from './models/Side';
import { OrderType } from './models/OrderType';
import { TimeInForce } from './models/TimeInForce';
import { PositionController } from './controllers/PositionController';
import { Position } from './models/Position';
import { Logger } from './models/Logger';
import { strategies } from './models/strategies/index';
import { Strategy } from './models/Strategy';
import { StockData } from './models/StockData';
import { Helper } from './Helper';
import { OperationState } from './models/OperationState';

import { Interface } from './interface';
import { Order } from './models/Order';
import { OrderClass } from './models/OrderClass';

console.log( yellow( `
.▄▄ · ▄▄▄▄▄      ▐▄• ▄ 
▐█ ▀. •██  ▪      █▌█▌▪
▄▀▀▀█▄ ▐█.▪ ▄█▀▄  ·██· 
▐█▄▪▐█ ▐█▌·▐█▌.▐▌▪▐█·█▌
 ▀▀▀▀  ▀▀▀  ▀█▄▀▪•▀▀ ▀▀
`));

const logger:            Logger     = new Logger( 'log.txt' );
let   marketOpened:      boolean    = false;
const quotes:            Quote[]    = [];
const strategy:          Strategy   = strategies[Constants.DEFAULT_STRATEGY];
let   orders:            Order[]    = [];
let   positions:         Position[] = [];
let   account:           Account;
const logs:              string[]   = [];

let initialTotal:        number     = 0;
let initialAssets:       number     = 0;
let initialCash:         number     = 0;

if ( !strategy ) {
    logs.push( Helper.formatLog(
        'init',
        `Unknown strategy ${Constants.DEFAULT_STRATEGY}. Available strategies are ${Object.keys( strategies )}`, 'Check',
        OperationState.FAILURE )
    );
    process.exit( -1 );
}

/**
 * Update interface
 */
function updateInterface (): void {

    if ( !account ) {
        return;
    }

    Interface.update({
        totalValue:      account.portfolioValue,
        totalIncrement:  ( account.portfolioValue / initialTotal - 1) * 100,
        assetsValue:     account.portfolioValue - account.cash,
        assetsIncrement: (( account.portfolioValue - account.cash ) / initialAssets - 1) * 100,
        cashValue:       account.cash,
        cashIncrement:   ( account.cash / initialCash - 1) * 100,
        successValue:    0,
        strategy:        Constants.DEFAULT_STRATEGY,
        marketStatus:    marketOpened ? 'OPENED' : 'CLOSED',
        orders:          orders,
        positions:       positions,
        logs:            logs
    });
}

/**
 * Check if we should buy stocks according to the current
 * strategy.
 * 
 * @param {StockData} data - Information needed to make a decision
 * @returns {StrategicDecision} A decision
 */
function shouldBuy ( data: StockData ): StrategicDecision {
    return strategy.shouldBuy( data, logger );
}

/**
 * Check if we should sell stocks according to the current
 * strategy.
 * 
 * @param {StockData} data - Information needed to make a decision
 * @returns {StrategicDecision} A decision
 */
function shouldSell ( data: StockData ): StrategicDecision {
    return strategy.shouldSell( data, logger );
}

/**
 * Implement the buy logic
 * 
 * @param {data} StockData - Technical indicator data
 */
function buyLogic ( data: StockData ): void {
    // Get buy decision
    const buyDecision: StrategicDecision = shouldBuy( data );
    if ( buyDecision.decision && ( buyDecision.amount > 0 || buyDecision.amount === -1 )) {
        // Get current cash amount
        AccountController.get().then(( account: Account ) => {
            const cash:   number = account.cash - Constants.MIN_DAY_TRADE_CASH_AMOUNT;
            // Compute the volume we can buy
            const amount: number = Math.floor( cash / buyDecision.price );
            if ( buyDecision.amount === -1 && amount > 0 ) {
                logs.push( `Buying ${amount} x ${Constants.TRADED_SYMBOL} for ${buyDecision.price * amount}` );
                logger.log( `BUY\t${Constants.TRADED_SYMBOL}\t${amount} x ${buyDecision.price}\t${buyDecision.price * amount}` );
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    amount,
                    Side.BUY,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                    OrderClass.SIMPLE
                ).catch((err) => {
                    logs.push( err.message );
                    logger.log( err.message );
                });
            } else if ( buyDecision.amount !== -1 ) {
                logs.push( `Buying ${buyDecision.amount} x ${Constants.TRADED_SYMBOL} for ${buyDecision.price * buyDecision.amount}` );
                logger.log( `BUY\t${Constants.TRADED_SYMBOL}\t${buyDecision.amount} x ${buyDecision.price}\t${buyDecision.price * buyDecision.amount}` );
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    buyDecision.amount,
                    Side.BUY,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                    OrderClass.SIMPLE
                ).catch((err) => {
                    logs.push( err.message );
                    logger.log( err.message );
                });
            }
        });
    }
}

/**
 * Implement the sell logic
 * 
 * @param {StockData} data - Technical indicator data
 */
function sellLogic ( data: StockData ): void {
    // Get sell decision
    const sellDecision: StrategicDecision = shouldSell( data );
    if ( sellDecision.decision && ( sellDecision.amount > 0 || sellDecision.amount === -1 )) {
        // Fetch the volume we own for traded symbol
        PositionController.getBySymbol( Constants.TRADED_SYMBOL ).then(( position: Position ) => {
            const amount: number = position.qty;
            if ( sellDecision.amount === -1 && amount > 0 ) {
                logs.push( `Selling ${amount} x ${Constants.TRADED_SYMBOL} for ${sellDecision.price * amount}` );
                logger.log( `SELL\t${Constants.TRADED_SYMBOL}\t${amount} x ${sellDecision.price}\t${sellDecision.price * amount}` );
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    amount,
                    Side.SELL,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                    OrderClass.SIMPLE
                ).catch((err) => {
                    logs.push( err.message );
                    logger.log( err.message );
                });
            } else if ( sellDecision.amount !== -1 ) {
                logs.push( `Selling ${sellDecision.amount} x ${Constants.TRADED_SYMBOL} for ${sellDecision.price * sellDecision.amount}` );
                logger.log( `BUY\t${Constants.TRADED_SYMBOL}\t${sellDecision.amount} x ${sellDecision.price}\t${sellDecision.price * sellDecision.amount}` );
                OrderController.request(
                    Constants.TRADED_SYMBOL,
                    sellDecision.amount,
                    Side.SELL,
                    OrderType.MARKET,
                    TimeInForce.DAY,
                    OrderClass.SIMPLE
                ).catch((err) => {
                    logs.push( err.message );
                    logger.log( err.message );
                });
            }
        }).catch(() => {});
    }
}

// Fetch latest symbol quote every minutes
setInterval(() => {
    // If market is opened, fetch latest quotes
    if ( marketOpened ) {

        // Bootstrap data structures
        const initResult: {
            data:             StockData,
            indicators:       {[key: string]: string },
            indicatorOptions: {[key: string]: number[]},
            dataColumns:      {[key: string]: string[]}
        } = Helper.initializeData( strategy );

        let   data:             StockData                 = initResult.data;
        const indicators:       {[key: string]: string }  = initResult.indicators;
        const indicatorOptions: {[key: string]: number[]} = initResult.indicatorOptions;
        const dataColumns:      {[key: string]: string[]} = initResult.dataColumns;

        // If no quotes have been fetched yet, get all quotes
        if ( quotes.length === 0 ) {
            QuoteController.getQuotes( Constants.TRADED_SYMBOL ).then(( quotes: Quote[] ) => {

                quotes = quotes;

                // Build a QuoteCollection to compute indicator values
                // for our data.
                data = Helper.computeIndicators(
                    quotes,
                    indicators,
                    indicatorOptions,
                    dataColumns,
                    strategy,
                    data
                );

                // Buy and Sell logic here
                buyLogic( data );
                sellLogic( data );
            }).catch(( err: any ) => {
                logs.push( `Error raised: ${err}` )
            });
        } else {
            QuoteController.getLastQuote( Constants.TRADED_SYMBOL ).then(( quote: Quote ) => {
                // If current quote is null, use last one
                const quotesAmount: number = quotes.length;
                if ( !quote.open && quotesAmount > 0 && quotes[quotesAmount - 1].open ) {
                    quote.open  = quotes[quotesAmount - 1].open;
                    quote.high  = quotes[quotesAmount - 1].high;
                    quote.low   = quotes[quotesAmount - 1].low;
                    quote.close = quotes[quotesAmount - 1].close;
                }
                quotes.push( quote );
                
                // Build a QuoteCollection to compute indicator values
                // for our data.
                data = Helper.computeIndicators(
                    quotes,
                    indicators,
                    indicatorOptions,
                    dataColumns,
                    strategy,
                    data
                );

                // Buy and Sell logic here
                buyLogic( data );
                sellLogic( data );

            }).catch(( err: any ) => {
                logs.push( `Error raised: ${err}` )
            });
        }
    }
}, Constants.STRATEGY_UPDATE_FREQ );

// MARKET ==============================================

// Use the clock controller to check for opening time
// Check if the market is opened or closed
async function isMarketOpened (): Promise<boolean> {
    const clock: Clock = await ClockController.get();
    return clock.isOpen;
}

function marketHandler (): void {
    isMarketOpened().then(( status: boolean ) => {
        marketOpened = status;
        updateInterface();
    }).catch(( err: any ) => {
        logs.push( `Error raised: ${err}` )
        marketOpened = false;
    });
}

// Refresh market status every minute
marketHandler();
setInterval(() => {
    marketHandler();
}, Constants.MARKET_STATUS_UPDATE_FREQ );

// ORDERS ==============================

// Use the Order controller to fetch all of
// today's orders.
async function getOrders (): Promise<Order[]> {
    const now:     Date = new Date();
    const opening: Date = new Date( '2019/09/01' );
    return await OrderController.get(
        opening.toISOString(),
        now.toISOString(),
        false
    );
}

function OrdersHandler (): void {
    getOrders().then(( newOrders: Order[] ) => {
        orders = newOrders;
        updateInterface();
    }).catch(( err: any ) => {
        logs.push( `Error raised: ${err}` )
    });
}

// Refresh market status every minute
OrdersHandler();
setInterval(() => {
    OrdersHandler();
}, Constants.ORDER_UPDATE_FREQ );

// POSITIONS ==============================

// Use the Position controller to fetch all opened positions
async function getPositions (): Promise<Position[]> {
    return await PositionController.get();
}

function PositionsHandler (): void {
    getPositions().then(( newPositions: Position[] ) => {
        // console.log( newPositions );
        positions = newPositions;
        updateInterface();
    }).catch(( err: any ) => {
        logs.push( `Error raised: ${err}` )
    });
}

// Refresh market status every minute
PositionsHandler();
setInterval(() => {
    PositionsHandler();
}, Constants.POSITION_UPDATE_FREQ );

// Refresh account state every minute
AccountController.get().then(( newAccount: Account ) => {
    account       = newAccount;

    initialTotal  = account.portfolioValue;
    initialAssets = account.portfolioValue - account.cash;
    initialCash   = account.cash;

    Interface.setup({
        totalValue:      account.portfolioValue,
        totalIncrement:  0,
        assetsValue:     account.portfolioValue - account.cash,
        assetsIncrement: 0,
        cashValue:       account.cash,
        cashIncrement:   0,
        successValue:    50,
        strategy:        Constants.DEFAULT_STRATEGY,
        marketStatus:    marketOpened ? 'OPENED' : 'CLOSED',
        orders:          orders,
        positions:       positions,
        logs:            logs
    });
}).catch(( err: any ) => {
    logs.push( `Error raised: ${err}` )
});
setInterval(() => {
    AccountController.get().then(( newAccount: Account ) => {
        account = newAccount;
        updateInterface();
    }).catch(( err: any ) => {
        logs.push( `Error raised: ${err}` )
    });    
}, Constants.ACCOUNT_METRICS_UPDATE_FREQ );