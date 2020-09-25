/*
 * File: QuoteController.ts
 * Project: server
 * File Created: Thursday, 4th April 2019 12:13:17 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 4th September 2019 10:36:58 pm
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



import { get } from 'request-promise-native';
import { v4 } from 'uuid';

import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';
import { Constants } from '../constants';
import { Quote, QuoteAdapter } from '../models/Quote';

export class QuoteController {

    private static _url:     string = Constants.IEX_CLOUD_SETTINGS.IEX_CLOUD_DATA_URL;
    private static _version: string = Constants.IEX_CLOUD_SETTINGS.IEX_CLOUD_VERSION;
    private static _token:   string = Constants.IEX_CLOUD_SETTINGS.IEX_CLOUD_PRIVATE_TOKEN;

    /**
     * Get all quotes for input symbol.
     * 
     * @public
     * @param {symbol} string - Symbol to get a quote of
     * @returns {Promise<Quote[]>} Quote Object array
     */
    public static getQuotes( symbol: string ): Promise<Quote[]> {
        return new Promise( async ( resolve, reject ) => {
            // const msg:   string = `Fetching all quotes for symbol ${symbol}`;
            // const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            // const route: string = `quote`;
            // console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${QuoteController._url}/${QuoteController._version}/stock/${symbol}/intraday-prices?token=${QuoteController._token}`).then(( data: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const output:       Quote[]      = [];
                const response:     any          = JSON.parse( data );
                const quoteAdapter: QuoteAdapter = new QuoteAdapter();
                for ( let i = 0, size = response.length ; i < size ; i++ ) {
                    const quote: Quote = quoteAdapter.adapt( response[i] );
                    // If quote values are null, use last values
                    if ( !quote.open && i > 0 && output[i - 1].open ) {
                        quote.open  = output[i - 1].open;
                        quote.high  = output[i - 1].high;
                        quote.low   = output[i - 1].low;
                        quote.close = output[i - 1].close;
                    }
                    output.push( quote );
                }
                resolve( output );
            }).catch(( err: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

    /**
     * Get last quote for input symbol.
     * 
     * @public
     * @param {symbol} string - Symbol to get a quote of
     * @returns {Promise<Quote>} Quote Object
     */
    public static getLastQuote( symbol: string ): Promise<Quote> {
        return new Promise( async ( resolve, reject ) => {
            const msg:   string = `Fetching last quote for symbol ${symbol}`;
            const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `quote`;
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${QuoteController._url}/${QuoteController._version}/stock/${symbol}/quote/latestPrice?token=${QuoteController._token}`).then(( data: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:     any          = JSON.parse( data );
                const quoteAdapter: QuoteAdapter = new QuoteAdapter();
                resolve( quoteAdapter.adapt( response[0] ));
            }).catch(( err: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

}
