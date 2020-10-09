import _ from 'lodash'

const isNonEmptyString = (val) => _.isString(val) && val.trim().length > 0

export { isNonEmptyString };
