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

            const Mints = Moralis.Object.extend("Mints3");
            const mintQuery = new Moralis.Query(Mints);
            mintQuery.equalTo("plotId_string", plotId.toString());
            const plotToDrawInfo = await mintQuery.first();

            if (!plotToDrawInfo) return "plot doesnt exist";

            const x1 = plotToDrawInfo.get('x1');
            const y1 = plotToDrawInfo.get('y1');
            const x2 = plotToDrawInfo.get('x2');
            const y2 = plotToDrawInfo.get('y2');

            const xDiff = x2 - x1;
            const yDiff = y2 - y1;
            const expectedLength = (xDiff * yDiff * 64 * 4);

            if (request.params.imageData.length !== expectedLength) return "wrong length data";

            const clampedImageData = Array.from(new Uint8ClampedArray(request.params.imageData));



            const plotToUpdate = plotToDraw || new PlotData();
            if (!plotToDraw) plotToUpdate.set("plotId", plotId);
            plotToUpdate.set("imageData", clampedImageData);
            await plotToUpdate.save(null, { useMasterKey: true });
            return "image data saved"
        } else {
            return "you don't own that";
        }
    } catch(e) {
        return e.message;
    }

}, { requireUser: true });

