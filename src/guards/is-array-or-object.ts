import { PlainObject } from '@src/types';
import { isPlainObject } from './is-plain-object';
import { isArray } from './is-array';

export const isArrayOrObject = (value: unknown): value is [] | PlainObject => {
  return isPlainObject(value) || isArray(value);
};
