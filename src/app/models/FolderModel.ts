import FileModel from './FileModel'

export class FolderModel {
  readonly ID: string
  readonly owner: string
  readonly files: FileModel[]

  constructor(obj: any) {
    this.ID = obj.ID
    this.owner = obj.owner
    this.files = []
    obj.files = obj.files || []
    obj.files.forEach((o: any) => {
      this.files.push(new FileModel(o))
    })
  }
}

export default FolderModel
