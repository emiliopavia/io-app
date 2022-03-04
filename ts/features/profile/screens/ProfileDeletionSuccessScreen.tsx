import { Content, H2, View } from "native-base";
import * as React from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { Dispatch } from "redux";
import expiredIcon from "../../../../img/wallet/errors/payment-expired-icon.png";
import I18n from "../../../i18n";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import { H4 } from "../../../components/core/typography/H4";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import { userProfileDeletionBack } from "../actions";

type Props = NavigationStackScreenProps & ReturnType<typeof mapDispatchToProps>;
const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

const ProfileDeletionSuccessScreen: React.FunctionComponent<Props> = props => {
  const continueButtonProps = {
    block: true,
    bordered: true,
    primary: true,
    onPress: props.back,
    title: I18n.t("profile.main.privacy.removeAccount.success.cta")
  };

  const footerComponent = (
    <FooterWithButtons type={"SingleButton"} leftButton={continueButtonProps} />
  );

  return (
    <BaseScreenComponent headerTitle={I18n.t("profile.main.title")}>
      <SafeAreaView style={IOStyles.flex}>
        <Content contentContainerStyle={styles.content}>
          <Image source={expiredIcon} />
          <View spacer={true} />
          <H2>{I18n.t("profile.main.privacy.removeAccount.success.title")}</H2>
          <H4 weight="Regular" style={{ textAlign: "center" }}>
            {I18n.t("profile.main.privacy.removeAccount.success.body")}
          </H4>
        </Content>
        {footerComponent}
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  back: () => dispatch(userProfileDeletionBack())
});

export default connect(
  undefined,
  mapDispatchToProps
)(ProfileDeletionSuccessScreen);
