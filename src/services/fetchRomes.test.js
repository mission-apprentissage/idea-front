import fetchRomes from './fetchRomes';
import _ from 'lodash';

describe('fetchRomes', () => {

    it('skip : Should return an empty array if there is any wrong input', async () => {
      expect(await fetchRomes()).toEqual([]);
      expect(await fetchRomes(null)).toEqual([]);
      expect(await fetchRomes(/^/)).toEqual([]);
      expect(await fetchRomes(42)).toEqual([]);
      expect(await fetchRomes('')).toEqual([]);
      expect(await fetchRomes('  ')).toEqual([]);
    });

    it('nominal : Should return response.data.labelsAndRomes if remote API replied correctly', async () => {
      // given
      const value = 'plomberie'
      const urlMock = 'urlMock'
      const remoteResponse = {data: {labelsAndRomes: ['remotely_returned_array']}}
      const mockedErrorFn = jest.fn()
      const mockedRemoteCall = jest.fn().mockReturnValue(remoteResponse)
      const axiosMock = {get: mockedRemoteCall}
      // when
      const res = await fetchRomes(value, mockedErrorFn, urlMock, axiosMock)
      // then
      expect(mockedRemoteCall).toHaveBeenCalledWith('urlMock/romelabels', {params: { title: 'plomberie'}});
      expect(mockedErrorFn).not.toHaveBeenCalled()
      expect(res).toEqual(['remotely_returned_array']);
    });

    it('error case : axios returns an non-empty data.error property', async () => {
      // given
      const value = 'plomberie'
      const urlMock = 'urlMock'
      const remoteResponse = {data: {error: 'remote_error_message'}}
      const mockedRemoteCall = jest.fn().mockReturnValue(remoteResponse)
      const mockedErrorFn = jest.fn()
      const axiosMock = {get: mockedRemoteCall}
      // when
      const res = await fetchRomes(value, mockedErrorFn, urlMock, axiosMock)
      // then
      expect(res).toEqual([]);
      expect(mockedErrorFn).toHaveBeenCalled();
    });

    it('error case : axios do NOT returns expected data', async () => {
      // given
      const value = 'plomberie'
      const urlMock = 'urlMock'
      const mockedRemoteCall = jest.fn().mockReturnValue({data: {unexpected_prop: 'unexpected_val'}})
      const mockedErrorFn = jest.fn()
      const axiosMock = {get: mockedRemoteCall}
      // when
      const res = await fetchRomes(value, mockedErrorFn, urlMock, axiosMock)
      // then
      expect(res).toEqual([]);
      expect(mockedErrorFn).toHaveBeenCalled();
    });

    it('error case : user simulated an error through URL query param', async () => {
      // given
      const value = 'plomberie'
      const urlMock = 'urlMock'
      const mockedRemoteCall = jest.fn().mockReturnValue({data: {labelsAndRomes: ['remotely_returned_array']}})
      const mockedErrorFn = jest.fn()
      const axiosMock = {get: mockedRemoteCall}
      // when
      const res = await fetchRomes(value, mockedErrorFn, urlMock, axiosMock, {location:{search:'?romeError=true'}})
      // then
      expect(res).toEqual([]);
      expect(mockedErrorFn).toHaveBeenCalled();
    });

});
