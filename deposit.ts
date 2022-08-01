import { BigNumberish, Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function deposit(amount: BigNumberish, wallet: Wallet, provider: Provider) {
  const w = await RWallet.fromEthSigner(wallet as any, provider);

  return w.depositToSyncFromEthereum({
    depositTo: wallet.address,
    token: 'ETH',
    amount,
  });
}
