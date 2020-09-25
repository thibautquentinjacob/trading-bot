/*
 * File: AccountController.ts
 * Project: server
 * File Created: Tuesday, 26th March 2019 12:31:58 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Tuesday, 10th September 2019 1:05:55 am
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

import { Constants } from '../constants';
import { Account, AccountAdapter } from "../models/Account";
// import { v4 } from 'uuid';

// import { Helper } from '../Helper';
// import { OperationState } from '../models/OperationState';

export class AccountController {

    /**
     * Get account corresponding to KEY_ID
     * 
     * @public
     * @returns {Promise<Account>} Account Object
     */
    public static get(): Promise<Account> {
        return new Promise( async ( resolve, reject ) => {
            // const msg:   string = 'Fetching account state';
            // const uuid:  string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route: string = `account`;
            // console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.ALPACA_SETTINGS.ALPACA_API_URL}/${Constants.ALPACA_SETTINGS.ALPACA_API_VERSION}/${route}`, {
                headers: Constants.alpacaDefaultHeaders
            }).then(( data: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:       any            = JSON.parse( data );
                const accountAdapter: AccountAdapter = new AccountAdapter();
                resolve( accountAdapter.adapt( response ));
            }).catch(( err: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

}