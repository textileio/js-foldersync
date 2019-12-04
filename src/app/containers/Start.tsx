import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router-dom'
import {Grid, Button, Icon} from 'semantic-ui-react'
import { RouterStore, FolderStore } from 'app/stores'
import {
  STORE_ROUTER,
  STORE_FOLDER
} from 'app/constants'

export interface StartProps extends RouteComponentProps<any> {
  [STORE_ROUTER]: RouterStore
  [STORE_FOLDER]: FolderStore
}

export interface StartState {
  loading: boolean
}

@inject(STORE_FOLDER, STORE_ROUTER)
@observer
class Start extends React.Component<StartProps, StartState> {
  constructor(props: StartProps, context: any) {
    super(props, context)
    this.state = {
      loading: false
    }
  }

  handleClick = () => {
    this.createFinder().catch((err) => {
      console.error(err)
    })
  }

  async createFinder() {
    this.setState(() => ({loading: true}))
    const folderStore = this.props[STORE_FOLDER] as FolderStore
    const storeID = await folderStore.createFinder()
    const routerStore = this.props[STORE_ROUTER] as RouterStore
    routerStore.push('/finder/' + storeID)
  }

  render() {
    return (
      <Grid verticalAlign='middle' className='full' columns={2} centered inverted>
        <Grid.Row>
          <Grid.Column className='text-centered'>
            <Button
              loading={this.state.loading}
              icon
              labelPosition='right'
              secondary
              size='big'
              onClick={this.handleClick}
            >
              <Icon name='arrow right' /> Create new finder
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Start
