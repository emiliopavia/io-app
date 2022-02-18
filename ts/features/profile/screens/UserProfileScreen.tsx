import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { GlobalState } from "../../../store/reducers/types";
import {
  selectUserBirthdate,
  selectUserEmail,
  selectUserFiscalCode,
  selectUserFullName
} from "../reducers/userProfile";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";
import I18n from "../../../i18n";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

const UserProfileScreen = (props: Props): React.ReactElement => (
  <BaseScreenComponent
    headerTitle={I18n.t("profile.data.title")}
    goBack={true}
  ></BaseScreenComponent>
);

const mapDispatchToProps = (_: Dispatch) => ({});
const mapStateToProps = (state: GlobalState) => ({
  fullName: selectUserFullName(state),
  email: selectUserEmail(state),
  fiscalCode: selectUserFiscalCode(state),
  birthdate: selectUserBirthdate(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen);
