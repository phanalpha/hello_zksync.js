import dotenv from 'dotenv';
import { ethers, Wallet } from 'ethers';
import { ZkSyncNFTCustomFactoryFactory } from 'franklin-contracts/typechain/ZkSyncNFTCustomFactoryFactory';
import { getDefaultProvider, Provider, Wallet as ZkWallet, utils } from 'zksync';
import * as fs from 'fs';
import * as process from 'process';

const env = dotenv.parse(fs.readFileSync(`${process.env['ZKSYNC_HOME']}/etc/env/dev.env`));
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
// 'stuff slice staff easily soup parent arm payment cotton trade scatter struggle'
const wallets = [
    // 0x36615Cf349d7F6344891B1e7CA7C72883F5dc049
    // "7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110",
    // 0xa61464658AfeAf65CccaaFD3a512b69A83B77618
    "ac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3",
    // 0x0D43eB5B8a47bA8900d84AA36656c92024e9772e
    "d293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e",
    // 0xA13c10C0D5bd6f79041B9835c63f91de35A15883
    "850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8",
].map(k => (new Wallet(k)).connect(provider));

async function setupWallet(wallet: Wallet, provider: Provider) {
    const w = await ZkWallet.fromEthSigner(wallet as any, provider);
    w.accountId = await w.getAccountId()
    console.log(w.accountId);
    // await w.setSigningKey({
    //     feeToken: 'ETH',
    //     ethAuthType: 'ECDSA',
    // });
    console.log(await w.getCurrentPubKeyHash());
    console.log(await w.signer?.pubKeyHash());

    return w;
}

export async function deploy(wallet: Wallet, zk_wallet: ZkWallet) {
    const factory = new ZkSyncNFTCustomFactoryFactory(wallet as any);
    const nftFactoryContract = await factory.deploy(
        'ZkSync2', 'ZKS2', env['CONTRACTS_CONTRACT_ADDR'], env['CONTRACTS_GOVERNANCE_ADDR']);
    console.log(`CONTRACTS_NFT_FACTORY_ADDR=${nftFactoryContract.address}`);
    const { signature, accountId, accountAddress } = await zk_wallet.signRegisterFactory(nftFactoryContract.address);
    const tx = await nftFactoryContract.registerNFTFactory(accountId, accountAddress, signature.signature);
    console.log(tx.hash);
    const receipt = await tx.wait();
    console.log(receipt.status);
}

export async function mint(creator: ZkWallet, recipient: ZkWallet) {
    const tx = await creator.mintNFT({
	recipient: recipient.address(),
	contentHash: '0xbd7289936758c562235a3a42ba2c4a56cbb23a263bb8f8d27aead80d74d9d996',
	feeToken: 'ETH',
    });
    console.log(tx.txHash);
    console.log(tx.state);
    const receipt = await tx.awaitReceipt();
    console.log(`success: ${receipt.success}`);
    console.log(receipt.block?.blockNumber);
}

export async function swap(submitter: ZkWallet, seller: ZkWallet, buyer: ZkWallet, token: number, price: number) {
    const ask = await seller.getOrder({
        tokenSell: token,
        tokenBuy: 'ETH',
        ratio: utils.tokenRatio({
            [token]: 1,
            ETH: price,
            $earnest: price / 10,
        }),
        amount: 1,
    });
    console.log(`Order(accountId=${ask.accountId}, recipient=${ask.recipient}, nonce=${ask.nonce}, ` +
        `tokenSell=${ask.tokenSell}, tokenBuy=${ask.tokenBuy}, ratio=[${ask.ratio[0]}, ${ask.ratio[1]}, ${ask.ratio[2]}], ` +
        `amount=${ask.amount}, signature=(${ask.signature?.pubKey}, ${ask.signature?.signature}), ...)`);

    const bid = await buyer.getOrder({
        tokenSell: 'ETH',
        tokenBuy: token,
        ratio: utils.tokenRatio({
            ETH: price / 10,
            [token]: 0,
            $earnest: 1,
        }),
        amount: String(price / 10 * 1e18),
    });
    console.log(`Order(accountId=${bid.accountId}, recipient=${bid.recipient}, nonce=${bid.nonce}, ` +
        `tokenSell=${bid.tokenSell}, tokenBuy=${bid.tokenBuy}, ratio=[${bid.ratio[0]}, ${bid.ratio[1]}, ${bid.ratio[2]}], ` +
        `amount=${bid.amount}, signature=(${bid.signature?.pubKey}, ${bid.signature?.signature}), ...)`);

    const tx = await submitter.syncSwap({
        orders: [ask, bid],
        feeToken: 'ETH',
    });
    console.log(tx.txHash);
    console.log(tx.state);
    const receipt = await tx.awaitReceipt();
    console.log(`success: ${receipt.success}`);
    console.log(receipt.block?.blockNumber);
}

(async function () {
    const provider = await getDefaultProvider('localhost');
    const zk_wallets: ZkWallet[] = [];
    for (const w of wallets) {
        zk_wallets.push(await setupWallet(w, provider));
    }

    // await deploy(wallets[0], zk_wallets[0]);
    // CONTRACTS_NFT_FACTORY_ADDR=0x64D72188aEb903DBb9cD936e10c87Ed37e5b9ecb
    // 0x47e20b20ad5a7aab3eb8609834d1489336c0201fc79b5091f400c20ef86be9d0
    // 1

    // await mint(zk_wallets[0], zk_wallets[1]);

    await swap(zk_wallets[0], zk_wallets[1], zk_wallets[2], 65537, 1);
})();
