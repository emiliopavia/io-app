import React from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import I18n from "../../../i18n";
import NameSurnameIcon from "../../../../img/assistance/nameSurname.svg";
import FiscalCodeIcon from "../../../../img/assistance/fiscalCode.svg";
import EmailIcon from "../../../../img/assistance/email.svg";
import InfoIcon from "../../../../img/assistance/info.svg";
import { useOnFirstRender } from "../../../utils/hooks/useOnFirstRender";
import { showToast } from "../../../utils/showToast";
import UserProfileItem from "./UserProfileItem";
import Loader from "./Loader";

export type Props = {
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  fullName?: string;
  email?: string;
  fiscalCode?: string;
  birthdate?: Date;

  loadProfile: () => void;
} & { children?: React.ReactNode };

const styles = StyleSheet.create({
  scrollView: {
    height: "100%"
  }
});

const iconProps = { width: 24, height: 24 };

const UserProfileDetails = (props: Props): React.ReactElement => {
  useOnFirstRender(() => {
    props.loadProfile();
  });

  if (props.isError) {
    showToast(I18n.t("global.genericError"), "danger");
  }

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          !props.isEmpty || props.isError ? (
            <RefreshControl
              refreshing={props.isLoading}
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
      {props.isLoading && props.isEmpty && (
        <Loader testID="user.profile.loader" />
      )}
    </>
  );
};

export default UserProfileDetails;
