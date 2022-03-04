import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Content } from "native-base";
import { SafeAreaView } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { emptyContextualHelp } from "../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import { H1 } from "../../../components/core/typography/H1";
import I18n from "../../../i18n";
import { H4 } from "../../../components/core/typography/H4";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { userProfileDeletionCancel } from "../actions";
import PROFILE_DELETION_ROUTES from "../navigation/routes";
import { useNavigationContext } from "../../../utils/hooks/useOnFocus";

type Props = ReturnType<typeof mapDispatchToProps> & NavigationStackScreenProps;

const ProfileDeletionStartScreen = (props: Props): React.ReactElement => {
  const navigationContext = useNavigationContext();
  const confirmDeletion = () =>
    navigationContext.navigate(PROFILE_DELETION_ROUTES.CONFIRM);

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
    onPress: confirmDeletion,
    title: I18n.t("global.buttons.continue")
  };

  return (
    <BaseScreenComponent goBack={true} contextualHelp={emptyContextualHelp}>
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
  cancel: () => dispatch(userProfileDeletionCancel())
});

export default connect(
  undefined,
  mapDispatchToProps
)(ProfileDeletionStartScreen);
