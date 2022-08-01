/* global Moralis */

Moralis.Cloud.define("SetDrawnPixels", async (request) => {

    if (!request.params.plotId) return "no plot";

    try {
        const options = {
            chain: "mumbai",
            address: "0x7A0dDB55e6084862d3B048b2896f4747ae405e37",
            function_name: "ownerOf",
            abi: [{
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "ownerOf",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }],
            params: { tokenId: request.params.plotId },
        };
        const owner = (await Moralis.Web3API.native.runContractFunction(options)).toLowerCase();
        const userAddress = request.user.get("ethAddress").toLowerCase();
        if (owner === userAddress && request.params.imageData?.length) {
            const plotId = parseInt(request.params.plotId);
            const PlotData = Moralis.Object.extend("PlotData");
            const query = new Moralis.Query(PlotData);
            query.equalTo("plotId", plotId);
            const plotToDraw = await query.first();
            const plotToUpdate = plotToDraw || new PlotData();
            if (!plotToDraw) plotToUpdate.set("plotId", plotId);
            plotToUpdate.set("imageData", request.params.imageData);
            await plotToUpdate.save();
            return "image data saved"
        } else {
            return "you don't own that";
        }
    } catch(e) {
        return e.message;
    }

}, { requireUser: true });

