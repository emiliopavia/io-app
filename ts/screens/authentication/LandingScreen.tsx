/**
 * A screen where the user can choose to login with SPID or get more informations.
 * It includes a carousel with highlights on the app functionalities
 */
import { Content, Text, View } from "native-base";
import * as React from "react";
import { StyleSheet } from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { connect } from "react-redux";
import ButtonDefaultOpacity from "../../components/ButtonDefaultOpacity";
import { DevScreenButton } from "../../components/DevScreenButton";
import { HorizontalScroll } from "../../components/HorizontalScroll";
import { LandingCardComponent } from "../../components/LandingCardComponent";
import BaseScreenComponent from "../../components/screens/BaseScreenComponent";
import IconFont from "../../components/ui/IconFont";
import { isDevEnvironment } from "../../config";
import I18n from "../../i18n";
import ROUTES from "../../navigation/routes";
import { resetAuthenticationState } from "../../store/actions/authentication";
import { Dispatch, ReduxProps } from "../../store/actions/types";
import { isSessionExpiredSelector } from "../../store/reducers/authentication";
import { GlobalState } from "../../store/reducers/types";
import variables from "../../theme/variables";
import { ComponentProps } from "../../types/react";
import { isCIEAuthenticationSupported, isNfcEnabled } from "../../utils/cie";
import { showToast } from "../../utils/showToast";

type Props = ReduxProps &
  NavigationInjectedProps &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

type State = {
  isCIEAuthenticationSupported: boolean;
};

const getCards = (
  isCIEAvailable: boolean
): ReadonlyArray<ComponentProps<typeof LandingCardComponent>> => [
  {
    id: 5,
    image: require("../../../img/landing/05.png"),
    title: I18n.t("authentication.landing.card5-title"),
    content: I18n.t("authentication.landing.card5-content")
  },
  {
    id: 1,
    image: require("../../../img/landing/01.png"),
    title: I18n.t("authentication.landing.card1-title"),
    content: I18n.t("authentication.landing.card1-content")
  },
  {
    id: 2,
    image: require("../../../img/landing/02.png"),
    title: I18n.t("authentication.landing.card2-title"),
    content: I18n.t("authentication.landing.card2-content")
  },
  {
    id: 3,
    image: require("../../../img/landing/03.png"),
    title: I18n.t("authentication.landing.card3-title"),
    content: I18n.t("authentication.landing.card3-content")
  },
  {
    id: 4,
    image: isCIEAvailable
      ? require("../../../img/landing/CIE-onboarding-illustration.png")
      : require("../../../img/landing/04.png"),
    title: isCIEAvailable
      ? I18n.t("authentication.landing.loginSpidCie")
      : I18n.t("authentication.landing.card4-title"),
    content: isCIEAvailable
      ? I18n.t("authentication.landing.loginSpidCieContent")
      : I18n.t("authentication.landing.card4-content")
  }
];

const styles = StyleSheet.create({
  noPadded: {
    paddingLeft: 0,
    paddingRight: 0
  },
  flex: {
    flex: 1
  }
});

class LandingScreen extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { isCIEAuthenticationSupported: false };
  }

  public async componentDidMount() {
    if (this.props.isSessionExpired) {
      showToast(
        I18n.t("authentication.expiredSessionBanner.message"),
        "warning",
        "top"
      );
      this.props.resetState();
    }

    // TODO
    const isCieSupported = await isCIEAuthenticationSupported();
    this.setState({
      isCIEAuthenticationSupported: isCieSupported
    });

    if (this.props.isSessionExpired) {
      showToast(
        I18n.t("authentication.expiredSessionBanner.message"),
        "warning",
        "top"
      );
    }
  }

  private navigateToMarkdown = () =>
    this.props.navigation.navigate(ROUTES.MARKDOWN);
  private navigateToIdpSelection = () =>
    this.props.navigation.navigate(ROUTES.AUTHENTICATION_IDP_SELECTION);

  private navigateToCiePinScreen = async () => {
    const isNfcOn = await isNfcEnabled();
    this.props.navigation.navigate(
      isNfcOn ? ROUTES.CIE_PIN_SCREEN : ROUTES.CIE_NFC_SCREEN
    );
  };

  private navigateToSpidCieInformationRequest = () =>
    this.state.isCIEAuthenticationSupported
      ? this.props.navigation.navigate(
          ROUTES.AUTHENTICATION_SPID_CIE_INFORMATION
        )
      : this.props.navigation.navigate(ROUTES.AUTHENTICATION_SPID_INFORMATION);

  private renderCardComponents = () => {
    const cardProps = getCards(this.state.isCIEAuthenticationSupported);
    return cardProps.map(p => (
      <LandingCardComponent key={`card-${p.id}`} {...p} />
    ));
  };

  public render() {
    return (
      <BaseScreenComponent>
        {isDevEnvironment() && (
          <DevScreenButton onPress={this.navigateToMarkdown} />
        )}

        <Content contentContainerStyle={styles.flex} noPadded={true}>
          <HorizontalScroll cards={this.renderCardComponents()} />
        </Content>

        <View footer={true}>
          {this.state.isCIEAuthenticationSupported && (
            <ButtonDefaultOpacity
              block={true}
              primary={true}
              iconLeft={true}
              onPress={this.navigateToCiePinScreen}
              testID={"landing-button-login-cie"}
            >
              <IconFont name={"io-cie"} color={variables.colorWhite} />
              <Text>{I18n.t("authentication.landing.loginCie")}</Text>
            </ButtonDefaultOpacity>
          )}
          <View spacer={true} />
          <ButtonDefaultOpacity
            block={true}
            primary={true}
            iconLeft={true}
            onPress={this.navigateToIdpSelection}
            testID={"landing-button-login-spid"}
          >
            <IconFont name={"io-profilo"} color={variables.colorWhite} />
            <Text>{I18n.t("authentication.landing.loginSpid")}</Text>
          </ButtonDefaultOpacity>
          <View spacer={true} />
          <ButtonDefaultOpacity
            block={true}
            small={true}
            transparent={true}
            onPress={this.navigateToSpidCieInformationRequest}
          >
            <Text style={styles.noPadded}>
              {this.state.isCIEAuthenticationSupported
                ? I18n.t("authentication.landing.nospid-nocie")
                : I18n.t("authentication.landing.nospid")}
            </Text>
          </ButtonDefaultOpacity>
        </View>
      </BaseScreenComponent>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  isSessionExpired: isSessionExpiredSelector(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  resetState: () => dispatch(resetAuthenticationState())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingScreen);
