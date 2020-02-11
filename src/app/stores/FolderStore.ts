import { observable, action } from 'mobx'
import { matchPath } from 'react-router-dom'
import { RouterStore } from 'app/stores/RouterStore'
import { FolderModel, FileModel } from 'app/models'
import { Client, Entity } from '@textile/threads-client'
import uuid from 'uuid'

export class FolderStore {

  public static shortID(uuid: string): string {
    return uuid.replace(/-/g, '')
  }

  public static cleanID(uuid: string): string {
    const id = this.shortID(uuid)
    return id.substr(0, 8) + '-' +
      id.substr(8, 4) + '-' +
      id.substr(12, 4) + '-' +
      id.substr(16, 4) + '-' +
      id.substr(20)
  }

  @observable public folders: FolderModel[] = []
  @observable public folder: FolderModel = new FolderModel({})

  private finderID: string | undefined
  private folderID: string | undefined
  private router: RouterStore

  private readonly host: string
  private client: Client

  constructor(router: RouterStore, host: string) {
    this.router = router
    this.host = host
    this.client = new Client({host: this.host})
  }

  @action public async createFinder() {
    const store = await this.client.newStore()
    await this.client.registerSchema(store.id, 'Folder2', schema)
    await this.client.start(store.id)
    this.finderID = store.id
    return FolderStore.shortID(this.finderID)
  }

  @action public async loadFinder() {
    const match = matchPath(this.router.location.pathname, {
      path: '/finder/:finderID',
      exact: true,
      strict: false
    })
    if (match === undefined) {
      return
    }
    const { finderID } = match.params as any
    this.finderID = FolderStore.cleanID(finderID)
    console.debug('Finder:', this.finderID)

    // Find existing folders
    const found = await this.client.modelFind(this.finderID, 'Folder2', {})
    this.folders = found.entitiesList.map((entity: any) => entity).map((obj: any) => {
      return new FolderModel(obj)
    })

    // @todo: Enable listening to an entire store.
  }

  @action public async addFolder(owner: string) {
    const created = await this.client.modelCreate(this.finderID, 'Folder2', [{
      owner,
      files: []
    }])
    const folders = created.entitiesList
    this.folders.push(new FolderModel(folders.pop()))
  }

  @action public async loadFolder() {
    const match = matchPath(this.router.location.pathname, {
      path: '/finder/:finderID/folder/:folderID',
      exact: true,
      strict: false
    })
    if (match === undefined) {
      return
    }
    const { finderID, folderID } = match.params as any
    this.finderID = FolderStore.cleanID(finderID)
    console.debug('Finder:', this.finderID)
    this.folderID = FolderStore.cleanID(folderID)
    console.debug('Folder:', this.folderID)

    // Find existing files
    const found = await this.client.modelFindByID(this.finderID, 'Folder2', this.folderID)
    this.folder = new FolderModel(found.entity)

    await this.client.listen<FolderModel>(this.finderID, 'Folder2', this.folderID, (reply: Entity<FolderModel>) => {
      console.debug('Folder updated...', reply.entity.ID)
    })
  }

  @action public async addFile(domFile: File) {
    const file = new FileModel({
      ID: uuid.v4(),
      name: domFile.name,
      cid: '',
      isDirectory: false,
      files: []
    })
    this.folder.files.push(file)
    await this.client.modelSave(this.finderID, 'Folder2', [this.folder])
  }
}

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  $ref: '#/definitions/folder',
  definitions: {
    file: {
      required: [
        'ID',
        'name',
        'cid',
        'isDirectory',
        'files'
      ],
      properties: {
        ID: {
          type: 'string'
        },
        cid: {
          type: 'string'
        },
        files: {
          items: {
            $ref: '#/definitions/file'
          },
          type: 'array'
        },
        isDirectory: {
          type: 'boolean'
        },
        name: {
          type: 'string'
        }
      },
      additionalProperties: false,
      type: 'object'
    },
    folder: {
      required: [
        'ID',
        'owner',
        'files'
      ],
      properties: {
        ID: {
          type: 'string'
        },
        files: {
          items: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            $ref: '#/definitions/file'
          },
          type: 'array'
        },
        owner: {
          type: 'string'
        }
      },
      additionalProperties: false,
      type: 'object'
    }
  }
}
