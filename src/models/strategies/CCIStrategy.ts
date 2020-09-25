/*
 * File: RSIStrategy.1.ts
 * Project: backtest-app
 * File Created: Friday, 21st June 2019 12:35:15 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Sunday, 1st September 2019 1:23:30 pm
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



import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';
import { Indicator } from '../Indicator';
import { StockData } from '../StockData';

export class CCIStrategy extends Strategy {

    public title: string    = 'CCI';
    public indicators: {
        [key: string]: Indicator
    } = {
        cci: {
            name:    'cci',
            options: [10],
            metrics:  ['high', 'low', 'close'],
            output:  ['output']
        }
    };


    constructor () {
        super();
        // Build indicator full names
        const indicatorKeys: string[] = Object.keys( this.indicators );
        for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
            const indicatorKey:     string         = indicatorKeys[i];
            const indicatorName:    string         = this.indicators[indicatorKey].name;
            const indicatorOptions: number[]       = this.indicators[indicatorKey].options;
            this.indicators[indicatorKey].fullName = `${indicatorName}_${indicatorOptions.join( '_' )}`;
        }
    }

    /**
     * Provided market data, should we buy or not.
     * If currentCCI > 0 and previousCCI < 0 -> BUY
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number   = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const cciName:         string   = this.indicators.cci.fullName || '';
        const cciOutput:       number[] = data.indicators[cciName]['output'];
        const currentCCI:      number   = cciOutput[cciOutput.length - 1];
        const previousCCI:     number   = cciOutput[cciOutput.length - 2];
        if (
            currentCCI > 0 && previousCCI < 0 &&
            timeDiffMinutes > 15 ) {
            return {
                amount:   -1,
                price:    data.open[data.open.length - 1],
                decision: true
            };
        } else {
            return {
                amount:   0,
                price:    data.open[data.open.length - 1],
                decision: false
            };
        }
    }

    /**
     * Provided market data, should we sell or not.
     * If currentCCI < 0 and previousCCI > 0 -> SELL
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldSell( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const cciName:         string   = this.indicators.cci.fullName || '';
        const cciOutput:       number[] = data.indicators[cciName]['output'];
        const currentCCI:      number   = cciOutput[cciOutput.length - 1];
        const previousCCI:     number   = cciOutput[cciOutput.length - 2];
        if (
            timeDiffMinutes < 15 ||
            ( currentCCI < 0 && previousCCI > 0 )) {
            return {
                amount:   -1,
                price:    data.open[data.open.length - 1],
                decision: true
            };
        } else {
            return {
                amount:   0,
                price:    data.open[data.open.length - 1],
                decision: false
            };
        }
    }

}
