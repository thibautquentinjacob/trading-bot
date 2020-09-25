/*
 * File: CalendarController.ts
 * Project: server
 * File Created: Wednesday, 3rd April 2019 1:17:35 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Saturday, 7th September 2019 12:28:07 pm
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

import { Calendar, CalendarAdapter } from '../models/Calendar';
import { OperationState } from '../models/OperationState';
import { Helper } from '../Helper';
import { Constants } from '../constants';

export class CalendarController {

    /**
     * Get market calendar
     * 
     * @public
     * @param {string} start - optional start date
     * @param {string} end - optional end date
     * @returns {Promise<Calendar[]>} Calendar[]
     */
    public static get( start?: string, end?: string ): Promise<Calendar[]> {
        return new Promise( async ( resolve, reject ) => {
            const msg:         string = 'Fetching market calendar';
            const uuid:        string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route:       string = `calendar`;
            let   queryString: string = '';
            if ( start ) {
                queryString += `?start=${start}`;
            }
            if ( end ) {
                if ( queryString.length === 0 ) {
                    queryString += `?end=${end}`;
                } else {
                    queryString += `&end=${end}`;
                }
            }
            
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.ALPACA_SETTINGS.ALPACA_API_URL}/${Constants.ALPACA_SETTINGS.ALPACA_API_VERSION}/${route}${queryString}`, {
                headers: Constants.alpacaDefaultHeaders
            }).then(( data: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:        any             = JSON.parse( data );
                const calendarAdapter: CalendarAdapter = new CalendarAdapter();
                const output:          Calendar[]      = [];
                
                for ( let i = 0 ; i < response.length; i++ ) {
                    const calendarData: any = response[i];
                    output.push( calendarAdapter.adapt( calendarData ));
                }
                resolve( output );
            }).catch(( err: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

}
