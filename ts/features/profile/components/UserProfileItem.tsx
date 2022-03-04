import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Text } from "native-base";
import customVariables from "../../../theme/variables";
import { makeFontStyleObject } from "../../../theme/fonts";
import Separator from "./Separator";

type Props = Readonly<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}>;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10
  },
  icon: {
    padding: 16
  },
  title: {
    fontSize: 18,
    color: customVariables.brandDarkestGray,
    ...makeFontStyleObject(Platform.select, "600")
  },
  separator: {
    marginLeft: 16
  }
});

const UserProfileItem = (props: Props): React.ReactElement => (
  <View>
    <View style={styles.row}>
      <View style={styles.icon}>{props.icon}</View>
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text>{props.subtitle}</Text>
      </View>
    </View>
    <Separator style={styles.separator} />
  </View>
);

export default UserProfileItem;
