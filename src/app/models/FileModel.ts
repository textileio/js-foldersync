export class FileModel {
  readonly ID: string
  readonly name: string
  readonly cid: string

  readonly isDirectory: boolean
  readonly files: FileModel[]

  constructor(obj: any) {
    this.ID = obj.ID
    this.name = obj.name
    this.cid = obj.cid
    this.isDirectory = obj.isDirectory
    this.files = []
    obj.files = obj.files || []
    obj.files.forEach((o: any) => {
      this.files.push(new FileModel(o))
    })
  }
}

export default FileModel
