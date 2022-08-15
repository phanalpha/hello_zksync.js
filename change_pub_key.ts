import { BigNumberish, Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function changePubKey(wallet: Wallet, provider: Provider, opts?: { fee?: BigNumberish }) {
  const w = await RWallet.fromEthSigner(wallet as any, provider);

  return w.setSigningKey({
    ...opts,
    feeToken: 'ETH',
    ethAuthType: 'ECDSA',
  });
}
