/*
 * File: index.d.ts
 * Project: server
 * File Created: Monday, 3rd June 2019 9:56:56 pm
 * Author: Licoffe (p1lgr11m@gmail.com)
 * -----
 * Last Modified: Monday, 3rd June 2019 9:56:58 pm
 * Modified By: Licoffe (p1lgr11m@gmail.com>)
 * -----
 * License:
 * MIT License
 * 
 * Copyright (c) 2019 Licoffe
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



// Type definitions for Tulind [~OPTIONAL VERSION NUMBER~]
// Project: tulipnode
// Definitions by: Thibaut Jacob <thibautquentinjacob@gmail.com>

export as namespace tulind;

// Tulind types
// Indicator type
export interface Indicator {
    name:         string;
    full_name:    string;
    type:         string;
    inputs:       number;
    outputs:      number;
    input_names:  string[];
    option_names: string[];
    output_names: string[];
    indicator:    (
        inputs: number[][],
        options: number[],
        outputs: ( err: string, results: number[][]) => void
    ) => void;
    start:        ( options: number[] ) => number;
}

// Tulind properties
export const version: string;
export const indicators: {
    abs:             Indicator,
    acos:            Indicator,
    ad:              Indicator,
    add:             Indicator,
    adosc:           Indicator,
    adx:             Indicator,
    adxr:            Indicator,
    ao:              Indicator,
    apo:             Indicator,
    aroon:           Indicator,
    aroonosc:        Indicator,
    asin:            Indicator,
    atan:            Indicator,
    atr:             Indicator,
    avgprice:        Indicator,
    bbands:          Indicator,
    bop:             Indicator,
    cci:             Indicator,
    ceil:            Indicator,
    cmo:             Indicator,
    cos:             Indicator,
    cosh:            Indicator,
    crossany:        Indicator,
    crossover:       Indicator,
    cvi:             Indicator,
    decay:           Indicator,
    dema:            Indicator,
    di:              Indicator,
    div:             Indicator,
    dm:              Indicator,
    dpo:             Indicator,
    dx:              Indicator,
    edecay:          Indicator,
    ema:             Indicator,
    emv:             Indicator,
    exp:             Indicator,
    fisher:          Indicator,
    floor:           Indicator,
    fosc:            Indicator,
    hma:             Indicator,
    kama:            Indicator,
    kvo:             Indicator,
    lag:             Indicator,
    linreg:          Indicator,
    linregintercept: Indicator,
    linregslope:     Indicator,
    ln:              Indicator,
    log10:           Indicator,
    macd:            Indicator,
    marketfi:        Indicator,
    mass:            Indicator,
    max:             Indicator,
    md:              Indicator,
    medprice:        Indicator,
    mfi:             Indicator,
    min:             Indicator,
    mom:             Indicator,
    msw:             Indicator,
    mul:             Indicator,
    natr:            Indicator,
    nvi:             Indicator,
    obv:             Indicator,
    ppo:             Indicator,
    psar:            Indicator,
    pvi:             Indicator,
    qstick:          Indicator,
    roc:             Indicator,
    rocr:            Indicator,
    round:           Indicator,
    rsi:             Indicator,
    sin:             Indicator,
    sinh:            Indicator,
    sma:             Indicator,
    sqrt:            Indicator,
    stddev:          Indicator,
    stderr:          Indicator,
    stoch:           Indicator,
    stochrsi:        Indicator,
    sub:             Indicator,
    sum:             Indicator,
    tan:             Indicator,
    tanh:            Indicator,
    tema:            Indicator,
    todeg:           Indicator,
    torad:           Indicator,
    tr:              Indicator,
    trima:           Indicator,
    trix:            Indicator,
    trunc:           Indicator,
    tsf:             Indicator,
    typprice:        Indicator,
    ultosc:          Indicator,
    var:             Indicator,
    vhf:             Indicator,
    vidya:           Indicator,
    volatility:      Indicator,
    vosc:            Indicator,
    vwma:            Indicator,
    wad:             Indicator,
    wcprice:         Indicator,
    wilders:         Indicator,
    willr:           Indicator,
    wma:             Indicator,
    zlema:           Indicator
};
