import { Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function withdrawNFT(token: number, wallet: Wallet, provider: Provider) {
  const w = await RWallet.fromEthSigner(wallet as any, provider);

  return w.withdrawNFT({
    to: wallet.address,
    token,
    feeToken: 'ETH',
  });
}
