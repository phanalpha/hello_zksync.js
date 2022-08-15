import { BigNumberish, Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function withdrawNFT(token: number, wallet: Wallet, provider: Provider, opts?: { fee?: BigNumberish }) {
  const w = await RWallet.fromEthSigner(wallet as any, provider);

  return w.withdrawNFT({
    ...opts,
    to: wallet.address,
    token,
    feeToken: 'ETH',
  });
}
