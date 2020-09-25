/*
 * File: Asset.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:25 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Saturday, 7th September 2019 12:41:27 pm
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



import { AssetStatus } from './AssetStatus';
import { Exchange } from './Exchange';
import { Adapter } from './Adapter';

export interface Asset {

    id:           string;
    assetClass:   string;
    exchange:     Exchange;
    symbol:       string;
    status:       AssetStatus;
    tradable:     boolean;
    marginable:   boolean;
    shortable:    boolean;
    easyToBorrow: boolean;

}

// Build Asset object out of API data
export class AssetAdapter implements Adapter<Asset> {

    public adapt( assetData: any ): Asset {

        return {
            id:           assetData.asset_id,
            assetClass:   assetData.asset_class,
            exchange:     assetData.exchange,
            symbol:       assetData.symbol,
            status:       assetData.status,
            tradable:     assetData.tradable,
            marginable:   assetData.marginable,
            shortable:    assetData.shortable,
            easyToBorrow: assetData.easy_to_borrow,
        };
    }

}