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
      const axiosResponse = {data: {labelsAndRomes: ['remotely_returned_array']}}
      // const axiosResponse = _.set({}, 'response.data.labelsAndRomes', ['remotely_returned_array']) 
      const axiosMock = {
        get: function() {
          console.log("axiosResponse", axiosResponse);
          // See https://www.leighhalliday.com/mocking-axios-in-jest-testing-async-functions
          // return () => Promise.resolve(axiosResponse)
          // return Promise.resolve(axiosResponse)
          return axiosResponse
        }
      }
      // when
      const res = await fetchRomes(value, 'urlMock', axiosMock)
      // then
      expect(res).toEqual(['remotely_returned_array']);
    });

});
