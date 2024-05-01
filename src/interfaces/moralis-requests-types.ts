export interface GetNFTOwnersRequest {
    chain: string
    format: string
    limit: number
    cursor: string | null
    normalizeMetadata: boolean
    media_items: boolean
    address: string
}

export interface NtfOwners{
    token_id: string
    owner_of: string
}

export interface GetNFTOwnersResponse {
    status: string
    page: number
    page_size: number
    cursor: string | null
    result: NtfOwners[]
}
