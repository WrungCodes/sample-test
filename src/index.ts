import { getNFTOwners } from "./services/main/getNFTOwners";

(async function main() {
    const constract = '0xa5bb28eecc6134f89745e34ec6ab5d5bcb16dad7'
    const data = await getNFTOwners(constract)
    console.log(data)
  })();