// @flow

import React, { Component } from 'react'
import { connect, type MapStateToProps } from 'react-redux'
import { type NavigationScreenProp } from 'react-navigation'

import { Container } from 'native-base'

import type { Dispatch, AnyAction } from '../actions/types'
import type { LoggedInUserState } from '../reducers/user'
import ProfileComponent from '../components/ProfileComponent'

type Props = {
  user: LoggedInUserState,
  navigation: NavigationScreenProp<*, AnyAction>,
  dispatch: Dispatch
}

/**
 * This screen show the profile to the authenticated user.
 */
class ProfileScreen extends Component<Props> {
  render() {
    const { user, navigation, dispatch } = this.props

    return (
      <Container>
        <ProfileComponent
          user={user}
          navigation={navigation}
          dispatch={dispatch}
        />
      </Container>
    )
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = (state: Object) => ({
  user: state.user,
  navigation: state.navigation
})

module.exports = connect(mapStateToProps)(ProfileScreen)
