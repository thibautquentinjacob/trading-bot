import { Strategy } from '../Strategy';
import { StrategicDecision } from '../StragegicDecision';
import { StockData } from '../StockData';

export class RSIStrategy extends Strategy {

    constructor () {
        super();
        this._name      = 'RSI';
        this.indicators = {
            rsi: {
                name:    'rsi',
                options: [7],
                metrics:  ['open'],
                output:  ['output']
            },
            macd: {
                name:    'macd',
                options: [1, 8, 6],
                metrics:  ['open'],
                output:  ['short', 'long', 'signal']
            },
            sma12: {
                name:    'sma',
                options: [12],
                metrics:  ['open'],
                output:  ['output']
            },
            sma26: {
                name:    'sma',
                options: [26],
                metrics:  ['open'],
                output:  ['output']
            }
        };
    }

    /**
     * Provided market data, should we buy or not.
     * If rsi <= 31 and mac < -0.3 -> BUY
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldBuy( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        const timeDiffMinutes: number   = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const rsiName:         string   = this.indicators.rsi.fullName || '';
        const macdName:        string   = this.indicators.macd.fullName || '';
        const rsiOutput:       number[] = data.indicators[rsiName]['output'];
        const macdOutput:      number[] = data.indicators[macdName]['long'];
        const rsi:             number   = rsiOutput[rsiOutput.length - 1];
        const macd:            number   = macdOutput[macdOutput.length - 1];
        const price:           number   = data.open[data.open.length - 1];
        
        if (( rsi <= 31 && macd < -0.3 ) && timeDiffMinutes > 15 ) {
            return {
                amount:   -1,
                price:    price,
                decision: true
            };
        } else {
            return {
                amount:   0,
                price:    price,
                decision: false
            };
        }
    }

    /**
     * Provided market data, should we sell or not.
     * If ( macd < 0 and rsi >= 60 ) or rsi >= 80 -> SELL
     *
     * @public
     * @param {StockData} data - Stock data + required indicators
     * @returns {StrategicDecision}
     */
    public shouldSell( data: StockData ): StrategicDecision {
        const dates:           Date[] = data.dates as Date[];
        // const currentDate:     Date   = new Date( dates[dates.length - 1]);
        const closingDate:     Date   = new Date( dates[dates.length - 1]);
        closingDate.setHours( 22, 0, 0 );
        // const timeDiffMinutes: number   = ( closingDate.getTime() - currentDate.getTime()) / ( 1000 * 60 );
        const rsiName:         string   = this.indicators.rsi.fullName || '';
        const macdName:        string   = this.indicators.macd.fullName || '';
        const rsiOutput:       number[] = data.indicators[rsiName]['output'];
        const macdOutput:      number[] = data.indicators[macdName]['long'];
        const rsi:             number   = rsiOutput[rsiOutput.length - 1];
        const macd:            number   = macdOutput[macdOutput.length - 1];
        const price:           number   = data.open[data.open.length - 1];

        if (( macd < 0 && rsi >= 60 ) || rsi >= 80 ) {
            return {
                amount:   -1,
                price:    price,
                decision: true
            };
        } else {
            return {
                amount:   0,
                price:    price,
                decision: false
            };
        }
    }

}
