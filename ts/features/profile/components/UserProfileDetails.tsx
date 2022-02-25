import React from "react";
import { Dispatch } from "redux";
import { connect, useSelector } from "react-redux";
import * as pot from "italia-ts-commons/lib/pot";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { getUserProfile } from "../actions";
import { GlobalState } from "../../../store/reducers/types";
import {
  selectUserBirthdate,
  selectUserEmail,
  selectUserFiscalCode,
  selectUserFullName,
  selectUserProfile,
  selectUserProfileDeletionStatus
} from "../reducers/userProfile";
import I18n from "../../../i18n";
import NameSurnameIcon from "../../../../img/assistance/nameSurname.svg";
import FiscalCodeIcon from "../../../../img/assistance/fiscalCode.svg";
import EmailIcon from "../../../../img/assistance/email.svg";
import InfoIcon from "../../../../img/assistance/info.svg";
import { useOnFirstRender } from "../../../utils/hooks/useOnFirstRender";
import { showToast } from "../../../utils/showToast";
import UserProfileItem from "./UserProfileItem";
import Loader from "./Loader";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps> & { children?: React.ReactNode };

const styles = StyleSheet.create({
  scrollView: {
    height: "100%"
  }
});

const iconProps = { width: 24, height: 24 };

const UserProfileDetails = (props: Props): React.ReactElement => {
  const profile = useSelector(selectUserProfile);

  useOnFirstRender(() => {
    props.loadProfile();
  });

  if (pot.isError(profile)) {
    showToast(I18n.t("global.genericError"), "danger");
  }

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          pot.isSome(profile) || pot.isError(profile) ? (
            <RefreshControl
              refreshing={pot.isLoading(profile)}
              onRefresh={props.loadProfile}
            />
          ) : undefined
        }
      >
        {props.fullName && (
          <UserProfileItem
            title={I18n.t("profile.data.list.nameSurname")}
            subtitle={props.fullName}
            icon={<NameSurnameIcon {...iconProps} />}
          />
        )}
        {props.fiscalCode && (
          <UserProfileItem
            title={I18n.t("profile.fiscalCode.fiscalCode")}
            subtitle={props.fiscalCode}
            icon={<FiscalCodeIcon {...iconProps} />}
          />
        )}
        {props.email && (
          <UserProfileItem
            title={I18n.t("profile.data.list.email")}
            subtitle={props.email}
            icon={<EmailIcon {...iconProps} />}
          />
        )}
        {props.birthdate?.toLocaleDateString && (
          <UserProfileItem
            title={I18n.t("profile.data.list.birthdate")}
            subtitle={props.birthdate.toLocaleDateString()}
            icon={<InfoIcon {...iconProps} />}
          />
        )}
        {props.children}
      </ScrollView>
      {pot.isLoading(profile) && pot.isNone(profile) && <Loader />}
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProfile: () => dispatch(getUserProfile.request())
});

const mapStateToProps = (state: GlobalState) => ({
  fullName: selectUserFullName(state),
  email: selectUserEmail(state),
  fiscalCode: selectUserFiscalCode(state),
  birthdate: selectUserBirthdate(state),
  deletionStatus: selectUserProfileDeletionStatus(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileDetails);
