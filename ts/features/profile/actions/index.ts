import { ActionType, createAsyncAction } from "typesafe-actions";
import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";
import { NetworkError } from "../../../utils/errors";

export const getUserProfile = createAsyncAction(
  "USER_PROFILE_REQUEST",
  "USER_PROFILE_SUCCESS",
  "USER_PROFILE_FAILURE"
)<void, InitializedProfile, NetworkError>();

export type UserProfileActions = ActionType<typeof getUserProfile>;
