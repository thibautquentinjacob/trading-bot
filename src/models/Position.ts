/*
 * File: Position.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:18 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Tuesday, 4th June 2019 12:35:29 am
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

export interface Position {

    assetId:                 string,
    symbol:                  string,
    exchange:                string,
    assetClass:              string,
    avgEntryPrice:           number,
    qty:                     number,
    side:                    string,
    marketValue:             number,
    costBasis:               number,
    unrealizedPl:            number,
    unrealizedPlpc:          number,
    unrealizedIntradayPl:    number,
    unrealizedIntradayPlpc:  number,
    currentPrice:            number,
    lastdayPrice:            number,
    changeToday:             number

}

// Build Position object out of API data
export class PositionAdapter implements Adapter<Position> {

    public adapt( positionData: any ): Position {
        return {
            assetId:                 positionData.asset_id,
            symbol:                  positionData.symbol,
            exchange:                positionData.exchange,
            assetClass:              positionData.asset_class,
            avgEntryPrice:           parseFloat( positionData.avg_entry_price ),
            qty:                     parseFloat( positionData.qty ),
            side:                    positionData.side,
            marketValue:             parseFloat( positionData.market_value ),
            costBasis:               parseFloat( positionData.cost_basis ),
            unrealizedPl:            parseFloat( positionData.unrealized_pl ),
            unrealizedPlpc:          parseFloat( positionData.unrealized_plpc ),
            unrealizedIntradayPl:    parseFloat( positionData.unrealized_intraday_pl ),
            unrealizedIntradayPlpc:  parseFloat( positionData.unrealized_intraday_plpc ),
            currentPrice:            parseFloat( positionData.current_price ),
            lastdayPrice:            parseFloat( positionData.last_day_price ),
            changeToday:             parseFloat( positionData.change_today )
        };
    }

}
