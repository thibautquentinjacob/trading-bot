import { StrategicDecision } from './StragegicDecision';
import { Logger } from './Logger';
import { Indicator } from './Indicator';
import { StockData } from './StockData';

export class Strategy {

    protected _name!: string;
    protected _indicators: {
        [key: string]: Indicator
    };
    
    get name (): string {
        return this._name;
    }

    get indicators (): {[key: string]: Indicator } {
        return this._indicators;
    }

    set indicators ( indicators: {[key: string]: Indicator }) {
        this._indicators = indicators;
        // Build indicator full names
        const indicatorKeys: string[] = Object.keys( this.indicators );
        for ( let i = 0, size = indicatorKeys.length ; i < size ; i++ ) {
            const indicatorKey:     string   = indicatorKeys[i];
            const indicatorName:    string   = this.indicators[indicatorKey].name;
            const indicatorOptions: number[] = this.indicators[indicatorKey].options;
            this.indicators[indicatorKey].fullName = `${indicatorName}_${indicatorOptions.join( '_' )}`;
        }
    }
    
    constructor () {
        this._indicators = {};
    }

    // Provided market data, should we buy or not
    public shouldBuy( data: StockData, logger?: Logger ): StrategicDecision {
        return {
            amount:   0,
            price:    0,
            decision: false
        };
    }

    // Provided market data, should we sell or not
    public shouldSell( data: StockData, logger?: Logger ): StrategicDecision {
        return {
            amount:   0,
            price:    0,
            decision: false
        };
    }

}
