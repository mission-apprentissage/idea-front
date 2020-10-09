import fetchRomes from './fetchRomes';

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
      const mockedErrorFn = jest.fn().mockName('mockedErrorFn');
      const axiosMockGet = jest.fn().mockReturnValue({data: {labelsAndRomes: ['remotely_returned_array']}})
      const axiosStub = {get: axiosMockGet}
      // when
      const res = await fetchRomes('plomberie', mockedErrorFn, 'urlMock', axiosStub, {location:{href:'anyurl.com?romeError=false'}}, console.log)
      // then
      expect(axiosMockGet).toHaveBeenCalledWith("urlMock/romelabels", {"params": {"title": "plomberie"}});
      expect(mockedErrorFn).not.toHaveBeenCalled()
      expect(res).toEqual(['remotely_returned_array']);
    });

    it('error case : axios returns an non-empty data.error property', async () => {
      // given
      const mockedErrorFn = jest.fn().mockName('mockedErrorFn');
      const mockedLoggerFn = jest.fn().mockName('mockedLoggerFn');
      const axiosStub = {get: jest.fn().mockReturnValue({data: {error: 'remote_error_message'}})}
      // when
      const res = await fetchRomes('plomberie', mockedErrorFn, 'urlMock', axiosStub, {location:{href:'anyurl.com?romeError=false'}}, mockedLoggerFn)
      // then
      expect(mockedErrorFn).toHaveBeenCalled();
      expect(mockedLoggerFn).toHaveBeenCalledWith("Rome API error", "Rome API error remote_error_message");
      expect(res).toEqual([]);
    });

    it('error case : axios do NOT returns expected data', async () => {
      // given
      const mockedErrorFn = jest.fn().mockName('mockedErrorFn');
      const mockedLoggerFn = jest.fn().mockName('mockedLoggerFn');
      const axiosStub = {get: jest.fn().mockReturnValue({data: {unexpected_prop: 'unexpected_val'}})}
      // when
      const res = await fetchRomes('plomberie', mockedErrorFn, 'urlMock', axiosStub, {location:{href:'anyurl.com?romeError=false'}}, mockedLoggerFn)
      // then
      expect(mockedErrorFn).toHaveBeenCalled();
      expect(mockedLoggerFn).toHaveBeenCalledWith("Rome API error : API call worked, but returned unexpected data");
      expect(res).toEqual([]);
    });

    it('error case : user simulated an error through URL query param', async () => {
      // given
      const mockedErrorFn = jest.fn().mockName('mockedErrorFn');
      const mockedLoggerFn = jest.fn().mockName('mockedLoggerFn');
      const axiosStub = {get: jest.fn().mockReturnValue({data: {labelsAndRomes: ['remotely_returned_array']}})}
      // when
      const res = await fetchRomes('plomberie', mockedErrorFn, 'urlMock', axiosStub, {location:{href:'anyurl.com?romeError=true'}}, mockedLoggerFn)
      // then
      expect(mockedErrorFn).toHaveBeenCalled();
      expect(mockedLoggerFn).toHaveBeenCalledWith("Rome API error simulated with a query param :)");
      expect(res).toEqual([]);
    });

});
