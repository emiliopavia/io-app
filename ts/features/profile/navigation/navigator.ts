import { createStackNavigator } from "react-navigation-stack";
import { NavigationRoute, NavigationRouteConfigMap } from "react-navigation";
import {
  NavigationStackOptions,
  NavigationStackProp
} from "react-navigation-stack/src/types";
import ProfileDeletionWarningScreen from "../screens/ProfileDeletionWarningScreen";
import { newProfileScreenEnabled } from "../../../config";
import ProfileDeletionSummaryScreen from "../screens/ProfileDeletionSummaryScreen";
import PROFILE_DELETION_ROUTES from "./routes";

export const ProfileDeletionNavigator = createStackNavigator(
  {
    [PROFILE_DELETION_ROUTES.START]: { screen: ProfileDeletionWarningScreen },
    [PROFILE_DELETION_ROUTES.CONFIRM]: { screen: ProfileDeletionSummaryScreen }
  },
  {
    headerMode: "none",
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
);

export const profileDeletionRouteConfig: NavigationRouteConfigMap<
  NavigationStackOptions,
  NavigationStackProp<NavigationRoute, any>
> = newProfileScreenEnabled
  ? {
      [PROFILE_DELETION_ROUTES.MAIN]: {
        screen: ProfileDeletionNavigator
      }
    }
  : {};
