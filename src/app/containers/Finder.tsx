import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import {Table, Checkbox, Input} from 'semantic-ui-react'
import { RouterStore, FolderStore } from 'app/stores'
import {
  STORE_ROUTER,
  STORE_FOLDER
} from 'app/constants'

export interface FinderProps extends RouteComponentProps<any> {
  [STORE_ROUTER]: RouterStore
  [STORE_FOLDER]: FolderStore
}

// tslint:disable-next-line:no-empty-interface
export interface FinderState {
  input: string,
  loading: boolean
}

@inject(STORE_FOLDER, STORE_ROUTER)
@observer
class Finder extends React.Component<FinderProps, FinderState> {
  constructor(props: FinderProps, context: any) {
    super(props, context)
    this.state = {
      input: '',
      loading: false
    }
  }

  componentDidMount() {
    const folderStore = this.props[STORE_FOLDER] as FolderStore
    folderStore.loadFinder().catch((err) => {
      console.error(err)
    })
  }

  handleAddFolderClick = () => {
    this.setState(() => ({loading: true}))
    const folderStore = this.props[STORE_FOLDER] as FolderStore
    folderStore.addFolder(this.state.input).then(() => {
      this.setState(() => ({input: '', loading: false}))
    }).catch((err) => {
      console.error(err)
    })
  }

  handleAddFolderKeyPress = (e: any) => {
    if (e.charCode === 32 || e.charCode === 13) {
      e.preventDefault()
      this.handleAddFolderClick()
    }
  }

  handleInputChange = (e: any) => {
    this.setState({ input: e.target.value })
  }

  handleRowClick = (folderID: string) => {
    const routerStore = this.props[STORE_ROUTER] as RouterStore
    const id = FolderStore.shortID(folderID)
    let path = routerStore.location.pathname
    if (path[path.length - 1] === '/') {
      path = path.slice(0, -1)
    }
    routerStore.push(path + '/folder/' + id)
  }

  render() {
    const folders = this.props.folder.folders
    const body = folders.map((folder) => {
      return <Table.Row key={folder.ID} onClick={() => this.handleRowClick(folder.ID)}>
          <Table.Cell collapsing>
            <Checkbox disabled />
          </Table.Cell>
          <Table.Cell>{folder.owner}</Table.Cell>
          <Table.Cell>{folder.files.length}</Table.Cell>
        </Table.Row>
    })

    return (
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
              <Input
                loading={this.state.loading}
                inverted
                action={{
                  content: 'Create new folder',
                  onClick: this.handleAddFolderClick
                }}
                icon='folder'
                iconPosition='left'
                placeholder='Folder name...'
                onKeyPress={this.handleAddFolderKeyPress}
                value={this.state.input}
                onChange={this.handleInputChange}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }
}

export default Finder
