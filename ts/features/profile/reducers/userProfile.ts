import * as pot from "italia-ts-commons/lib/pot";
import { getType } from "typesafe-actions";
import { InitializedProfile } from "../../../../definitions/backend/InitializedProfile";
import { Action } from "../../../store/actions/types";
import { getUserProfile } from "../actions";
import { getErrorFromNetworkError } from "../../../utils/errors";

export type UserProfileState = pot.Pot<InitializedProfile, Error>;

const userProfileReducer = (
  state: UserProfileState = pot.none,
  action: Action
): UserProfileState => {
  switch (action.type) {
    case getType(getUserProfile.request):
      return pot.toLoading(state);
    case getType(getUserProfile.success):
      return pot.some(action.payload);
    case getType(getUserProfile.failure):
      return pot.toError(state, getErrorFromNetworkError(action.payload));
  }
  return state;
};

export default userProfileReducer;
