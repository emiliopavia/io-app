import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import * as pot from "italia-ts-commons/lib/pot";
import { GlobalState } from "../../../store/reducers/types";
import { emptyContextualHelp } from "../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import I18n from "../../../i18n";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { userProfileDeletionCancel } from "../actions";
import UserProfileDetails from "../components/UserProfileDetails";
import { upsertUserDataProcessing } from "../../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../../definitions/backend/UserDataProcessingChoice";
import { selectUserProfileDeletionStatus } from "../reducers/userProfile";
import { showToast } from "../../../utils/showToast";

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

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
    onPress: props.deleteUserProfile,
    title: I18n.t("global.buttons.continue")
  };

  if (pot.isError(props.deletionStatus)) {
    showToast(I18n.t("global.genericError"), "danger");
  }

  return (
    <BaseScreenComponent goBack={true} contextualHelp={emptyContextualHelp}>
      <SafeAreaView style={IOStyles.flex}>
        {!pot.isUpdating(props.deletionStatus) && (
          <>
            <UserProfileDetails />
            <FooterWithButtons
              type="TwoButtonsInlineThird"
              leftButton={cancelButtonProps}
              rightButton={continueButtonProps}
            />
          </>
        )}
        {pot.isUpdating(props.deletionStatus) && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
        )}
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cancel: () => dispatch(userProfileDeletionCancel()),
  deleteUserProfile: () =>
    dispatch(
      upsertUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    )
});

const mapStateToProps = (state: GlobalState) => ({
  deletionStatus: selectUserProfileDeletionStatus(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileDeletionSummaryScreen);
