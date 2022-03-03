import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

const Loader = (props: { testID?: string }): React.ReactElement => (
  <View style={styles.container} testID={props.testID}>
    <ActivityIndicator />
  </View>
);

export default Loader;
