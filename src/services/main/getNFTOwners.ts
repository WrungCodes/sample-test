import { AddressTokens } from "../../interfaces/api-types";
import { MoralisService } from "../moralis-service";

export async function getNFTOwners( address: string) : Promise<AddressTokens[]> {
    const addressTokens : Map<string, AddressTokens> = new Map()

    const moralisService = new MoralisService()
    let cursor = null
    
    do {
        const response = await moralisService.getNFTOwners({
            chain: 'eth',
            format: 'decimal',
            limit: 200,
            cursor,
            normalizeMetadata: false,
            media_items: false,
            address
        });
        cursor = response.cursor

        response.result.forEach(obj => {
            let currentOwnerTokens = addressTokens.get(obj.owner_of);
            if (!currentOwnerTokens) {
                currentOwnerTokens = { owner: obj.owner_of, tokens: [] };
                addressTokens.set(obj.owner_of, currentOwnerTokens);
            }
            currentOwnerTokens.tokens.push(obj.token_id);
        });

      } while (cursor !== null);

    return Array.from(addressTokens.values());
}