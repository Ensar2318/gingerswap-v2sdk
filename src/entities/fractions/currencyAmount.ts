import { currencyEquals } from '../token'
import { Currency, ETHER, SOMNIATESTNET } from '../currency'
import invariant from 'tiny-invariant'
import JSBI from 'jsbi'
import _Big from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, Rounding, TEN, SolidityType, ChainId } from '../../constants'
import { parseBigintIsh, validateSolidityTypeInstance } from '../../utils'
import { Fraction } from './fraction'

const Big = toFormat(_Big)

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  /**
   * Helper that calls the constructor with the appropriate currency based on chainId
   * @param amount amount in wei
   * @param chainId the chain ID as integer
   */
  public static getNativeCurrency(chainId: ChainId): Currency {
    switch (chainId) {
      case ChainId.SOMNIATESTNET: // Somnia Testnet
        return SOMNIATESTNET
      default:
        return ETHER
    }
  }

  /**
   * Helper that calls the constructor with the native currency for the given chainId
   * @param amount amount in wei
   * @param chainId the chain ID as integer
   */
  public static native(amount: BigintIsh, chainId: ChainId | undefined): CurrencyAmount {
    chainId == undefined ? ChainId.SOMNIATESTNET : chainId

    const nativeCurrency = this.getNativeCurrency(chainId!)
    return new CurrencyAmount(nativeCurrency, amount)
  }

  /**
   * Legacy helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */
  public static ether(amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(ETHER, amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = parseBigintIsh(amount)
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256)

    super(parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
} 