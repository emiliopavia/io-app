/**
 * A screen to alert the user about the number of attempts remains
 */
import { Content, Text, View } from "native-base";
import * as React from "react";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ScreenContentHeader } from "../../../components/screens/ScreenContentHeader";
import TopScreenComponent from "../../../components/screens/TopScreenComponent";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import I18n from "../../../i18n";
import ROUTES from "../../../navigation/routes";
import { resetToAuthenticationRoute } from "../../../store/actions/navigation";

type NavigationParams = {
  remainingCount: number;
};

type Props = NavigationStackScreenProps<NavigationParams> &
  ReturnType<typeof mapDispatchToProps>;

class CieWrongCiePinScreen extends React.PureComponent<Props> {
  // TODO: usare redux per gestire il controllo?
  private navigateToCiePinScreen = async () => {
    this.props.navigation.navigate(ROUTES.CIE_PIN_SCREEN);
  };

  get ciePinRemainingCount() {
    return this.props.navigation.getParam("remainingCount");
  }

  private renderFooterButtons = () => {
    const cancelButtonProps = {
      bordered: true,
      onPress: resetToAuthenticationRoute,
      title: I18n.t("global.buttons.cancel")
    };
    const retryButtonProps = {
      primary: true,
      onPress: this.navigateToCiePinScreen,
      title: I18n.t("global.buttons.retry")
    };
    return (
      <FooterWithButtons
        type={"TwoButtonsInlineThird"}
        rightButton={retryButtonProps}
        leftButton={cancelButtonProps}
      />
    );
  };

  public render(): React.ReactNode {
    const remainingCount = this.ciePinRemainingCount;
    return (
      <TopScreenComponent
        goBack={false}
        headerTitle={I18n.t(
          "authentication.cie.pin.incorrectCiePinHeaderTitle"
        )}
      >
        <ScreenContentHeader
          title={I18n.t("authentication.cie.pin.incorrectCiePinTitle", {
            remainingCount
          })}
        />
        <Content>
          <Text>
            {I18n.t("authentication.cie.pin.incorrectCiePinContent1")}
          </Text>
          <View spacer={true} />
          <Text>
            {I18n.t("authentication.cie.pin.incorrectCiePinContent2")}
          </Text>
          <View spacer={true} />
        </Content>

        {this.renderFooterButtons()}
      </TopScreenComponent>
    );
  }
}
const mapDispatchToProps = (_: Dispatch) => ({});

export default connect(undefined, mapDispatchToProps)(CieWrongCiePinScreen);
