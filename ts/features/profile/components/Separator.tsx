import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import customVariables from "../../../theme/variables";

type Props = Readonly<{
  style: StyleProp<ViewStyle>;
}>;

const styles = StyleSheet.create({
  small: {
    backgroundColor: customVariables.itemSeparator,
    height: StyleSheet.hairlineWidth
  }
});

const Separator = (props: Props): React.ReactElement => (
  <View style={[styles.small, props.style]}></View>
);

export default Separator;
