import { Currency } from '../currency';
import JSBI from 'jsbi';
import { BigintIsh, Rounding, ChainId } from '../../constants';
import { Fraction } from './fraction';
export declare class CurrencyAmount extends Fraction {
    readonly currency: Currency;
    /**
     * Helper that calls the constructor with the appropriate currency based on chainId
     * @param amount amount in wei
     * @param chainId the chain ID as integer
     */
    static getNativeCurrency(chainId: ChainId): Currency;
    /**
     * Helper that calls the constructor with the native currency for the given chainId
     * @param amount amount in wei
     * @param chainId the chain ID as integer
     */
    static native(amount: BigintIsh, chainId: ChainId | undefined): CurrencyAmount;
    /**
     * Legacy helper that calls the constructor with the ETHER currency
     * @param amount ether amount in wei
     */
    static ether(amount: BigintIsh): CurrencyAmount;
    protected constructor(currency: Currency, amount: BigintIsh);
    get raw(): JSBI;
    add(other: CurrencyAmount): CurrencyAmount;
    subtract(other: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: object): string;
}
