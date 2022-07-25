import { Command } from 'commander';

import { inject } from './run';
import { deposit } from './deposit';
import { changePubKey } from './change_pub_key';
import { deploy } from './register_nft_factory';
import { mint } from './mint';
import { withdrawNFT } from './withdraw_nft';
import { list } from './list';
import { swap } from './swap';

(async function () {
  const program = new Command('r');

  program.command('deposit <amount> <wallets...>')
    .action(inject(async function ({ wallets, provider, log }, amount, is) {
      for (const i of is) {
        const op = await deposit(amount, wallets[i], provider);
        const r = await op.awaitReceipt();

        log(r);
      }
    }));

  program.command('change-pub-key <wallets...>')
    .action(inject(async function ({ wallets, provider, log }, is) {
      for (const i of is) {
        const tx = await changePubKey(wallets[i], provider);
        const r = await tx.awaitReceipt();

        log(r);
      }
    }));

  program.command('deploy <name> <symbol> <wallet>')
    .action(inject(async function ({ wallets, provider, log }, name, symbol, i) {
      const tx = await deploy(name, symbol, wallets[i], provider);
      const r = await tx.wait();

      log(r);
    }));

  program.command('mint <content-hash> <recipient> <creator>')
    .action(inject(async function ({ wallets, provider, log }, content_hash, recipient, creator) {
      const tx = await mint(content_hash, wallets[recipient], wallets[creator], provider);
      const r = await tx.awaitReceipt();

      log(r);
    }));

  program.command('withdraw-nft <token> <wallet>')
    .action(inject(async function ({ wallets, provider, log }, token, i) {
      const tx = await withdrawNFT(parseInt(token), wallets[i], provider);
      const r = await tx.awaitReceipt();

      log(r);
    }));

  program.command('balance-of <address> <wallet>')
    .action(inject(async function ({ connect, wallets }, address, i) {
      const contract = await connect(address);
      const balance = await contract.functions.balanceOf(wallets[i].address);

      console.log(`balanceOf(${wallets[i].address}): ${balance}`);
    }));

  program.command('owner-of <address> <token>')
    .action(inject(async function ({ connect }, address, token) {
      const contract = await connect(address);
      const owner = await contract.functions.ownerOf(token);

      console.log(`ownerOf(${token}): ${owner}`);
    }));

  program.command('list <wallet> <token> <price>')
    .option('--bid')
    .action(inject(async function (z, i, token, price, options) {
      await list(z.wallets[i], options.bid, +token, +price, z);
    }));

  program.command('swap <submitter> <seller> <buyer> <token> <price>')
    .action(inject(async function (z, submitter, seller, buyer, token, price) {
      await swap(z.wallets[submitter], z.wallets[seller], z.wallets[buyer], +token, +price, z);
    }));

  await program.parseAsync();
})();
