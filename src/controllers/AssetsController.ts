/*
 * File: AssetsController.ts
 * Project: server
 * File Created: Wednesday, 3rd April 2019 12:50:50 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Saturday, 7th September 2019 12:42:06 pm
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

import { Asset, AssetAdapter } from '../models/Asset';
import { Helper } from '../Helper';
import { OperationState } from '../models/OperationState';
import { Constants } from '../constants';
import { AssetStatus } from '../models/AssetStatus';

export class AssetsController {

    /**
     * Get all assets
     * 
     * @public
     * @returns {Promise<Asset[]>} Asset[]
     */
    public static get( status?: AssetStatus, assetClass?: string ): Promise<Asset[]> {
        return new Promise( async ( resolve, reject ) => {
            const msg:         string = 'Fetching all assets';
            const uuid:        string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route:       string = `assets`;
            let   queryString: string = '';
            if ( status ) {
                queryString += `?status=${status}`;
            }
            if ( assetClass ) {
                if ( queryString.length === 0 ) {
                    queryString += `?asset_class=${assetClass}`;
                } else {
                    queryString += `&asset_class=${assetClass}`;
                }
            }
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.ALPACA_SETTINGS.ALPACA_API_URL}/${Constants.ALPACA_SETTINGS.ALPACA_API_VERSION}/${route}${queryString}`, {
                headers: Constants.alpacaDefaultHeaders
            }).then(( data: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:     any          = JSON.parse( data );
                const assetAdapter: AssetAdapter = new AssetAdapter();
                const output:       Asset[]      = [];
                
                for ( let i = 0 ; i < response.length; i++ ) {
                    const assetData: any = response[i];
                    output.push( assetAdapter.adapt( assetData ));
                }
                resolve( output );
            }).catch(( err: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

    /**
     * Get specific asset by symbol name
     * 
     * @public
     * @param {string} symbol - Symbol name
     * @returns {Promise<Asset>} Asset
     */
    public static getBySymbol( symbol: string ): Promise<Asset> {
        return new Promise( async ( resolve, reject ) => {
            const msg:         string = 'Fetching asset by symbol';
            const uuid:        string = v4().replace( /^([^\-]*)\-.*/, '$1' );
            const route:       string = `assets/${symbol}`;
            
            console.log( Helper.formatLog( route, msg, uuid, OperationState.PENDING ));
            get( `${Constants.ALPACA_SETTINGS.ALPACA_API_URL}/${Constants.ALPACA_SETTINGS.ALPACA_API_VERSION}/${route}`, {
                headers: Constants.alpacaDefaultHeaders
            }).then(( data: any ) => {
                console.log( Helper.formatLog( route, msg, uuid, OperationState.SUCCESS ));
                const response:     any          = JSON.parse( data );
                const assetAdapter: AssetAdapter = new AssetAdapter();
                
                resolve( assetAdapter.adapt( response ));
            }).catch(( err: any ) => {
                // console.log( Helper.formatLog( route, msg, uuid, OperationState.FAILURE, { name: err.name, statusCode: err.statusCode }));
                reject( err );
            });
        });
    }

}
