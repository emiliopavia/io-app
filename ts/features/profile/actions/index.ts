import {
  ActionType,
  createAsyncAction,
  createStandardAction
} from "typesafe-actions";
import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";
import { NetworkError } from "../../../utils/errors";

export const getUserProfile = createAsyncAction(
  "USER_PROFILE_REQUEST",
  "USER_PROFILE_SUCCESS",
  "USER_PROFILE_FAILURE"
)<void, InitializedProfile, NetworkError>();

export const userProfileDeletionStart = createStandardAction(
  "USER_PROFILE_DELETION_START"
)<void>();

export const userProfileDeletionCompleted = createStandardAction(
  "USER_PROFILE_DELETION_COMPLETED"
)<void>();

export const userProfileDeletionBack = createStandardAction(
  "USER_PROFILE_DELETION_BACK"
)<void>();

export const userProfileDeletionCancel = createStandardAction(
  "USER_PROFILE_DELETION_CANCEL"
)<void>();

export const userProfileDeletionFailure = createStandardAction(
  "USER_PROFILE_DELETION_FAILURE"
)<void>();

export type UserProfileActions =
  | ActionType<typeof getUserProfile>
  | ActionType<typeof userProfileDeletionStart>
  | ActionType<typeof userProfileDeletionCompleted>
  | ActionType<typeof userProfileDeletionBack>
  | ActionType<typeof userProfileDeletionCancel>
  | ActionType<typeof userProfileDeletionFailure>;
