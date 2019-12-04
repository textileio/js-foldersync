import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import {Table, Button, Checkbox, Icon } from 'semantic-ui-react'
import { RouterStore, FolderStore } from 'app/stores'
import {
  STORE_ROUTER,
  STORE_FOLDER
} from 'app/constants'
import Dropzone, {DropzoneRef} from 'react-dropzone'

export interface FolderProps extends RouteComponentProps<any> {
  [STORE_ROUTER]: RouterStore
  [STORE_FOLDER]: FolderStore
}

export interface FolderState {
  loading: boolean
}

@inject(STORE_FOLDER, STORE_ROUTER)
@observer
class Folder extends React.Component<FolderProps, FolderState> {
  dropzoneRef: React.RefObject<DropzoneRef> = React.createRef()

  constructor(props: FolderProps, context: any) {
    super(props, context)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    const folderStore = this.props[STORE_FOLDER] as FolderStore
    folderStore.loadFolder().catch((err) => {
      console.error(err)
    })
  }

  handleAddFileClick = () => {
    this.dropzoneRef.current.open()
  }

  handleAddFiles = (files: File[]) => {
    this.setState(() => ({loading: true}))

    const folderStore = this.props[STORE_FOLDER] as FolderStore
    files.forEach((file) => {
      folderStore.addFile(file).catch((err) => {
        console.error(err)
      })
    })

    this.setState(() => ({loading: false}))
  }

  handleRowClick = (fileID: string) => {
    console.debug('File', fileID)
  }

  render() {
    const files = this.props.folder.folder.files

    const body = files.map((file) => {
      return <Table.Row key={file.ID} onClick={() => this.handleRowClick(file.ID)}>
          <Table.Cell collapsing>
            <Checkbox disabled />
          </Table.Cell>
          <Table.Cell>{file.name}</Table.Cell>
          <Table.Cell>{file.files.length}</Table.Cell>
        </Table.Row>
    })

    return (
      <Dropzone ref={this.dropzoneRef} onDrop={this.handleAddFiles}>
        {({getRootProps, getInputProps}) => (
          <div className='full' {...getRootProps({
            onClick: (event) => event.stopPropagation()
          })}>
            <input {...getInputProps()} />
            <Table selectable inverted striped compact singleLine>
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Files</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{body}</Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan='3'>
                    <Button
                      loading={this.state.loading}
                      icon
                      labelPosition='left'
                      secondary
                      onClick={this.handleAddFileClick}
                    >
                      <Icon name='add circle' /> Add file
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </div>
        )}
      </Dropzone>
    )
  }
}

export default Folder
