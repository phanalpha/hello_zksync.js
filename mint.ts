import { Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function mint(
  contentHash: string,
  recipient: Wallet,
  creator: Wallet,
  provider: Provider,
) {
  const w = await RWallet.fromEthSigner(creator, provider);

  return w.mintNFT({
    recipient: recipient.address,
    contentHash,
    feeToken: 'ETH',
  });
}
