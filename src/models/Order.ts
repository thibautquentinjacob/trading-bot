/*
 * File: Order.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:10 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Tuesday, 10th September 2019 12:47:21 am
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



import { OrderType } from './OrderType';
import { Side } from './Side';
import { TimeInForce } from './TimeInForce';
import { OrderStatus } from './OrderStatus';
import { Adapter } from './Adapter';

export interface Order {

    id:             string;
    clientOrderId:  string;
    createdAt:      Date;
    updatedAt?:     Date;
    submittedAt?:   Date;
    filledAt?:      Date;
    expiredAt?:     Date;
    canceledAt?:    Date;
    failedAt?:      Date;
    assetId:        string;
    symbol:         string;
    assetClass:     string;
    quantity:       number;
    filledQuantity: number;
    type:           OrderType;
    side:           Side;
    timeInForce:    TimeInForce;
    limitPrice?:    number;
    stopPrice?:     number;
    filledAvgPrice: number;
    status:         OrderStatus;
    extendedHours?: boolean;
    legs?:          Order[];

}

// Build Account object out of API data
export class OrderAdapter implements Adapter<Order> {

    public adapt( orderData: any ): Order {
        const parsedOrderData: any = JSON.parse( orderData );

        return {
            id:             parsedOrderData.id,
            clientOrderId:  parsedOrderData.client_order_id,
            createdAt:      new Date( parsedOrderData.created_at ),
            updatedAt:      new Date( parsedOrderData.updated_at ),
            submittedAt:    new Date( parsedOrderData.submitted_at ),
            filledAt:       new Date( parsedOrderData.filled_at ),
            expiredAt:      new Date( parsedOrderData.expired_at ),
            canceledAt:     new Date( parsedOrderData.canceled_at ),
            failedAt:       new Date( parsedOrderData.failed_at ), 
            assetId:        parsedOrderData.asset_id,
            symbol:         parsedOrderData.symbol,
            assetClass:     parsedOrderData.asset_class,
            quantity:       parseInt( parsedOrderData.qty ),
            filledQuantity: parseInt( parsedOrderData.filled_qty ),
            type:           parsedOrderData.type,
            side:           parsedOrderData.side,
            timeInForce:    parsedOrderData.time_in_force,
            limitPrice:     parsedOrderData.limit_price,
            stopPrice:      parsedOrderData.stop_price,
            filledAvgPrice: parsedOrderData.filled_avg_price,
            status:         parsedOrderData.status,
            extendedHours:  parsedOrderData.extended_hours ? parsedOrderData.extended_hours : false,
            legs:           parsedOrderData.legs
        };
    }

}
