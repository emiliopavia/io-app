import React, { useCallback } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Pressable, View } from "react-native";
import { GlobalState } from "../../store/reducers/types";
import {
  SectionStatusKey,
  sectionStatusSelector
} from "../../store/reducers/backendStatus";
import I18n from "../../i18n";
import { maybeNotNullyString } from "../../utils/strings";
import { openWebUrl } from "../../utils/url";
import { getFullLocale } from "../../utils/locale";
import { LevelEnum } from "../../../definitions/content/SectionStatus";
import { useNavigationContext } from "../../utils/hooks/useOnFocus";
import { IOColors, IOColorType } from "../core/variables/IOColors";
import { Link } from "../core/typography/Link";
import StatusContent from "./StatusContent";

type OwnProps = {
  sectionKey: SectionStatusKey;
  onSectionRef?: (ref: React.RefObject<View>) => void;
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export const statusColorMap: Record<LevelEnum, IOColorType> = {
  [LevelEnum.normal]: "aqua",
  [LevelEnum.critical]: "red",
  [LevelEnum.warning]: "orange"
};

const statusIconMap: Record<LevelEnum, string> = {
  [LevelEnum.normal]: "io-complete",
  [LevelEnum.critical]: "io-warning",
  [LevelEnum.warning]: "io-info"
};

// map the text background color with the relative text color
const textDefaultColor = "white";
export const getStatusTextColor = (
  level: LevelEnum
): "bluegreyDark" | "white" =>
  level === LevelEnum.normal ? "bluegreyDark" : textDefaultColor;

const InnerSectionStatus = (
  props: Omit<Props, "sectionStatus"> & {
    sectionStatus: NonNullable<Props["sectionStatus"]>;
  }
) => {
  const viewRef = React.createRef<View>();
  const { sectionStatus, onSectionRef } = props;
  const iconName = statusIconMap[sectionStatus.level];
  const backgroundColor = statusColorMap[sectionStatus.level];
  const locale = getFullLocale();
  const maybeWebUrl = maybeNotNullyString(
    sectionStatus.web_url && sectionStatus.web_url[locale]
  );
  const navigation = useNavigationContext();

  const color = getStatusTextColor(sectionStatus.level);

  const handleOnSectionRef = useCallback(() => {
    if (viewRef.current) {
      onSectionRef?.(viewRef);
    }
  }, [onSectionRef, viewRef]);

  React.useEffect(() => {
    handleOnSectionRef();
    const unsubscribe = navigation?.addListener("didFocus", handleOnSectionRef);
    return () => unsubscribe?.remove();
  }, [handleOnSectionRef, navigation, viewRef]);

  return maybeWebUrl.fold(
    // render text only
    <StatusContent
      accessibilityLabel={`${sectionStatus.message[locale]}, ${I18n.t(
        "global.accessibility.alert"
      )}`}
      backgroundColor={backgroundColor}
      iconColor={IOColors[color]}
      iconName={iconName}
      testID={"SectionStatusComponentContent"}
      viewRef={viewRef}
      labelColor={color}
    >
      {`${sectionStatus.message[locale]} `}
    </StatusContent>,

    // render a pressable element with the link
    webUrl => (
      <Pressable
        accessibilityHint={I18n.t("global.accessibility.linkHint")}
        accessibilityLabel={`${sectionStatus.message[locale]}, ${I18n.t(
          "global.sectionStatus.moreInfo"
        )}`}
        accessibilityRole={"link"}
        onPress={() => openWebUrl(webUrl)}
        testID={"SectionStatusComponentPressable"}
      >
        <StatusContent
          backgroundColor={backgroundColor}
          iconColor={IOColors[color]}
          iconName={iconName}
          viewRef={viewRef}
          labelColor={color}
        >
          {`${sectionStatus.message[locale]} `}
          <Link
            testID={"SectionStatusComponentMoreInfo"}
            color={backgroundColor === "aqua" ? "bluegreyDark" : "white"}
            weight={"Bold"}
          >
            {I18n.t("global.sectionStatus.moreInfo")}
          </Link>
        </StatusContent>
      </Pressable>
    )
  );
};

/**
 * this component shows a full width banner with an icon and text
 * it could be tappable if the web url is defined
 * it renders nothing if for the given props.sectionKey there is no data or it is not visible
 */
const SectionStatus: React.FC<Props> = (props: Props) => {
  if (props.sectionStatus === undefined) {
    return null;
  }
  if (props.sectionStatus.is_visible !== true) {
    return null;
  }
  return <InnerSectionStatus {...props} sectionStatus={props.sectionStatus} />;
};

const mapStateToProps = (state: GlobalState, props: OwnProps) => ({
  sectionStatus: sectionStatusSelector(props.sectionKey)(state)
});

/**
 * the component must be re-render only if the sectionStatus changes
 * this is not ensured by the selector because the backend status (update each 60sec)
 * is overwritten on each request
 */
const component = React.memo(SectionStatus, (prev: Props, curr: Props) =>
  _.isEqual(prev.sectionStatus, curr.sectionStatus)
);

export default connect(mapStateToProps)(component);
