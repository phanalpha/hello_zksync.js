import { BigNumberish, Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function mint(
  contentHash: string,
  permanentId: BigNumberish,
  recipient: Wallet,
  creator: Wallet,
  provider: Provider,
  opts?: { fee?: BigNumberish },
) {
  const w = await RWallet.fromEthSigner(creator as any, provider);

  return w.mintNFT({
    ...opts,
    recipient: recipient.address,
    contentHash,
    permanentId,
    feeToken: 'ETH',
  });
}
