/**
 * An ingress screen to choose the real first screen the user must navigate to.
 */
import * as pot from "italia-ts-commons/lib/pot";
import { Body, Container, List, ListItem, Spinner, Text } from "native-base";
import * as React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import BaseScreenComponent, {
  ContextualHelpPropsMarkdown
} from "../../components/screens/BaseScreenComponent";
import I18n from "../../i18n";
import { startApplicationInitialization } from "../../store/actions/application";
import { ReduxProps } from "../../store/actions/types";
import {
  sessionInfoSelector,
  sessionTokenSelector
} from "../../store/reducers/authentication";
import { profileSelector } from "../../store/reducers/profile";
import { GlobalState } from "../../store/reducers/types";
import variables from "../../theme/variables";
import SectionStatusComponent from "../../components/SectionStatus";
import { IngressCheckBox } from "./CheckBox";

type Props = ReduxProps & ReturnType<typeof mapStateToProps>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: variables.contentPaddingLarge,
    backgroundColor: variables.brandPrimary
  }
});

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "startup.contextualHelp.title",
  body: "startup.contextualHelp.body"
};

class IngressScreen extends React.PureComponent<Props> {
  public componentDidMount() {
    // Dispatch START_APPLICATION_INITIALIZATION to initialize the app
    this.props.dispatch(startApplicationInitialization());
  }

  public render() {
    const items = [
      {
        enabled: this.props.hasSessionToken,
        label: I18n.t("startup.authentication")
      },
      {
        enabled: this.props.hasSessionInfo,
        label: I18n.t("startup.sessionInfo")
      },
      { enabled: this.props.hasProfile, label: I18n.t("startup.profileInfo") },
      {
        enabled: this.props.isProfileEnabled,
        label: I18n.t("startup.profileEnabled")
      }
    ];
    return (
      <BaseScreenComponent
        goBack={false}
        contextualHelpMarkdown={contextualHelpMarkdown}
        primary={true}
        headerBackgroundColor={variables.brandPrimary}
        appLogo={false}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={styles.container.backgroundColor}
        />
        <Container style={styles.container}>
          <Text white={true} alignCenter={true}>
            {I18n.t("startup.title")}
          </Text>
          <Spinner color="white" />

          <List withContentLateralPadding={true}>
            {items.map((item, index) => (
              <ListItem key={`item-${index}`}>
                <IngressCheckBox checked={item.enabled} />
                <Body>
                  <Text white={true} bold={item.enabled}>
                    {item.label}
                  </Text>
                </Body>
              </ListItem>
            ))}
          </List>
          <View style={{ marginTop: 48 }}>
            <SectionStatusComponent sectionKey={"ingress"} />
          </View>
        </Container>
      </BaseScreenComponent>
    );
  }
}

function mapStateToProps(state: GlobalState) {
  const maybeSessionToken = sessionTokenSelector(state);
  const maybeSessionInfo = sessionInfoSelector(state);
  const potProfile = profileSelector(state);
  return {
    hasSessionToken: maybeSessionToken !== undefined,
    hasSessionInfo: maybeSessionInfo.isSome(),
    hasProfile: potProfile !== null,
    isProfileEnabled:
      pot.isSome(potProfile) &&
      potProfile.value.has_profile &&
      potProfile.value.is_inbox_enabled
  };
}

export default connect(mapStateToProps)(IngressScreen);
