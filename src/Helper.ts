/*
 * File: Helper.ts
 * Project: server
 * File Created: Monday, 1st April 2019 12:39:47 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Sunday, 1st September 2019 12:17:43 pm
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



import { OperationState } from "./models/OperationState";
import { white, grey, magenta, yellow, blue, red, green } from "colors";
import { ErrorMessage } from "./models/ErrorMessage";
import { Quote } from "./models/Quote";
import { QuoteCollection } from "./models/QuoteCollection";
import { StockData } from "./models/StockData";
import { Indicator } from "./models/Indicator";
import { Strategy } from "./models/Strategy";

export class Helper {

    public static formatLog(
        route:         string,
        message:       string,
        uuid:          string,
        state:         OperationState,
        errorMessage?: ErrorMessage
    ): string {

        if ( state === OperationState.PENDING ) {
            return white( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${blue( state )}` );
        } else if ( state === OperationState.FAILURE && errorMessage ) {
            return red( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${red( state )}: ${errorMessage.name} [${errorMessage.statusCode}]` );
        } else if ( state === OperationState.SUCCESS ) {
            return green( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${green( state )}` );
        } else {
            return grey( `${grey('>>>')} ${magenta.bold( route )} :: ${message} (op. ${grey('#')}${yellow(uuid)}) | ${blue( state )}` );
        }
    }

    /**
     * Format date to be displayed in the plot.
     *
     * @private
     * @param {string} date - Input date as a string
     * @returns {string} Formatted date
     */
    public static convertDate ( date: string ): string {
        const parsedDate:    Date   = new Date( date );
        const parsedHours:   string = parsedDate.getHours() > 9 ?
                                      parsedDate.getHours() + '' :
                                      '0' + parsedDate.getHours();
        const parsedMinutes: string = parsedDate.getMinutes() > 9 ?
                                      parsedDate.getMinutes() + '' :
                                      '0' + parsedDate.getMinutes();
        return `${parsedHours}:${parsedMinutes}`;
    }

    /**
     * Build a quote collection to compute all indicators for each input quote
     * based on the provided inputs and options.
     * 
     * @param {Quote[]} quotes - Quote data
     * @param {{[key: string]: string }} indicators - Indicator names
     * @param {{[key: string]: number[]}} indicatorOptions - Indicator options
     * @param {{[key: string]: string[]}} dataColumns - Indicator input (open, close, etc.)
     * @param {Strategy} strategy - Current strategy
     * @param {StockData} data - Structured used to take strategic decisions
     */
    public static computeIndicators (
        quotes:           Quote[],
        indicators:       {[key: string]: string },
        indicatorOptions: {[key: string]: number[]},
        dataColumns:      {[key: string]: string[]},
        strategy:         Strategy,
        data:             StockData
    ): StockData {
        // Build a QuoteCollection to compute indicator values
        // for our data.
        const quoteCollection = new QuoteCollection(
            quotes,
            indicators,
            indicatorOptions,
            dataColumns
        );

        const indicatorKeys: string[] = Object.keys( strategy.indicators );
        quoteCollection.quotes.forEach(( element: Quote ) => {
            // For each indicator
            for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
                const indicatorName: string    = indicatorKeys[i];
                const indicator:     Indicator = strategy.indicators[indicatorName];
                // indicatorName_option1_option_2...
                const fieldName                = `${indicator.name}_${indicator.options.join( '_' )}`;
                // For each technical indicator output
                for ( let j = 0, outputSize = indicator.output.length ; j < outputSize ; j++ ) {
                    const outputName: string = indicator.output[j];
                    if ( !data.indicators[fieldName][outputName]) {
                        data.indicators[fieldName][outputName] = [];
                    }
                    const elementName = `${fieldName}_${j}`;
                    data.indicators[fieldName][outputName].push( element.indicators[elementName]);
                }
            }

            // Store converted time
            const convertedDate: string = Helper.convertDate( element.date.getTime() + '' );
            ( data.times as string[]).push( convertedDate );
            // Store date
            ( data.dates as Date[]).push( element.date );
            // Store volume
            ( data.volumes as number[]).push( element.volume );
            // Store market OHLC
            ( data.open as number[]).push( element.open );
            ( data.high as number[]).push( element.high );
            ( data.low as number[]).push( element.low );
            ( data.close as number[]).push( element.close );
        });

        return data;
    }

    /**
     * Bootstrap data structures for indicator computation
     * 
     * @param {Strategy} strategy - Current strategy
     */
    public static initializeData ( strategy: Strategy ): {
        data:             StockData,
        indicators:       {[key: string]: string },
        indicatorOptions: {[key: string]: number[]},
        dataColumns:      {[key: string]: string[]}
    } {
        const data: StockData = {
            times:      [],
            dates:      [],
            volumes:    [],
            open:       [],
            high:       [],
            low:        [],
            close:      [],
            indicators: {}
        };

        // For each indicators in the current strategy
        // create a new entry in the structure.
        const indicatorKeys: string[] = Object.keys( strategy.indicators );
        for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
            const indicatorName: string    = indicatorKeys[i];
            const indicator:     Indicator = strategy.indicators[indicatorName];
            // indicatorName_option1_option_2...
            const fieldName:     string    = `${indicator.name}_${indicator.options.join( '_' )}`;
            data.indicators[fieldName]     = {};
            // For each technical indicator output
            for ( let j = 0, outputSize = indicator.output.length ; j < outputSize ; j++ ) {
                const outputName: string = indicator.output[j];
                if ( !( data.indicators[fieldName][outputName])) {
                    data.indicators[fieldName][outputName] = [];
                }
            }
        }

        const indicators:       {[key: string]: string }  = {};
        const indicatorOptions: {[key: string]: number[]} = {};
        const dataColumns:      {[key: string]: string[]} = {};

        // For each indicator, fetch indicator name, its options and
        // the input metrics.
        for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
            const indicator: string     = indicatorKeys[i];
            indicators[indicator]       = strategy.indicators[indicator].name;
            indicatorOptions[indicator] = strategy.indicators[indicator].options;
            dataColumns[indicator]      = strategy.indicators[indicator].metrics;
        }

        return {
            data:             data,
            indicators:       indicators,
            indicatorOptions: indicatorOptions,
            dataColumns:      dataColumns
        };
    }
}
