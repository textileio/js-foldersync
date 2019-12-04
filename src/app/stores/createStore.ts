import { History } from 'history'
import { FolderStore } from './FolderStore'
import { RouterStore } from './RouterStore'
import { STORE_FOLDER, STORE_ROUTER } from 'app/constants'

export function createStores(history: History, host: string) {
  const routerStore = new RouterStore(history)
  const folderStore = new FolderStore(routerStore, host)
  return {
    [STORE_FOLDER]: folderStore,
    [STORE_ROUTER]: routerStore
  }
}
