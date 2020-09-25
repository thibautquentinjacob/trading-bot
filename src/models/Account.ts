/*
 * File: Account.ts
 * Project: server
 * File Created: Monday, 25th March 2019 12:44:00 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Saturday, 7th September 2019 12:21:38 pm
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
import { AccountStatus } from './AccountStatus';

export interface Account {

    accountBlocked:        boolean;
    accountNumber:         string;
    buyingPower:           number;
    cash:                  number;
    createdAt:             Date;
    currency:              string;
    daytradeCount:         number;
    daytradingBuyingPower: number;
    equity:                number;
    id:                    string;
    initialMargin:         number;
    lastEquity:            number;
    lastMaintenanceMargin: number;
    longMarketVaue:        number;
    maintenanceMargin:     number;
    multiplier:            number;
    patternDayTrader:      boolean;
    portfolioValue:        number;
    regtBuyingPower:       number;
    ShortMarketValue:      number;
    shortingEnabled:       boolean;
    sma:                   number;
    status:                AccountStatus;
    tradeSuspendedByUser:  boolean;
    tradingBlocked:        boolean;
    transfersBlocked:      boolean;

}

// Build Account object out of API data
export class AccountAdapter implements Adapter<Account> {

    public adapt( accountData: any ): Account {

        return {
            id:                    accountData.id,
            accountNumber:         accountData.account_number,
            status:                accountData.status,
            currency:              accountData.currency,
            cash:                  parseFloat( accountData.cash ),
            portfolioValue:        parseFloat( accountData.portfolio_value ),
            patternDayTrader:      accountData.pattern_day_trader,
            tradeSuspendedByUser:  accountData.trade_suspended_by_user,
            tradingBlocked:        accountData.trading_blocked,
            transfersBlocked:      accountData.transfers_blocked,
            accountBlocked:        accountData.account_blocked,
            createdAt:             new Date( accountData.created_at ),
            shortingEnabled:       accountData.shorting_enabled,
            longMarketVaue:        parseFloat( accountData.long_market_value ),
            ShortMarketValue:      parseFloat( accountData.short_market_value ),
            equity:                parseFloat( accountData.equity ),
            lastEquity:            parseFloat( accountData.last_equity ),
            multiplier:            parseFloat( accountData.multiplier ),
            buyingPower:           parseFloat( accountData.buying_power ),
            initialMargin:         parseFloat( accountData.initial_margin ),
            maintenanceMargin:     parseFloat( accountData.maintenance_margin ),
            sma:                   parseFloat( accountData.sma ),
            daytradeCount:         parseFloat( accountData.daytrade_count ),
            lastMaintenanceMargin: parseFloat( accountData.last_maintenance_margin ),
            daytradingBuyingPower: parseFloat( accountData.daytrading_buying_power ),
            regtBuyingPower:       parseFloat( accountData.regt_buying_power )
        };
    }

}