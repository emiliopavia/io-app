import { fromNullable, Option } from "fp-ts/lib/Option";
import Instabug, {
  BugReporting,
  CrashReporting,
  NetworkLogger,
  Replies
} from "instabug-reactnative";

import { Locales } from "../../locales/locales";
import { instabugToken } from "../config";
import I18n from "../i18n";
import variables from "../theme/variables";
import { getAppVersion } from "../utils/appVersion";
import { isDevEnv } from "../utils/environment";
import { SupportToken } from "../../definitions/backend/SupportToken";
import { SpidIdp } from "../../definitions/content/SpidIdp";

type InstabugLocales = { [k in Locales]: Instabug.locale };

type InstabugUserAttributeKeys =
  | "backendVersion"
  | "activeScreen"
  | "identityProvider"
  | "lastSeenMessageID"
  | "appVersion"
  | "blockedPaymentRptId"
  | "supportToken"
  | "deviceUniqueID";

const instabugLocales: InstabugLocales = {
  en: Instabug.locale.english,
  it: Instabug.locale.italian,
  de: Instabug.locale.german
};

export enum TypeLogs {
  "INFO" = "INFO",
  "VERBOSE" = "VERBOSE",
  "ERROR" = "ERROR",
  "DEBUG" = "DEBUG",
  "WARN" = "WARN"
}

type InstabugLoggerType = {
  [key in keyof typeof TypeLogs]: (value: string) => void;
};
const InstabugLogger: InstabugLoggerType = {
  INFO: Instabug.logInfo,
  VERBOSE: Instabug.logVerbose,
  ERROR: Instabug.logError,
  DEBUG: Instabug.logDebug,
  WARN: Instabug.logWarn
};

export const initialiseInstabug = () => {
  // Initialise Instabug for iOS. The Android initialisation is inside MainApplication.java
  Instabug.startWithToken(instabugToken, [Instabug.invocationEvent.none]);
  // it seems NetworkLogger.setEnabled(false) turns off all network interceptions
  // this may cause an empty timeline in Reactotron too
  if (!isDevEnv) {
    // avoid Instabug to log network requests
    NetworkLogger.setEnabled(false);
  }
  CrashReporting.setEnabled(false);
  Instabug.setString(
    Instabug.strings.commentFieldHintForQuestion,
    I18n.t("instabug.overrideText.commentFieldHintForQuestion")
  );
  // Set primary color for iOS. The Android's counterpart is inside MainApplication.java
  Instabug.setPrimaryColor(variables.contentPrimaryBackground);
  Instabug.setColorTheme(Instabug.colorTheme.light);

  // Set the language for Instabug ui/screens
  Instabug.setLocale(
    I18n.currentLocale().startsWith("it")
      ? instabugLocales.it
      : instabugLocales.en
  );
  setInstabugUserAttribute("appVersion", getAppVersion());
};

export const defaultAttachmentTypeConfiguration = {
  screenshot: true,
  extraScreenshot: true,
  galleryImage: true,
  screenRecording: true
};

export const attachmentTypeConfigurationNoScreenshot = {
  ...defaultAttachmentTypeConfiguration,
  screenshot: false,
  extraScreenshot: false
};

export type DefaultReportAttachmentTypeConfiguration =
  typeof defaultAttachmentTypeConfiguration;

export const openInstabugQuestionReport = (
  attachmentTypeConfiguration: DefaultReportAttachmentTypeConfiguration = defaultAttachmentTypeConfiguration
) => {
  Instabug.setEnabledAttachmentTypes(
    attachmentTypeConfiguration.screenshot,
    attachmentTypeConfiguration.extraScreenshot,
    // the gallery attachment & screen recording are disabled because it is impossible to display
    // a prominent disclosure before this request and Instabug will be removed
    // https://pagopa.atlassian.net/wiki/spaces/IOAPP/pages/444727486/2021-11-18+Android#2021-12-21
    false,
    false
  );
  BugReporting.showWithOptions(BugReporting.reportType.question, [
    BugReporting.option.commentFieldRequired,
    BugReporting.option.emailFieldOptional
  ]);
};

export const openInstabugReplies = () => {
  Replies.show();
};

export const setInstabugUserAttribute = (
  attributeKey: InstabugUserAttributeKeys,
  attributeValue: string
) => {
  Instabug.setUserAttribute(attributeKey, attributeValue);
};

export const setInstabugProfileAttributes = (maybeIdp: Option<SpidIdp>) => {
  maybeIdp.fold(undefined, (idp: SpidIdp) =>
    setInstabugUserAttribute("identityProvider", idp.id)
  );
};

/**
 * Set the supportToken attribute.
 * If supportToken is undefined, the attribute is removed.
 */
export const setInstabugSupportTokenAttribute = (supportToken?: SupportToken) =>
  setOrUnsetInstabugUserAttribute(
    "supportToken",
    fromNullable(supportToken).map(st => st.access_token)
  );

/**
 * Set the deviceId attribute.
 * If deviceId is undefined, the attribute is removed.
 */
export const setInstabugDeviceIdAttribute = (deviceId?: string) =>
  setOrUnsetInstabugUserAttribute("deviceUniqueID", fromNullable(deviceId));

const setOrUnsetInstabugUserAttribute = (
  attributeKey: InstabugUserAttributeKeys,
  attributeValue: Option<string>
) =>
  attributeValue.foldL(
    () => Instabug.removeUserAttribute(attributeKey),
    value => Instabug.setUserAttribute(attributeKey, value)
  );

// The maximum log length accepted by Instabug
const maxInstabugLogLength = 4096;
// margin used for numerate the chunks
const numberMargin = 15;
/**
 * This method allows to log a string in the Instabug report. If the log is too long,
 * the string will be splitted in chunks
 * @param log the text that will be logged on istabug
 * @param typeLog the type of the log
 * @param tag a tag that can be used to identify the log
 */
export const instabugLog = (log: string, typeLog: TypeLogs, tag?: string) => {
  const chunckSize =
    maxInstabugLogLength - (tag ? tag.length : 0) - numberMargin;

  const chunks = log.match(
    new RegExp("(.|[\r\n]){1," + chunckSize.toString() + "}", "g")
  );
  if (chunks) {
    const prefix = tag ? tag : "";
    const space = prefix.length > 0 && chunks.length > 1 ? " " : "";

    chunks.forEach((chunk, i) => {
      const count = chunks.length > 1 ? `${i + 1}/${chunks.length}` : "";
      InstabugLogger[typeLog](`[${prefix}${space}${count}] ${chunk}`);
    });
  }
};
