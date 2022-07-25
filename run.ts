import { ethers, Wallet } from 'ethers';
import { getDefaultProvider, Provider } from '@alonfalsing/realloop';

import fs from 'node:fs/promises';
import path from 'node:path';

import { logj } from './logj';

export interface Zoo {
  connect: (_: string) => Promise<ethers.Contract>;
  wallets: Wallet[];
  provider: Provider;
  log: (_: any) => void;
}

export async function run(f: (_: Zoo) => Promise<void>) {
  // 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle'
  const keys = [
    // 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049
    // "7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
    // 0xa61464658AfeAf65CccaaFD3a512b69A83B77618
    "ac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3",
    // 0x0D43eB5B8a47bA8900d84AA36656c92024e9772e
    "d293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e",
    // 0xA13c10C0D5bd6f79041B9835c63f91de35A15883
    "850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8",
  ];
  const p = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

  await f({
    connect: async function (address: string) {
      const abi = await fs.readFile(path.join(__dirname, 'ERC721-ABI.json'), { encoding: 'utf-8' });

      return new ethers.Contract(address, abi, p);
    },
    wallets: keys.map(k => new Wallet(k, p)),
    provider: await getDefaultProvider('localhost'),
    log: logj,
  });
}

export function inject(f: (...args: any[]) => Promise<void>) {
  return async function (...args: any[]) {
    await run(z => f(z, ...args));
  };
}
