import { ActionType, createStandardAction } from "typesafe-actions";

/**
 * The user starts the workflow for making a decision regarding the opt-in of payment methods
 */
export const optInPaymentMethodsStart = createStandardAction(
  "OPT_IN_PAYMENT_METHODS_START"
)<void>();
/**
 * The user completes the workflow for making a decision regarding the opt-in of payment methods
 */
export const optInPaymentMethodsCompleted = createStandardAction(
  "OPT_IN_PAYMENT_METHODS_COMPLETED"
)<void>();

/**
 * The user can't choose to cancel the opt-in choice, this action is needed for the workunit
 */
export const optInPaymentMethodsCancel = createStandardAction(
  "OPT_IN_PAYMENT_METHODS_CANCEL"
)<void>();

/**
 * The user can't choose to press the back button, this action is needed for the workunit
 */
export const optInPaymentMethodsBack = createStandardAction(
  "OPT_IN_PAYMENT_METHODS_BACK"
)<void>();

/**
 * The workflow fails
 */
export const optInPaymentMethodsFailure = createStandardAction(
  "OPT_IN_PAYMENT_METHODS_FAILURE"
)<string>();

export type OptInPaymentMethodsActions =
  | ActionType<typeof optInPaymentMethodsStart>
  | ActionType<typeof optInPaymentMethodsCompleted>
  | ActionType<typeof optInPaymentMethodsCancel>
  | ActionType<typeof optInPaymentMethodsBack>
  | ActionType<typeof optInPaymentMethodsFailure>;
