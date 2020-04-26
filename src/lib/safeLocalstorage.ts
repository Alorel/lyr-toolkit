import {noop} from 'lodash-es';

let safeLocalStorage: Pick<Storage, 'setItem' | 'getItem'>;

if (typeof localStorage !== 'undefined') {
  safeLocalStorage = localStorage;
} else {
  safeLocalStorage = {
    getItem() {
      return null;
    },
    setItem: noop
  };
}

export default safeLocalStorage;
