import storage from 'electron-json-storage';
import { promisify } from 'util';


export function setSettings(key, options) {
  storage.set(key, options);
}

const storageGetAsync = promisify(storage.get);

export async function getSettings(key) {
  try {
    const data = await storageGetAsync(key);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
