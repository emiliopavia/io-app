import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Content } from "native-base";
import { SafeAreaView } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { GlobalState } from "../../../store/reducers/types";
import { emptyContextualHelp } from "../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import { H1 } from "../../../components/core/typography/H1";
import I18n from "../../../i18n";
import { H4 } from "../../../components/core/typography/H4";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { userProfileDeletionBack, userProfileDeletionCancel } from "../actions";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  NavigationStackScreenProps;

const ProfileDeletionWarningScreen = (props: Props): React.ReactElement => {
  const cancelButtonProps = {
    block: true,
    light: true,
    bordered: true,
    onPress: props.cancel,
    title: I18n.t("global.buttons.cancel")
  };

  const continueButtonProps = {
    block: true,
    primary: true,
    onPress: undefined,
    title: I18n.t("global.buttons.continue")
  };

  return (
    <BaseScreenComponent
      goBack={props.goBack}
      contextualHelp={emptyContextualHelp}
    >
      <SafeAreaView style={IOStyles.flex}>
        <Content>
          <H1>{I18n.t("profile.main.privacy.removeAccount.title")}</H1>
          <H4 weight="Regular">
            {I18n.t("profile.main.privacy.removeAccount.info.body")}
          </H4>
        </Content>
        <FooterWithButtons
          type="TwoButtonsInlineThird"
          leftButton={cancelButtonProps}
          rightButton={continueButtonProps}
        />
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  goBack: () => dispatch(userProfileDeletionBack()),
  cancel: () => dispatch(userProfileDeletionCancel())
});

const mapStateToProps = (state: GlobalState) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileDeletionWarningScreen);
