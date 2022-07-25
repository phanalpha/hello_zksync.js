import { Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function changePubKey(wallet: Wallet, provider: Provider) {
  const w = await RWallet.fromEthSigner(wallet, provider);

  return w.setSigningKey({
    feeToken: 'ETH',
    ethAuthType: 'ECDSA',
  });
}
