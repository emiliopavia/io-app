import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import { GlobalState } from "../../../store/reducers/types";
import { emptyContextualHelp } from "../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import I18n from "../../../i18n";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { userProfileDeletionCancel } from "../actions";
import UserProfileDetails from "../components/UserProfileDetails";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> &
  NavigationStackScreenProps;

const ProfileDeletionSummaryScreen = (props: Props): React.ReactElement => {
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
    <BaseScreenComponent goBack={true} contextualHelp={emptyContextualHelp}>
      <SafeAreaView style={IOStyles.flex}>
        <UserProfileDetails></UserProfileDetails>
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

const mapStateToProps = (state: GlobalState) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileDeletionSummaryScreen);
