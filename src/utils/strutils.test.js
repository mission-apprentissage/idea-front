import {isNonEmptyString} from './strutils';

describe('strutils', () => {

    it('.isNonEmptyString : Should return false for empty String', async () => {
      expect(isNonEmptyString('')).toEqual(false);
      expect(isNonEmptyString(' ')).toEqual(false);
      expect(isNonEmptyString('   ')).toEqual(false);
    });

    it('.isNonEmptyString : Should return false for wrong input', async () => {
      expect(isNonEmptyString()).toEqual(false);
      expect(isNonEmptyString(/^/)).toEqual(false);
      expect(isNonEmptyString(1,2,3)).toEqual(false);
    });

    it('.isNonEmptyString : Should return true for a String that is not empty', async () => {
      expect(isNonEmptyString('a')).toEqual(true);
      expect(isNonEmptyString('hello world')).toEqual(true);
      expect(isNonEmptyString('   t   ')).toEqual(true);
    });


});
