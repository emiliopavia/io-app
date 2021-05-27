import * as React from "react";
import { useEffect, useState } from "react";
import { View } from "native-base";
import MapView, {
  LatLng,
  MapEvent,
  PROVIDER_DEFAULT,
  Region
} from "react-native-maps";
import RNLocation from "react-native-location";
import { StyleSheet } from "react-native";
import { fromNullable } from "fp-ts/lib/Option";
import { IOStyles } from "../../../../../components/core/variables/IOStyles";
import { getCurrentLocation } from "../../utils/location";
import { showToast } from "../../../../../utils/showToast";
import I18n from "../../../../../i18n";
import CgnMerchantMarker from "./maps/CgnMerchantMarker";

type Props = {
  merchants: ReadonlyArray<any>;
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

const INITIAL_REGION: Region = {
  latitude: 41.8738679,
  longitude: 12.7197622,
  latitudeDelta: 13.772,
  longitudeDelta: 12.4326
};

const showToastGenericError = () => showToast(I18n.t("global.genericError"));

const markers: ReadonlyArray<LatLng> = [
  {
    latitude: 41.8448049,
    longitude: 12.4908194
  },
  {
    latitude: 41.8490984,
    longitude: 12.4895062
  }
];

const CgnMerchantsMap: React.FunctionComponent<Props> = (_: Props) => {
  const [region, setRegion] = useState<Region | undefined>();
  const [marks, setMarks] = useState<typeof markers>([]);
  const [selectedMark, setSelectedMark] = useState<number | undefined>();

  useEffect(() => {
    void RNLocation.configure({ distanceFilter: 0.5 });

    getCurrentLocation()
      .run()
      .then(maybeLocation => {
        maybeLocation.map(location => {
          fromNullable(location).map(l => {
            setRegion({
              latitude: l.latitude,
              longitude: l.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            });
          });
        });
      })
      .catch(showToastGenericError);

    setMarks(markers);
  }, []);

  const handleMapPress = (e: MapEvent) => {
    if (e.nativeEvent.action !== "marker-press") {
      setSelectedMark(undefined);
    }
  };

  return (
    <View style={IOStyles.flex}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={region}
        initialRegion={INITIAL_REGION}
        onPress={handleMapPress}
        onRegionChangeComplete={(region: Region) => setRegion(region)}
      >
        {marks.map((m, i) => (
          <CgnMerchantMarker
            coordinate={m}
            key={i}
            category={"theater"}
            selected={selectedMark === i}
            onMarkPress={() => setSelectedMark(i)}
          />
        ))}
      </MapView>
    </View>
  );
};

export default CgnMerchantsMap;
