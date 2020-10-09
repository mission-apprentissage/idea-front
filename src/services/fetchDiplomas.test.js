import fetchDiplomas from './fetchDiplomas';
import _ from 'lodash';

describe('fetchDiplomas', () => {

    it('skip : Should return an empty array if there is any wrong input', async () => {
      expect(await fetchDiplomas()).toEqual([]);
      expect(await fetchDiplomas(null)).toEqual([]);
      expect(await fetchDiplomas(/^/)).toEqual([]);
      expect(await fetchDiplomas(42)).toEqual([]);
      expect(await fetchDiplomas('')).toEqual([]);
      expect(await fetchDiplomas('  ')).toEqual([]);
      expect(await fetchDiplomas([])).toEqual([]);
      expect(await fetchDiplomas(['', ' '])).toEqual([]);
    });

    it('nominal : Should return response.data if remote API replied correctly', async () => {
      // given
      const mockedErrorFn = jest.fn();
      const mockedAxiosGet = jest.fn().mockReturnValue({data: ['remotely_returned_array']})
      const axiosMock = {get: mockedAxiosGet}
      // when
      const res = await fetchDiplomas(["D1208", "D1203"], mockedErrorFn, 'urlMock', axiosMock, {}, _.noop)
      // then
      expect(mockedErrorFn).not.toHaveBeenCalled()
      expect(mockedAxiosGet).toHaveBeenCalledWith("urlMock/jobsdiplomas", {"params": {"romes": "D1208,D1203"}})
      expect(res).toEqual(['remotely_returned_array']);
    });
});
