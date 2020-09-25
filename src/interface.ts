/*
 * File: interface.ts
 * Project: server
 * File Created: Sunday, 8th September 2019 11:11:23 am
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 11th September 2019 12:41:07 am
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



import * as blessed from 'blessed';
import { Order } from './models/Order';
import { Position } from './models/Position';

export class Interface {

    private static _totalValue:      number;
    private static _totalIncrement:  number;
    private static _assetsValue:     number;
    private static _assetsIncrement: number;
    private static _cashValue:       number;
    private static _cashIncrement:   number;
    private static _successValue:    number;
    private static _strategy:        string;
    private static _marketStatus:    string;
    private static _orders:          Order[];
    private static _positions:       Position[];

    private static _screen: blessed.Widgets.Screen = blessed.screen({
        smartCSR:    true,
        dockBorders: true, // Link boxes together
    });
    // Define all colors used in the interface
    private static _colors: {[key: string]: string } = {
        kpiTitleFg:     '#29C38C',
        kpiValueFg:     '#919191',
        kpiIncrementFg: '#8EFFD7',
        border:         '#00403B',
        warn:           '#FF3A00',
        selectedLogFg:  '#ffffff',
        selectedLogBg:  '#333333'
    };
    // Defines all the methods used to display boxes content
    private static _contents: {[key: string]: ( arg1?: ( Order | Position ), arg2?: Order ) => string | string[] } = {
        total: () => `{${Interface._colors.kpiTitleFg}-fg}Total: {${Interface._colors.kpiValueFg}-fg}$${Interface._totalValue}{${Interface._colors.kpiValueFg}-fg} ({${Interface._colors.kpiIncrementFg}-fg}${Interface._totalIncrement} %{${Interface._colors.kpiValueFg}-fg}){/}`,
        assets: () => `{${Interface._colors.kpiTitleFg}-fg}Assets:{/} {${Interface._colors.kpiValueFg}-fg}$${Interface._assetsValue}{${Interface._colors.kpiValueFg}-fg} ({${Interface._colors.kpiIncrementFg}-fg}${Interface._assetsIncrement} %{${Interface._colors.kpiValueFg}-fg}){/}`,
        cash: () => `{${Interface._colors.kpiTitleFg}-fg}Cash:{/} {${Interface._colors.kpiValueFg}-fg}$${Interface._cashValue}{${Interface._colors.kpiValueFg}-fg} ({${Interface._colors.kpiIncrementFg}-fg}${Interface._cashIncrement} %{${Interface._colors.kpiValueFg}-fg}){/}`,
        success: () => `{${Interface._colors.kpiTitleFg}-fg}Success:{/} {${Interface._colors.kpiValueFg}-fg}({${ Interface._successValue >= 50 ? Interface._colors.kpiIncrementFg : Interface._colors.warn}-fg}${Interface._successValue} %{${Interface._colors.kpiValueFg}-fg}){/}`,
        strategy: () => `{${Interface._colors.kpiTitleFg}-fg}Strategy:{/} {${Interface._colors.kpiValueFg}-fg}${Interface._strategy}{/}`,
        market: () => {
            const date:          Date   = new Date();
            const hours:         number = (( date.getHours() - 6 ) % 24 + 24 ) % 24;
            const minutes:       number = date.getMinutes();
            const formattedDate: string = ( hours < 10 ? '0' + hours : hours ) + ':' + ( minutes < 10 ? '0' + minutes : minutes );

            return `${formattedDate} - ${Interface._marketStatus}`;
        },
        orders: ( arg1, arg2 ) => {
            const order1: Order = arg1 as Order;
            const order2: Order = arg2 as Order;
            const diff:   number = Math.round(( order1.filledAvgPrice * order1.quantity - order2.filledAvgPrice * order2.quantity ) * 100 ) / 100;
            return [
                `{${Interface._colors.kpiValueFg}-fg}${order1.createdAt.toUTCString()}{/}`,
                order1.side === 'buy' ? `{${Interface._colors.kpiIncrementFg}-fg}${order1.side.toUpperCase()}{/}` : `{${Interface._colors.warn}-fg}${order1.side.toUpperCase()}{/}`,
                `${order1.quantity} (${order1.filledQuantity}) x ${order1.symbol}`,
                `$${order1.filledAvgPrice ? order1.filledAvgPrice : 0} x ${order1.filledQuantity} = $${Math.ceil( order1.filledAvgPrice * order1.filledQuantity )}`,
                `${order1.type.toUpperCase()}`,
                `${order1.timeInForce.toUpperCase()}`,
                `${order1.status}`,
                diff < 0 ? `{${Interface._colors.warn}-fg}${diff}{/}` : `{${Interface._colors.kpiIncrementFg}-fg}${diff}{/}`
            ];
        },
        positions: ( arg ) => {
            const position: Position = arg as Position;
            return [
                `{bold}{${Interface._colors.kpiIncrementFg}-fg}${position.symbol}{/}`,
                `{${Interface._colors.kpiIncrementFg}-fg}${position.qty}{/}`,
                `$${position.marketValue}`,
                `$${position.currentPrice}`,
                position.changeToday > 0 ?  `{${Interface._colors.kpiIncrementFg}-fg}${Math.round( position.changeToday * 1000 ) / 1000 } %{/}` :
                                            `{${Interface._colors.warn}-fg}${Math.round( position.changeToday * 1000 ) / 1000 } %{/}`,
                `$${position.unrealizedPl}`,
                `$${position.unrealizedIntradayPl}`,
                `$${position.costBasis}`
            ];
        }
    }
    // Define all the tables used in the interface
    private static _tables: {[key: string]: blessed.Widgets.TableElement } = {
        // Orders table
        orders: blessed.table({
            top:        3,
            left:       0,
            width:      '100%',
            height:     '30%',
            tags:       true,
            scrollable: true,
            border: {
                type: 'line'
            },
            noCellBorders: true,
            fillCellBorders: true,
            style: {
                border: {
                    fg: Interface._colors.border,
                },
                header: {
                    fg: Interface._colors.kpiValueFg,
                    bg: Interface._colors.border,
                    bold: true
                }
            }
        }),
        // Positions table
        positions: blessed.table({
            top:        '50%',
            left:       0,
            width:      '100%',
            height:     '5%',
            tags:       true,
            scrollable: true,
            noCellBorders: true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                },
                header: {
                    fg: Interface._colors.kpiValueFg,
                    bg: Interface._colors.border,
                    bold: true
                },
            }
        })
    }
    // Define all the boxes used in the interface
    private static _boxes: {[key: string]: blessed.Widgets.BoxElement } = {
        total: blessed.box({
            top:     'top',
            left:    0,
            width:   '15%',
            height:  'shrink',
            content: Interface._contents.total() as string,
            tags:    true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                }
            }
        }),
        // Assets box
        assets: blessed.box({
            top:     'top',
            left:    '15%',
            width:   '15%',
            height:  'shrink',
            content: Interface._contents.assets() as string,
            tags:    true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                }
            }
        }),
        // Cash box
        cash: blessed.box({
            top:    'top',
            left:   '30%',
            width:  '15%',
            height: 'shrink',
            content: Interface._contents.cash() as string,
            tags:    true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                }
            }
        }),
        // Success box
        success: blessed.box({
            top:    'top',
            left:   '45%',
            width:  '15%',
            height: 'shrink',
            content: Interface._contents.success() as string,
            tags:    true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                }
            }
        }),
        // Strategy box
        strategy: blessed.box({
            top:    'top',
            left:   '60%',
            width:  '15%',
            height: 'shrink',
            content: Interface._contents.strategy() as string,
            tags:    true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                }
            }
        }),
        // Market box
        market: blessed.box({
            top:    'top',
            left:   '75%',
            width:  '25%',
            height: 'shrink',
            content: Interface._contents.market() as string,
            tags:    true,
            padding: {
                left: 1
            },
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: Interface._colors.border
                }
            }
        }),
    };
    
    // Define log list
    private static _logList: blessed.Widgets.ListElement = blessed.list({
        top:    '85%',
        width:  '100%',
        height: '15%',
        items: [],
        mouse: true,
        keys:  true,
        tags:    true,
        padding: {
            left: 1
        },
        border: {
            type: 'line',
        },
        style: {
            item: {
                fg: Interface._colors.border,
            },
            selected: {
                fg: Interface._colors.selectedLogFg,
                bg: Interface._colors.selectedLogBg,
            }
        }
    });

    /**
     * Update a set of boxes
     * 
     * Set boxes content to in-class content.
     * 
     * @private
     * @param {string[]} boxNames - Array of boxes
     */
    private static _updateBoxes ( boxNames: string[] ): void {
        for ( let i = 0, size = boxNames.length ; i < size ; i++ ) {
            const boxName: string = boxNames[i];
            Interface._boxes[boxName].setContent( Interface._contents[boxName]() as string );
        }
    }

    /**
     * Update a set of tables
     * 
     * Set tables content to in-class content.
     * 
     * @private
     * @param {string[]} tableNames - Array of tables
     */
    private static _updateTables ( tableNames: string[] ): void {
        const orders:    string[][] = [];
        const positions: string[][] = [];
        for ( let i = 0, size = Interface._orders.length ; i < size ; i++ ) {
            const order:     Order = Interface._orders[i];
            let   nextOrder: Order;
            if ( i < size - 1 ) {
                nextOrder = Interface._orders[i + 1];
            } else {
                nextOrder = order;
            }
            orders.push( Interface._contents['orders']( order as Order, nextOrder as Order ) as string[] );
        }
        for ( let i = 0, size = Interface._positions.length ; i < size ; i++ ) {
            const position: Position = Interface._positions[i];
            positions.push( Interface._contents['positions']( position as Position ) as string[] );
        }
        orders.unshift(
            [ 'Date',  'Operation', 'Vol (filled) x Symbol', 'Price', 'Order', 'Time in Force', 'Status', 'Profit/Loss' ]
        );
        positions.unshift(
            [ 'Symbol',  'Volume', 'Market Value', 'Price', 'Change', 'P&L', 'P&L Intraday', 'Cost' ]
        );
        Interface._tables['orders'].setData( orders );
        Interface._tables['positions'].setData( positions );
    }

    private static _recordState ( data: InterfacePayload ): void {
        Interface._totalValue      = Math.round( data.totalValue * 100 ) / 100;
        Interface._totalIncrement  = Math.round( data.totalIncrement * 100 ) / 100;
        Interface._assetsValue     = Math.round( data.assetsValue * 100 ) / 100;
        Interface._assetsIncrement = data.assetsValue ? Math.round( data.assetsIncrement * 100 ) / 100 : 0;
        Interface._cashValue       = Math.round( data.cashValue * 100 ) / 100;
        Interface._cashIncrement   = Math.round( data.cashIncrement * 100 ) / 100;
        Interface._successValue    = Math.round( data.successValue * 100 ) / 100;
        Interface._strategy        = data.strategy;
        Interface._marketStatus    = data.marketStatus;
        Interface._orders          = data.orders;
        Interface._positions       = data.positions;
    }

    /**
     * Update interface content
     * 
     * Record new content state in class.
     * Update all component with last content and
     * finally re-render the screen.
     * 
     * @public
     * @param data 
     */
    public static update ( data: InterfacePayload ): void {
        // Record new state
        Interface._recordState( data );

        // Update boxes
        Interface._updateBoxes( ['total', 'assets', 'cash', 'success', 'strategy', 'market'] );

        // Update tables
        Interface._updateTables( ['orders', 'positions'] );

        // Update log list
        Interface._logList.setContent( data.logs.join( '\n' ) );

        // Re-render screen
        Interface._screen.render();
    }

    /**
     * Bootstrap interface
     * 
     * Build interface with initial content.
     * 
     * @param {InterfacePayload} data - Initial interface content
     */
    public static setup ( data: InterfacePayload ): void {

        Interface._screen.title = 'SToX';
        Interface._screen.enableInput();
        Interface._screen.program.hideCursor();
        Interface._tables.orders.focus();

        // Append all box elements to the screen
        const boxKeys:     string[] = Object.keys( Interface._boxes );
        for ( let i = 0, boxesAmount = boxKeys.length ; i < boxesAmount ; i++ ) {
            const boxKey: string                     = boxKeys[i];
            const box:    blessed.Widgets.BoxElement = Interface._boxes[boxKey];
            Interface._screen.append( box );
        }

        // Append all table elements to the screen
        const tableKeys:     string[] = Object.keys( Interface._tables );
        for ( let i = 0, tableAmount = tableKeys.length ; i < tableAmount ; i++ ) {
            const tableKey: string                     = tableKeys[i];
            const table:    blessed.Widgets.BoxElement = Interface._tables[tableKey];
            Interface._screen.append( table );
        }

        // Append logList
        Interface._screen.append( Interface._logList );
        
        // Quit on Escape, q, or Control-C.
        Interface._screen.key(['escape', 'q', 'C-c'], function (ch, key) {
            return process.exit(0);
        });
        
        Interface.update( data );

    }
}

export interface InterfacePayload {

    totalValue:      number;
    totalIncrement:  number;
    assetsValue:     number;
    assetsIncrement: number;
    cashValue:       number;
    cashIncrement:   number;
    successValue:    number;
    strategy:        string;
    marketStatus:    string;
    orders:          Order[];
    positions:       Position[];
    logs:            string[];

}
