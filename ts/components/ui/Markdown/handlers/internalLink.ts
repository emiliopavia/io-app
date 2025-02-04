/**
 * An handler for application internal links
 */
import { fromNullable, none, Option } from "fp-ts/lib/Option";
import { NavigationActions } from "react-navigation";
import URLParse from "url-parse";
import { bpdEnabled, myPortalEnabled, svEnabled } from "../../../../config";
import NavigationService from "../../../../navigation/NavigationService";
import ROUTES from "../../../../navigation/routes";
import { Dispatch } from "../../../../store/actions/types";
import { isTestEnv } from "../../../../utils/environment";
import { addInternalRouteNavigation } from "../../../../store/actions/internalRouteNavigation";
import BPD_ROUTES from "../../../../features/bonus/bpd/navigation/routes";
import CGN_ROUTES from "../../../../features/bonus/cgn/navigation/routes";
import SV_ROUTES from "../../../../features/bonus/siciliaVola/navigation/routes";

// Prefix to match deeplink uri like `ioit://PROFILE_MAIN`
const IO_INTERNAL_LINK_PROTOCOL = "ioit:";
export const IO_INTERNAL_LINK_PREFIX = IO_INTERNAL_LINK_PROTOCOL + "//";

const ROUTE_NAMES: ReadonlyArray<string> = [
  ROUTES.MESSAGES_HOME,
  ROUTES.PROFILE_PREFERENCES_HOME,
  ROUTES.SERVICES_HOME,
  ROUTES.PROFILE_MAIN,
  ROUTES.PROFILE_PRIVACY,
  ROUTES.PROFILE_PRIVACY_MAIN,
  ROUTES.WALLET_HOME,
  ROUTES.PAYMENTS_HISTORY_SCREEN,
  ROUTES.CREDIT_CARD_ONBOARDING_ATTEMPTS_SCREEN
];

const BPD_ROUTE_NAMES: ReadonlyArray<string> = [
  BPD_ROUTES.CTA_START_BPD,
  BPD_ROUTES.CTA_BPD_IBAN_EDIT
];

const CGN_ROUTE_NAMES: ReadonlyArray<string> = [
  CGN_ROUTES.ACTIVATION.CTA_START_CGN,
  CGN_ROUTES.DETAILS.DETAILS
];

const MY_PORTAL_ROUTES: ReadonlyArray<string> = [ROUTES.SERVICE_WEBVIEW];

const SV_ROUTE_NAMES: ReadonlyArray<string> = [
  SV_ROUTES.VOUCHER_GENERATION.CHECK_STATUS,
  SV_ROUTES.VOUCHER_LIST.LIST
];

const ALLOWED_ROUTE_NAMES = ROUTE_NAMES.concat(
  myPortalEnabled ? MY_PORTAL_ROUTES : [],
  bpdEnabled ? BPD_ROUTE_NAMES : [],
  CGN_ROUTE_NAMES,
  svEnabled ? SV_ROUTE_NAMES : []
);

export const testableALLOWED_ROUTE_NAMES = isTestEnv
  ? ALLOWED_ROUTE_NAMES
  : undefined;

/**
 * Used to replace old navigation routes with new one
 */
function replaceOldRoute(routeName: string): string {
  switch (routeName) {
    case "PREFERENCES_SERVICES":
      return ROUTES.SERVICES_HOME;
    case "PREFERENCES_HOME":
      return ROUTES.PROFILE_PREFERENCES_HOME;
    default:
      return routeName;
  }
}

type InternalRouteParams = Record<string, string | undefined>;
export type InternalRoute = {
  routeName: string;
  params?: InternalRouteParams;
};

export function getInternalRoute(href: string): Option<InternalRoute> {
  // NOTE: URL built-in class seems not to be implemented in Android
  try {
    const url = new URLParse(href, true);
    if (url.protocol.toLowerCase() === IO_INTERNAL_LINK_PROTOCOL) {
      return fromNullable(
        ALLOWED_ROUTE_NAMES.find(
          e => e === replaceOldRoute(url.host.toUpperCase())
        )
      ).map(routeName => ({
        routeName,
        params: Object.keys(url.query).length === 0 ? undefined : url.query // avoid empty object
      }));
    }
    return none;
  } catch (_) {
    return none;
  }
}

/**
 * try to extract the internal route from href. If it is defined and allowed (white listed)
 * dispatch the navigation params (to store into the store) and dispatch the navigation action
 * @param dispatch
 * @param href
 * @param serviceId
 */
export function handleInternalLink(
  dispatch: Dispatch,
  href: string,
  serviceId?: string
) {
  getInternalRoute(href).map(internalNavigation => {
    dispatch(
      addInternalRouteNavigation({
        ...internalNavigation,
        params: { ...internalNavigation.params, serviceId }
      })
    );
    NavigationService.dispatchNavigationAction(
      NavigationActions.navigate({
        routeName: internalNavigation.routeName
      })
    );
  });
}
