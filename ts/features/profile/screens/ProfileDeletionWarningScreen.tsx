import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { GlobalState } from "../../../store/reducers/types";
import { emptyContextualHelp } from "../../../utils/emptyContextualHelp";
import BaseScreenComponent from "../../../components/screens/BaseScreenComponent";

type Props = ReturnType<typeof mapDispatchToProps> &
  ReturnType<typeof mapStateToProps>;

const ProfileDeletionWarningScreen = (props: Props): React.ReactElement => (
  <BaseScreenComponent
    goBack={true}
    contextualHelp={emptyContextualHelp}
    shouldAskForScreenshotWithInitialValue={false}
  />
);

const mapDispatchToProps = (dispatch: Dispatch) => ({});

const mapStateToProps = (state: GlobalState) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileDeletionWarningScreen);
