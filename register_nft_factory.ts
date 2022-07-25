import { Wallet } from 'ethers';
import { RealloopNFTCustomFactory } from 'franklin-contracts/typechain/RealloopNFTCustomFactory';
import { RealloopNFTCustomFactoryFactory } from 'franklin-contracts/typechain/RealloopNFTCustomFactoryFactory';
import { Provider, Wallet as RWallet } from '@alonfalsing/realloop';

export async function deploy(
  name: string,
  symbol: string,
  wallet: Wallet,
  provider: Provider,
) {
  const { mainContract, govContract } = await provider.getContractAddress();

  const factory = new RealloopNFTCustomFactoryFactory(wallet as any);
  const nftFactoryContract = await factory.deploy(name, symbol, mainContract, govContract);

  return registerNFTFactory(nftFactoryContract, wallet, provider);
}

export async function registerNFTFactory(
  contract: RealloopNFTCustomFactory,
  wallet: Wallet,
  provider: Provider,
) {
  const w = await RWallet.fromEthSigner(wallet, provider);
  const { signature, accountId, accountAddress } = await w.signRegisterFactory(contract.address);

  return contract.registerNFTFactory(accountId, accountAddress, signature.signature);
}
