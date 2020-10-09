import fetchDiplomas from './fetchDiplomas';

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
});
