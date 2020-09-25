/*
 * File: Quote.ts
 * Project: server
 * File Created: Sunday, 2nd June 2019 11:31:08 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Sunday, 1st September 2019 11:20:51 am
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



import { Adapter } from './Adapter';

export interface Quote {

    date:                 Date;
    high:                 number;
    low:                  number;
    average:              number;
    volume:               number;
    notional:             number;
    numberOfTrades:       number;
    marketHigh:           number;
    marketLow:            number;
    marketAverage:        number;
    marketVolume:         number;
    marketNotional:       number;
    marketNumberOfTrades: number;
    open:                 number;
    close:                number;
    marketOpen:           number;
    marketClose:          number;
    changeOverTime:       number;
    marketChangeOverTime: number;
    [key: string]:        number | Date | {[key: string]: number};
    indicators:           {
        [key: string]: number
    };
}

// Build Quote object out of API data
export class QuoteAdapter implements Adapter<Quote> {

    public adapt( quoteData: any ): Quote {

        return {
            date:                 new Date( `${quoteData.date} ${quoteData.minute}` ),
            high:                 quoteData.high,
            low:                  quoteData.low,
            average:              quoteData.average,
            volume:               quoteData.volume,
            notional:             quoteData.notional,
            numberOfTrades:       quoteData.numberOfTrades,
            marketHigh:           quoteData.marketHigh,
            marketLow:            quoteData.marketLow,
            marketAverage:        quoteData.marketAverage,
            marketVolume:         quoteData.marketVolume,
            marketNotional:       quoteData.marketNotional,
            marketNumberOfTrades: quoteData.marketNumberOfTrades,
            open:                 quoteData.open,
            close:                quoteData.close,
            marketOpen:           quoteData.marketOpen,
            marketClose:          quoteData.marketClose,
            changeOverTime:       quoteData.changeOverTime,
            marketChangeOverTime: quoteData.marketChangeOverTime,
            indicators:           {}
        };
    }

}