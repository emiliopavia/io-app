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

const Loader = (): React.ReactElement => (
  <View style={styles.container}>
    <ActivityIndicator />
  </View>
);

export default Loader;
