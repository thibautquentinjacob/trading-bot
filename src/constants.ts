/*
 * File: constants.ts
 * Project: server
 * File Created: Tuesday, 26th March 2019 12:34:55 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Tuesday, 10th September 2019 1:05:30 am
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



export class Constants {

    // IEX Cloud API settings
    public static IEX_CLOUD_SETTINGS: {[key: string]: string } = {
        IEX_CLOUD_DATA_URL:         'https://cloud-sse.iexapis.com/',
        IEX_CLOUD_VERSION:          'stable',
        IEX_CLOUD_STREAM_PRECISION: 'stocksUS1Minute',
        IEX_CLOUD_PRIVATE_TOKEN:    'sk_17df8f49db65407eb7aba757e1faeeae',
    };

    // Alpaca API settings
    public static ALPACA_SETTINGS: {[key: string]: string } = {
        ALPACA_API_URL:     'https://paper-api.alpaca.markets',
        ALPACA_KEY_ID:      'PKZHLVTKOXLFX097CS6B',
        ALPACA_KEY_SECRET:  'VNMwCnCytEk/51EjDgeiJgFjz2hIuDOZ/z0rV/8B',
        ALPACA_API_VERSION: 'v2'
    };

    public static IEXCloudAPIDefaultHeaders: {[key: string]: string } = {
        'Accept': 'text/event-stream'
    };

    // Alpaca API headers
    public static alpacaDefaultHeaders:      {[key: string]: string } = {
        'APCA-API-KEY-ID':     Constants.ALPACA_SETTINGS.ALPACA_KEY_ID,
        'APCA-API-SECRET-KEY': Constants.ALPACA_SETTINGS.ALPACA_KEY_SECRET
    };

    // The symbol to trade
    public static TRADED_SYMBOL:               string = 'AAPL';

    // Default strategy
    public static DEFAULT_STRATEGY:            string = 'CCI';

    // SEC min day trade security amount
    public static MIN_DAY_TRADE_CASH_AMOUNT:   number = 25000;

    // Market update frequency
    public static STRATEGY_UPDATE_FREQ:        number = 1500;

    // Account Metrics update frequency
    public static ACCOUNT_METRICS_UPDATE_FREQ: number = 10000;

    // Order update frequency
    public static ORDER_UPDATE_FREQ:           number = 10000;

    // Position update frequency
    public static POSITION_UPDATE_FREQ:        number = 10000;

    // Market status update frequency
    public static MARKET_STATUS_UPDATE_FREQ:   number = 60000;

}
