import axios from 'axios';
import { Wallet } from 'ethers';
import { Wallet as RWallet, utils } from '@alonfalsing/realloop';

import { Zoo } from './run';

export async function getOrder(wallet: RWallet, bid: boolean, token: number, price: number) {
  if (!bid) {
    return wallet.getOrder({
      tokenSell: token,
      tokenBuy: 'ETH',
      ratio: utils.tokenRatio({
        [token]: 1,
        ETH: price,
        $earnest: price / 10,
      }),
      amount: 1,
    });
  } else {
    return wallet.getOrder({
      tokenSell: 'ETH',
      tokenBuy: token,
      ratio: utils.tokenRatio({
        [token]: 0,
        ETH: price / 10,
        $earnest: 1,
      }),
      amount: String(price / 10 * 1e18),
    });
  }
}

export async function list(wallet: Wallet, bid: boolean, token: number, price: number, { provider, log }: Zoo) {
  const w = await RWallet.fromEthSigner(wallet as any, provider);
  const o = await getOrder(w, bid, token, price);
  log(o);

  const r = await axios.post('http://127.0.0.1:3001/api/v0.2/orders', o);
  log(r);
}
