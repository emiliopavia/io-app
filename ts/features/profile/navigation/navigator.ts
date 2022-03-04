import { createStackNavigator } from "react-navigation-stack";
import { NavigationRoute, NavigationRouteConfigMap } from "react-navigation";
import {
  NavigationStackOptions,
  NavigationStackProp
} from "react-navigation-stack/src/types";
import ProfileDeletionStartScreen from "../screens/ProfileDeletionStartScreen";
import { newProfileScreenEnabled } from "../../../config";
import ProfileDeletionConfirmScreen from "../screens/ProfileDeletionConfirmScreen";
import ProfileDeletionSuccessScreen from "../screens/ProfileDeletionSuccessScreen";
import PROFILE_DELETION_ROUTES from "./routes";

export const ProfileDeletionNavigator = createStackNavigator(
  {
    [PROFILE_DELETION_ROUTES.START]: { screen: ProfileDeletionStartScreen },
    [PROFILE_DELETION_ROUTES.CONFIRM]: { screen: ProfileDeletionConfirmScreen },
    [PROFILE_DELETION_ROUTES.SUCCESS]: {
      screen: ProfileDeletionSuccessScreen
    }
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
