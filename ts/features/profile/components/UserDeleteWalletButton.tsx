import React from "react";
import { StyleSheet } from "react-native";
import { Content, View } from "native-base";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import ButtonDefaultOpacity from "../../../components/ButtonDefaultOpacity";
import I18n from "../../../i18n";
import { H3 } from "../../../components/core/typography/H3";
import { Body } from "../../../components/core/typography/Body";
import customVariables from "../../../theme/variables";
import { userProfileDeletionStart } from "../actions";

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  whiteBg: {
    backgroundColor: customVariables.colorWhite
  },
  noBottomPadding: {
    padding: customVariables.contentPadding,
    paddingBottom: 0
  }
});

type Props = ReturnType<typeof mapDispatchToProps>;

const UserDeleteWalletButton = (props: Props): React.ReactElement => (
  <Content
    scrollEnabled={false}
    style={[styles.noBottomPadding, styles.whiteBg, styles.flex1]}
  >
    <View spacer={true} large={true} />
    <H3 weight="SemiBold" color="bluegreyDark">
      {I18n.t("profile.main.title")}
    </H3>
    <View spacer={true} />
    <ButtonDefaultOpacity
      block={true}
      light={true}
      bordered={true}
      small={true}
      onPress={props.deleteUserProfile}
    >
      <Body color={"blue"}>
        {I18n.t("profile.main.privacy.removeAccount.title")}
      </Body>
    </ButtonDefaultOpacity>
  </Content>
);

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deleteUserProfile: () => dispatch(userProfileDeletionStart())
});

export default connect(null, mapDispatchToProps)(UserDeleteWalletButton);
