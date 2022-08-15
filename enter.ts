import { Wallet } from 'ethers';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function enter(wallet: Wallet, provider: Provider) {
    const w = await RWallet.fromEthSigner(wallet as any, provider);

    return w.enter();
}
