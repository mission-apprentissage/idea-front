import fetchRomes from './fetchRomes';

describe('fetchRomes', () => {

    it('Should return an empty array if no value is given', async () => {
      // given
      const value = null
      // when
      const res = await fetchRomes(value)
      // then
      expect(res).toEqual([]);

    });

});
