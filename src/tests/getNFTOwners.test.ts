import { getNFTOwners } from '../services/main/getNFTOwners';
import { MoralisService } from '../services/moralis-service/index';

const mockgetNFTOwners = jest.fn();

jest.mock('../services/moralis-service/index', () => {
    return {
      MoralisService: jest.fn().mockImplementation(() => {
        return {
          getNFTOwners: mockgetNFTOwners
        };
      })
    };
  });

//   jest.mock('../services/moralis-service/index', () => {

//   })
  
describe('getNFTOwners', () => {
    let mockMoralisService: MoralisService;

    beforeEach(() => {
        mockMoralisService = new MoralisService();
        jest.clearAllMocks();
    });

    it('returns a list of AddressTokens', async () => {
        mockgetNFTOwners.mockResolvedValue({
            status: '',
            page: 1,
            page_size: 2,
            cursor: null,
            result: [
                { token_id: '1', owner_of: 'owner1' },
                { token_id: '2', owner_of: 'owner2' }
            ]
        });

        const result = await getNFTOwners('0x...');
        expect(result).toEqual([
            { owner: 'owner1', tokens: ['1'] },
            { owner: 'owner2', tokens: ['2'] }
        ]);
    });

    it('returns a list of AddressTokens with multiple addresses', async () => {
        mockgetNFTOwners.mockResolvedValue({
            status: '',
            page: 1,
            page_size: 6,
            cursor: null,
            result: [
                { token_id: '1', owner_of: 'owner1' },
                { token_id: '2', owner_of: 'owner2' },
                { token_id: '3', owner_of: 'owner1' },
                { token_id: '4', owner_of: 'owner1' },
                { token_id: '5', owner_of: 'owner2' },
                { token_id: '6', owner_of: 'owner3' },
            ]
        });

        const result = await getNFTOwners('0x...');
        expect(result).toEqual([
            { owner: 'owner1', tokens: ['1', '3', '4'] },
            { owner: 'owner2', tokens: ['2', '5'] },
            { owner: 'owner3', tokens: ['6'] }
        ]);
    });

    it('returns a list of AddressTokens and handles pagination correctly', async () => {
        mockgetNFTOwners.mockResolvedValueOnce({
            status: '',
            page: 1,
            page_size: 1,
            cursor: 'example1-cursor',
            result: [{ token_id: '1', owner_of: 'owner1' }]
        })
        .mockResolvedValueOnce({
            status: '',
            page: 2,
            page_size: 1,
            cursor: 'example2-cursor',
            result: [{ token_id: '2', owner_of: 'owner1' }]
        })
        .mockResolvedValueOnce({
            status: '',
            page: 3,
            page_size: 1,
            cursor: null,
            result: [{ token_id: '3', owner_of: 'owner1' }]
        });

        const result = await getNFTOwners('0x...');
        expect(result).toEqual([
            { owner: 'owner1', tokens: ['1', '2', '3'] }
        ]);
        expect(mockMoralisService.getNFTOwners).toHaveBeenCalledTimes(3);
    });

    it('returns an empty array when no NFT owners are found', async () => {
        mockgetNFTOwners.mockResolvedValue({
            status: '',
            page: 1,
            page_size: 1,
            cursor: null,
            result: []
        });

        const result = await getNFTOwners('0x...');
        expect(result).toEqual([]);
    });

    it('throws an error when the API call fails', async () => {
        mockgetNFTOwners.mockRejectedValue(new Error('API Error'));

        await expect(getNFTOwners('0x123')).rejects.toThrow('API Error');
    });
});
