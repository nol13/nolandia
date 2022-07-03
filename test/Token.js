// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

const { expect } = require("chai");

describe("Token contract", function () {

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("Nolandia");
    // [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    [owner] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Token.deploy([owner.address, "0xe0e0104dd229C3A99B089d074DB9a4F89Db62559"], [50, 50]);
    await hardhatToken.deployed();

    // We can interact with the contract by calling `hardhatToken.method()`
    await hardhatToken.deployed();
  });

  describe("Nolandia", function () {

    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should buy plot and set the right parcel owner owner and split the payment", async function () {
      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.equal(0);
      //const plotId = await hardhatToken.buyPlot(0, 0, 2, 2, { value: ethers.utils.parseEther("256") });
      //const plotId2 = await hardhatToken.buyPlot(2, 0, 3, 1, { value: ethers.utils.parseEther("64") });
      const plotId = await hardhatToken.buyPlot(0, 0, 2, 2, { value: "256" });
      const receipt1 = await plotId.wait();
      const plotId2 = await hardhatToken.buyPlot(2, 0, 3, 1, { value: "64" });
      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.not.equal(0);
      expect(await hardhatToken.parcels(0, 0)).to.equal(1);
      expect(await hardhatToken.parcels(2, 0)).to.equal(2);

      //console.log(await hardhatToken.tokenURI(1));

      const bal1 = await hardhatToken.provider.getBalance(hardhatToken.address);
      //console.log(receipt1)

      expect(receipt1.events[0].event).to.equal("Transfer");
      expect(receipt1.events[1].event).to.equal("PlotPurchased");

      try {
        const x = await hardhatToken['release(address)']("0x5acc84a3e955bdd76467d3348077d003f00ffb97")
        expect('should error before here').to.equal(1);
      } catch {
        expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.not.equal(0);
      }

      try {
        const x = await hardhatToken['release(address)'](owner.address);
      } catch {
        expect('should not error').to.equal(1);
      }
      
      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).not.to.equal(0);
      const bal2 = await hardhatToken.provider.getBalance(hardhatToken.address);
      expect(bal1.gt(bal2)).to.equal(true);

      try {
        const x = await hardhatToken['release(address)']("0xe0e0104dd229C3A99B089d074DB9a4F89Db62559");
      } catch {
        expect('should not error').to.equal(1);
      }

      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.equal(0);

    });

    it("Should draw pixels", async function async () {
      try {
        const x = Array(256).fill(169);
        const plotId1 = await hardhatToken.buyPlot(2, 2, 3, 3, { value: "64" });
        const plotId2 = await hardhatToken.setPixels(x, 1, { value: "" });
        const receipt1 = await plotId2.wait();
        expect(receipt1.events[0].event).to.equal("PlotPixelsSet");
      } catch(e) {
        expect('should not error').to.equal(1);
      }
    });

  });
});
