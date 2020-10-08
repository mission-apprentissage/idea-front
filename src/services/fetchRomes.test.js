import fetchRomes from './fetchRomes';
import _ from 'lodash';

describe('fetchRomes', () => {

    it('empty : Should return an empty array if no value is given', async () => {
      // given
      // when
      const res = await fetchRomes()
      // then
      expect(res).toEqual([]);
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
      expect(res).toEqual(['remotely_returned_array']);
      expect(mockedRemoteCall).toHaveBeenCalledWith('urlMock/romelabels', {params: { title: 'plomberie'}});
      expect(mockedErrorFn).not.toHaveBeenCalled()
    });

    it('error : Should return undefined, and call the error callback', async () => {
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
      expect(res).toEqual(undefined);
      expect(mockedRemoteCall).toHaveBeenCalledWith('urlMock/romelabels', {params: { title: 'plomberie'}});
      expect(mockedErrorFn).toHaveBeenCalled();
    });

});
