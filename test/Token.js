// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

const { expect } = require("chai");

const weiCostPerPx = 1000000000000000;
const baseUri = "ftp://lol.com/";

describe("Token contract", function () {

  let Token;
  let hardhatToken;
  let deployer;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Nolandia");
    // [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    [deployer, newOwner, acct3, acct4, acct5] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Token.deploy([deployer.address, "0xe0e0104dd229C3A99B089d074DB9a4F89Db62559"], [75, 25], baseUri, newOwner.address);
    await hardhatToken.deployed();

    // We can interact with the contract by calling `hardhatToken.method()`
    await hardhatToken.deployed();
  });

  describe("Nolandia", function () {

    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).not.to.equal(deployer.address);
      expect(await hardhatToken.owner()).to.equal(newOwner.address);
    });

    it("Should buy plot and set the right parcel owner owner and split the payment", async function () {
      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.equal(0);
      //const plotId = await hardhatToken.buyPlot(0, 0, 2, 2, { value: ethers.utils.parseEther("256") });
      //const plotId2 = await hardhatToken.buyPlot(2, 0, 3, 1, { value: ethers.utils.parseEther("64") });
      const plotId = await hardhatToken.buyPlot(0, 0, 2, 2, { value: (256 * weiCostPerPx).toString() });
      const receipt1 = await plotId.wait();
      const plotId2 = await hardhatToken.buyPlot(2, 0, 3, 1, { value: (64 * weiCostPerPx).toString() });
      
      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.equal(0);
      expect(await hardhatToken.parcels(0, 0)).to.equal(1);
      expect(await hardhatToken.parcels(2, 0)).to.equal(2);

      expect(await hardhatToken.tokenURI(1)).to.equal(baseUri + '1');

      const bal1 = await hardhatToken.provider.getBalance(hardhatToken.address);

      expect(receipt1.events[0].event).to.equal("Transfer");
      expect(receipt1.events[1].event).to.equal("PlotPurchased");

      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.equal(0);

    });

    it("Should draw pixels", async function async () {
      try {
        const x = Array(256).fill(169);
        const plotId1 = await hardhatToken.buyPlot(2, 2, 3, 3, { value: (64 * weiCostPerPx).toString() });
        const plotId2 = await hardhatToken.setPixels(x, 0, 1, { value: "" });
        const receipt1 = await plotId2.wait();
        expect(receipt1.events[0].event).to.equal("PlotPixelsSet");
        const dBal = ethers.utils.formatEther(await ethers.provider.getBalance(deployer.address));
        const noBal = ethers.utils.formatEther(await ethers.provider.getBalance(newOwner.address));
        const opBal = ethers.utils.formatEther(await ethers.provider.getBalance("0xe0e0104dd229C3A99B089d074DB9a4F89Db62559"));
        console.log({dBal, opBal, noBal})
       
      } catch(e) {
        expect('should not error').to.equal(1);
        console.log(e)
        
      }
      const plotId23 = await hardhatToken.tokenURI(1, { value: "" });
      console.log(plotId23, 2)
    });

    it('Should not allow deployer to premint', async () => {
      let failed = false;
      try{
        const plotId3 = await hardhatToken.preMintPlot(6, 0, 7, 1, { value: "" });
      }
      catch {
        failed = true;
      }
      expect(failed).to.equal(true)
    })

    it('Should allow new owner to premint', async () => {
      let failed = false;
      try {
        const plotId3 = await hardhatToken.connect(newOwner).preMintPlot(6, 0, 7, 1, { value: "" });
      }
      catch (e) {
        console.log(e)
        failed = true;
      }
      expect(failed).to.equal(false)
    })

  });
});
