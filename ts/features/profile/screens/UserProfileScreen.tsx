import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { SafeAreaView, StyleSheet } from "react-native";
import { GlobalState } from "../../../store/reducers/types";
import {
  selectUserBirthdate,
  selectUserEmail,
  selectUserFiscalCode,
  selectUserFullName,
  selectUserProfileDeletionStatus,
  selectUserProfileIsEmpty,
  selectUserProfileIsError,
  selectUserProfileIsLoading
} from "../reducers/userProfile";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import I18n from "../../../i18n";
import { useOnFirstRender } from "../../../utils/hooks/useOnFirstRender";
import { getUserProfile, userProfileDeletionStart } from "../actions";
import { loadUserDataProcessing } from "../../../store/actions/userDataProcessing";
import { UserDataProcessingChoiceEnum } from "../../../../definitions/backend/UserDataProcessingChoice";
import UserProfileSwitch from "../components/UserProfileSwitch";
import UserProfileDetails from "../components/UserProfileDetails";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  }
});

const UserProfileScreen = (props: Props): React.ReactElement => {
  useOnFirstRender(() => {
    props.loadProfile();
    props.loadProfileDeletionStatus();
  });

  return (
    <BaseScreenComponent
      headerTitle={I18n.t("profile.data.title")}
      goBack={true}
    >
      <SafeAreaView style={styles.safeArea}>
        <UserProfileDetails {...props}>
          <UserProfileSwitch
            description={I18n.t("profile.main.privacy.removeAccount.title")}
            value={props.deletionStatus}
            onRetry={props.loadProfileDeletionStatus}
            onEnable={props.deleteUserProfile}
          />
        </UserProfileDetails>
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProfile: () => dispatch(getUserProfile.request()),
  loadProfileDeletionStatus: () =>
    dispatch(
      loadUserDataProcessing.request(UserDataProcessingChoiceEnum.DELETE)
    ),
  deleteUserProfile: () => dispatch(userProfileDeletionStart())
});

const mapStateToProps = (state: GlobalState) => ({
  isLoading: selectUserProfileIsLoading(state),
  isEmpty: selectUserProfileIsEmpty(state),
  isError: selectUserProfileIsError(state),
  fullName: selectUserFullName(state),
  email: selectUserEmail(state),
  fiscalCode: selectUserFiscalCode(state),
  birthdate: selectUserBirthdate(state),
  deletionStatus: selectUserProfileDeletionStatus(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen);
