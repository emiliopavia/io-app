import React from "react";
import { Dispatch } from "redux";
import { connect, useSelector } from "react-redux";
import * as pot from "italia-ts-commons/lib/pot";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet
} from "react-native";
import { GlobalState } from "../../../store/reducers/types";
import {
  selectUserBirthdate,
  selectUserEmail,
  selectUserFiscalCode,
  selectUserFullName,
  selectUserProfile
} from "../reducers/userProfile";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import I18n from "../../../i18n";
import { useOnFirstRender } from "../../../utils/hooks/useOnFirstRender";
import { getUserProfile } from "../actions";
import Loader from "../components/Loader";
import UserProfileItem from "../components/UserProfileItem";
import NameSurnameIcon from "../../../../img/assistance/nameSurname.svg";
import EmailIcon from "../../../../img/assistance/email.svg";
import FiscalCodeIcon from "../../../../img/assistance/fiscalCode.svg";
import InfoIcon from "../../../../img/assistance/info.svg";
import { showToast } from "../../../utils/showToast";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollView: {
    height: "100%"
  }
});

const iconProps = { width: 24, height: 24 };

const UserProfileScreen = (props: Props): React.ReactElement => {
  const profile = useSelector(selectUserProfile);

  useOnFirstRender(() => {
    props.loadProfile();
  });

  if (pot.isError(profile)) {
    showToast(I18n.t("global.genericError"), "danger");
  }

  return (
    <BaseScreenComponent
      headerTitle={I18n.t("profile.data.title")}
      goBack={true}
    >
      <SafeAreaView style={styles.safeArea}>
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
              icon={<NameSurnameIcon {...iconProps}></NameSurnameIcon>}
            />
          )}
          {props.fiscalCode && (
            <UserProfileItem
              title={I18n.t("profile.fiscalCode.fiscalCode")}
              subtitle={props.fiscalCode}
              icon={<FiscalCodeIcon {...iconProps}></FiscalCodeIcon>}
            />
          )}
          {props.email && (
            <UserProfileItem
              title={I18n.t("profile.data.list.email")}
              subtitle={props.email}
              icon={<EmailIcon {...iconProps}></EmailIcon>}
            />
          )}
          {props.birthdate && (
            <UserProfileItem
              title={I18n.t("profile.data.list.birthdate")}
              subtitle={props.birthdate.toLocaleDateString()}
              icon={<InfoIcon {...iconProps}></InfoIcon>}
            />
          )}
        </ScrollView>
        {pot.isLoading(profile) && pot.isNone(profile) && <Loader></Loader>}
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProfile: () => dispatch(getUserProfile.request())
});

const mapStateToProps = (state: GlobalState) => ({
  fullName: selectUserFullName(state),
  email: selectUserEmail(state),
  fiscalCode: selectUserFiscalCode(state),
  birthdate: selectUserBirthdate(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen);
