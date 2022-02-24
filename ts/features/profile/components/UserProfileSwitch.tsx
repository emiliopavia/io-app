import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "native-base";
import { Pot } from "italia-ts-commons/lib/pot";
import { RemoteSwitch } from "../../../components/core/selection/RemoteSwitch";
import Separator from "./Separator";

type Props = Readonly<{
  description: string;
  value: Pot<boolean, Error>;
  onRetry: () => void;
  onEnable: () => void;
}>;

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginLeft: 16
  },
  description: {
    flex: 1
  },
  switch: {
    flex: 0,
    marginRight: 16
  },
  separator: {
    marginLeft: 16
  }
});

const UserProfileItem = (props: Props): React.ReactElement => (
  <View>
    <View style={styles.row}>
      <Text style={styles.description}>{props.description}</Text>
      <View style={styles.switch}>
        <RemoteSwitch
          value={props.value}
          onRetry={props.onRetry}
          onValueChange={value => (value ? props.onEnable() : undefined)}
        />
      </View>
    </View>
    <Separator style={styles.separator} />
  </View>
);

export default UserProfileItem;
