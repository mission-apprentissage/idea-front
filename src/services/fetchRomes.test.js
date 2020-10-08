import fetchRomes from './fetchRomes';
import _ from 'lodash';

describe('fetchRomes', () => {

    it('Should return an empty array if no value is given', async () => {
      // given
      const value = null
      // when
      const res = await fetchRomes(value)
      // then
      expect(res).toEqual([]);
    });

    it('Should return response.data.labelsAndRomes if remote API replied correctly', async () => {
      // given
      const value = 'plomberie'
      const urlMock = 'urlMock'
      const remoteResponse = {data: {labelsAndRomes: ['remotely_returned_array']}}
      const mockedRemoteCall = jest.fn().mockReturnValue(remoteResponse)
      const axiosMock = {get: mockedRemoteCall}
      // when
      const res = await fetchRomes(value, urlMock, axiosMock)
      // then
      expect(res).toEqual(['remotely_returned_array']);
      expect(mockedRemoteCall).toHaveBeenCalledWith('urlMock/romelabels', {params: { title: 'plomberie'}});
    });

    it('Should return empty array if response.data.error is filled', async () => {
      // given
      const value = 'plomberie'
      const urlMock = 'urlMock'
      const remoteResponse = {data: {error: 'remote_error_message'}}
      const mockedRemoteCall = jest.fn().mockReturnValue(remoteResponse)
      const axiosMock = {get: mockedRemoteCall}
      // when
      const res = await fetchRomes(value, urlMock, axiosMock)
      // then
      expect(res).toEqual([]);
      expect(mockedRemoteCall).toHaveBeenCalledWith('urlMock/romelabels', {params: { title: 'plomberie'}});
    });

});
