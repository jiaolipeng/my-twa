import { useEffect, useState } from "react";
import NFTCollection from "../contracts/nftCollection";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract, Cell, ContractProvider } from "ton-core";

export function useNFTCollectionContract() {
  const client = useTonClient();
  const [collectionData, setCollectionData] = useState<null | {
    nextItemIndex: string;
    content: string;
    owner: string;
  }>();
  const { sender, address } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  let royalty = 0.05;
  let collectionContentUri =
    "https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/my_collection1.json";
  let nftItemContentBaseUri =
    "https://raw.githubusercontent.com/ton-blockchain/token-contract/main/nft/web-example/";
  let collectionCode = Cell.fromBoc(
    Buffer.from(
      "B5EE9C724102140100021F000114FF00F4A413F4BCF2C80B0102016202030202CD04050201200E0F04E7D10638048ADF000E8698180B8D848ADF07D201800E98FE99FF6A2687D20699FEA6A6A184108349E9CA829405D47141BAF8280E8410854658056B84008646582A802E78B127D010A65B509E58FE59F80E78B64C0207D80701B28B9E382F970C892E000F18112E001718112E001F181181981E0024060708090201200A0B00603502D33F5313BBF2E1925313BA01FA00D43028103459F0068E1201A44343C85005CF1613CB3FCCCCCCC9ED54925F05E200A6357003D4308E378040F4966FA5208E2906A4208100FABE93F2C18FDE81019321A05325BBF2F402FA00D43022544B30F00623BA9302A402DE04926C21E2B3E6303250444313C85005CF1613CB3FCCCCCCC9ED54002C323401FA40304144C85005CF1613CB3FCCCCCCC9ED54003C8E15D4D43010344130C85005CF1613CB3FCCCCCCC9ED54E05F04840FF2F00201200C0D003D45AF0047021F005778018C8CB0558CF165004FA0213CB6B12CCCCC971FB008002D007232CFFE0A33C5B25C083232C044FD003D0032C03260001B3E401D3232C084B281F2FFF2742002012010110025BC82DF6A2687D20699FEA6A6A182DE86A182C40043B8B5D31ED44D0FA40D33FD4D4D43010245F04D0D431D430D071C8CB0701CF16CCC980201201213002FB5DAFDA89A1F481A67FA9A9A860D883A1A61FA61FF480610002DB4F47DA89A1F481A67FA9A9A86028BE09E008E003E00B01A500C6E",
      "hex"
    )
  );
  let itemCode = Cell.fromBoc(
    Buffer.from(
      "B5EE9C7241020D010001D0000114FF00F4A413F4BCF2C80B0102016202030202CE04050009A11F9FE00502012006070201200B0C02D70C8871C02497C0F83434C0C05C6C2497C0F83E903E900C7E800C5C75C87E800C7E800C3C00812CE3850C1B088D148CB1C17CB865407E90350C0408FC00F801B4C7F4CFE08417F30F45148C2EA3A1CC840DD78C9004F80C0D0D0D4D60840BF2C9A884AEB8C097C12103FCBC20080900113E910C1C2EBCB8536001F65135C705F2E191FA4021F001FA40D20031FA00820AFAF0801BA121945315A0A1DE22D70B01C300209206A19136E220C2FFF2E192218E3E821005138D91C85009CF16500BCF16712449145446A0708010C8CB055007CF165005FA0215CB6A12CB1FCB3F226EB39458CF17019132E201C901FB00104794102A375BE20A00727082108B77173505C8CBFF5004CF1610248040708010C8CB055007CF165005FA0215CB6A12CB1FCB3F226EB39458CF17019132E201C901FB000082028E3526F0018210D53276DB103744006D71708010C8CB055007CF165005FA0215CB6A12CB1FCB3F226EB39458CF17019132E201C901FB0093303234E25502F003003B3B513434CFFE900835D27080269FC07E90350C04090408F80C1C165B5B60001D00F232CFD633C58073C5B3327B5520BF75041B",
      "hex"
    )
  );

  const createDeploy = () => {
    if (!client) {
      alert("Client is null");
      return;
    }

    let royaltyAddress = Address.parse(address);
    let contract = NFTCollection.createForDeploy(
      collectionCode[0],
      Address.parse(address),
      collectionContentUri,
      nftItemContentBaseUri,
      itemCode[0],
      royalty,
      royaltyAddress
    );

    return client.open(contract);
  };

  let nftCollectionContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new NFTCollection(
      Address.parse("EQDFtxOmBZCSvXBtxD9qCc_IDMsSXlkKh3_0EIfhhHCGtXgz") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<NFTCollection>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!nftCollectionContract) return;
      setCollectionData(null);
      const val = await nftCollectionContract.getCollectionData();
      setCollectionData(val);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [nftCollectionContract]);

  return {
    collectionInfo: collectionData,
    nftCollectionAddress: nftCollectionContract?.address.toString(),
    deployNFTCollection: () => {
      let nftCollectionProvider = createDeploy();
      console.log(nftCollectionProvider);
      return nftCollectionProvider?.sendDeploy(sender);
    },
  };
}
