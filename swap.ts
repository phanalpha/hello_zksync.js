import { Wallet } from 'ethers';
import { Provider, Wallet as RWallet, utils } from '@alonfalsing/realloop';

import { getOrder } from './list';
import { Zoo } from './run';

export async function swap(
  submitter: Wallet,
  seller: Wallet,
  buyer: Wallet,
  token: number,
  price: number,
  { provider, log }: Zoo,
) {
  const ask = await getOrder(await RWallet.fromEthSigner(seller, provider), false, token, price);
  log(ask);

  const bid = await getOrder(await RWallet.fromEthSigner(buyer, provider), true, token, price);
  log(bid);

  const w = await RWallet.fromEthSigner(submitter, provider);
  const tx = await w.syncSwap({
    orders: [ask, bid],
    feeToken: 'ETH',
  });
  const r = await tx.awaitReceipt();
  log(r);
}
