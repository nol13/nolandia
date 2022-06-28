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
    hardhatToken = await Token.deploy([owner.address, "0x9708ab788B9263992109EB13f453bC7A3348024A"], [50, 50]);
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
      const plotId = await hardhatToken.buyPlot(0, 0, 2, 2, { value: ethers.utils.parseEther("256") });
      const plotId2 = await hardhatToken.buyPlot(2, 0, 3, 1, { value: ethers.utils.parseEther("64") });
      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.not.equal(0);
      expect(await hardhatToken.parcels(0, 0)).to.equal(1);
      expect(await hardhatToken.parcels(2, 0)).to.equal(2);

      console.log(await hardhatToken.tokenURI(1));

      const bal1 = await hardhatToken.provider.getBalance(hardhatToken.address);
      //console.log(2, typeof bal1, bal1)

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
        const x = await hardhatToken['release(address)']("0x9708ab788B9263992109EB13f453bC7A3348024A");
      } catch {
        expect('should not error').to.equal(1);
      }

      expect(await hardhatToken.provider.getBalance(hardhatToken.address)).to.equal(0);

    });
  });

  /* 

    
     // console.log(await hardhatToken.parcels(0, 0));
     // console.log(await hardhatToken.parcels(2, 0));

      //  buyPlot(uint8 x1, uint8 y1, uint8 x2, uint8 y2

      //expect(await hardhatToken.getPixels()).to.equal(1000);
      //console.log(await hardhatToken.getPixels());
      //console.log(await hardhatToken.get());
      //ethers.utils.
      
      //const log = await hardhatToken.buyPixels([[40,1,2]], { value: ethers.utils.parseEther("1") })
      //console.log(await hardhatToken.pixels(1, 2));
      //console.log(log);

      //console.log(await hardhatToken.pixels(2, 5));
      //const log = await hardhatToken.buyPlot(2, 3, 4, 7, { value: "3" });

      //console.log(await hardhatToken.pixels(2, 5));

     // await hardhatToken.setPixelsColor([[54, 2, 5]]);

      //console.log(await hardhatToken.pixels(2, 5));



      //console.log(await hardhatToken.getPixels(5, 0));

      //await hardhatToken.buyPixels([{color: 52, x: 1, y: 1}]);
    
    
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    }); 
  
  
  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.transfer(addr1.address, 50);
      const addr1Balance = await hardhatToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await hardhatToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );

      // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from owner to addr2.
      await hardhatToken.transfer(addr2.address, 50);

      // Check balances.
      const finalOwnerBalance = await hardhatToken.balanceOf(
        owner.address
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatToken.balanceOf(
        addr1.address
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(
        addr2.address
      );
      expect(addr2Balance).to.equal(50);
    });
  }); */
});
