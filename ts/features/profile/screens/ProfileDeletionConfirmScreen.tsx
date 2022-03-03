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
import { GlobalState } from "../../../store/reducers/types";
import { emptyContextualHelp } from "../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import I18n from "../../../i18n";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { getUserProfile, userProfileDeletionCancel } from "../actions";
import UserProfileDetails from "../components/UserProfileDetails";
import { upsertUserDataProcessing } from "../../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../../definitions/backend/UserDataProcessingChoice";
import {
  selectUserBirthdate,
  selectUserEmail,
  selectUserFiscalCode,
  selectUserFullName,
  selectUserProfileDeletionError,
  selectUserProfileDeletionRequest,
  selectUserProfileDeletionSuccess,
  selectUserProfileIsEmpty,
  selectUserProfileIsError,
  selectUserProfileIsLoading
} from "../reducers/userProfile";
import { showToast } from "../../../utils/showToast";
import { useNavigationContext } from "../../../utils/hooks/useOnFocus";
import PROFILE_DELETION_ROUTES from "../navigation/routes";

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

const ProfileDeletionConfirmScreen = (props: Props): React.ReactElement => {
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

  const navigation = useNavigationContext();
  if (props.didSendDeletionRequest) {
    navigation.navigate(PROFILE_DELETION_ROUTES.SUCCESS);
  } else if (props.hasError) {
    showToast(I18n.t("global.genericError"), "danger");
  }

  {
    return (
      <BaseScreenComponent goBack={true} contextualHelp={emptyContextualHelp}>
        <SafeAreaView style={IOStyles.flex}>
          {!props.isSendingDeletionRequest && (
            <>
              <UserProfileDetails {...props} />
              <FooterWithButtons
                type="TwoButtonsInlineThird"
                leftButton={cancelButtonProps}
                rightButton={continueButtonProps}
              />
            </>
          )}
          {props.isSendingDeletionRequest && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
          )}
        </SafeAreaView>
      </BaseScreenComponent>
    );
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProfile: () => dispatch(getUserProfile.request()),
  cancel: () => dispatch(userProfileDeletionCancel()),
  deleteUserProfile: () =>
    dispatch(
      upsertUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    )
});

const mapStateToProps = (state: GlobalState) => ({
  isLoading: selectUserProfileIsLoading(state),
  isEmpty: selectUserProfileIsEmpty(state),
  isError: selectUserProfileIsError(state),
  fullName: selectUserFullName(state),
  email: selectUserEmail(state),
  fiscalCode: selectUserFiscalCode(state),
  birthdate: selectUserBirthdate(state),
  hasError: selectUserProfileDeletionError(state),
  isSendingDeletionRequest: selectUserProfileDeletionRequest(state),
  didSendDeletionRequest: selectUserProfileDeletionSuccess(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileDeletionConfirmScreen);
