/*
 * File: Logger.ts
 * Project: server
 * File Created: Wednesday, 5th June 2019 9:58:35 pm
 * Author: Thibaut Jacob (thibautquentinjacob@gmail.com)
 * -----
 * Last Modified: Wednesday, 5th June 2019 10:20:52 pm
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



import { writeFile } from 'fs';

export class Logger {

    private _outputPath!:    string;
    private _useTimestamps!: boolean;

    get outputPath (): string {
        return this._outputPath;
    }

    set outputPath ( outputPath: string ) {
        this._outputPath = outputPath;
    }

    get useTimestamps (): boolean {
        return this._useTimestamps;
    }

    set useTimestamps ( useTimestamps: boolean ) {
        this._useTimestamps = useTimestamps;
    }

    constructor ( outputPath: string ) {
        this.outputPath    = outputPath;
        this.useTimestamps = true;
    }

    public log ( message: string ): Promise<boolean> {
        return new Promise(( resolve, reject ) => {
            // If we use timestamps, format date and append it to the message
            if ( this.useTimestamps ) {
                const date: Date = new Date();
                message = `${date.toISOString()} ${message}\n`;
            } else {
                message = `${message}\n`;
            }
            writeFile( this._outputPath, message, { flag: 'a' }, ( err: any ) => {
                resolve( true );
            });
        });
    }

}
