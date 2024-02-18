import storage from 'electron-json-storage';


export function getSettings() {
  const dataPath = storage.getDataPath();
  console.log(dataPath);
  storage.set('settings', { name: 'Electron', type: 'app' })
  storage.getAll(function(error: any, data: any) {
    if (error) throw error;
    console.log(data);
  });
}
