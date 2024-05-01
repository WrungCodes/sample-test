import axios, {isCancel, AxiosError, AxiosInstance} from 'axios';
import 'dotenv/config'
import { GetNFTOwnersRequest, GetNFTOwnersResponse } from "../../interfaces/moralis-requests-types";
require('dotenv').config()

export class MoralisService {
    client: AxiosInstance
    constructor() {
        this.client = axios.create({
            baseURL: process.env.MORALIS_URL,
            headers: {
                'X-API-Key': process.env.MORALIS_API_KEY
            }
          });
    }

    async getNFTOwners( request: GetNFTOwnersRequest) : Promise<GetNFTOwnersResponse> {
        try {
            const response = await this.client.get(`nft/${request.address}/owners`, {
                params: request
            })
            const data = response.data as GetNFTOwnersResponse
            return data;
        } catch (error) {
            console.log(error)
            throw new Error('Error Retreiving Owner NFTS')
        }
    }
}