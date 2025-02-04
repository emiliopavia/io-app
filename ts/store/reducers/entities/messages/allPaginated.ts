import * as pot from "italia-ts-commons/lib/pot";
import { none, Option, some } from "fp-ts/lib/Option";
import { getType } from "typesafe-actions";
import { createSelector } from "reselect";

import {
  loadNextPageMessages,
  loadPreviousPageMessages,
  reloadAllMessages
} from "../../../actions/messages";
import { clearCache } from "../../../actions/profile";
import { Action } from "../../../actions/types";
import { GlobalState } from "../../types";
import { UIMessage } from "./types";

export type Cursor = string;

/**
 * A list of messages and pagination data.
 */
export type AllPaginated = {
  data: pot.Pot<
    { page: ReadonlyArray<UIMessage>; previous?: Cursor; next?: Cursor },
    string
  >;

  /** persist the last action type occurred */
  lastRequest: Option<"previous" | "next" | "all">;
};

const INITIAL_STATE: AllPaginated = {
  data: pot.none,
  lastRequest: none
};

/**
 * A reducer to store all messages with pagination
 */
const reducer = (
  state: AllPaginated = INITIAL_STATE,
  action: Action
): AllPaginated => {
  switch (action.type) {
    case getType(reloadAllMessages.request):
    case getType(reloadAllMessages.success):
    case getType(reloadAllMessages.failure):
      return reduceReloadAll(state, action);

    case getType(loadNextPageMessages.request):
    case getType(loadNextPageMessages.success):
    case getType(loadNextPageMessages.failure):
      return reduceLoadNextPage(state, action);

    case getType(loadPreviousPageMessages.request):
    case getType(loadPreviousPageMessages.success):
    case getType(loadPreviousPageMessages.failure):
      return reduceLoadPreviousPage(state, action);

    case getType(clearCache):
      return INITIAL_STATE;

    default:
      return state;
  }
};

const reduceReloadAll = (
  state: AllPaginated = INITIAL_STATE,
  action: Action
): AllPaginated => {
  switch (action.type) {
    case getType(reloadAllMessages.request):
      return {
        data: pot.toLoading(state.data),
        lastRequest: some("all")
      };

    case getType(reloadAllMessages.success):
      return {
        data: pot.some({
          page: action.payload.messages,
          previous: action.payload.pagination.previous,
          next: action.payload.pagination.next
        }),
        lastRequest: none
      };

    case getType(reloadAllMessages.failure):
      return {
        ...state,
        data: pot.toError(state.data, action.payload.message)
      };

    default:
      return state;
  }
};

const reduceLoadNextPage = (
  state: AllPaginated = INITIAL_STATE,
  action: Action
): AllPaginated => {
  switch (action.type) {
    case getType(loadNextPageMessages.request):
      return { data: pot.toLoading(state.data), lastRequest: some("next") };

    case getType(loadNextPageMessages.success):
      // we store the previous item only if the list was empty
      const nextData = pot
        .toOption(state.data)
        .map(previousState =>
          pot.some({
            ...previousState,
            page: previousState.page.concat(action.payload.messages),
            next: action.payload.pagination.next
          })
        )
        .getOrElse(
          pot.some({
            page: [...action.payload.messages],
            next: action.payload.pagination.next
          })
        );

      return {
        data: nextData,
        lastRequest: none
      };

    case getType(loadNextPageMessages.failure):
      return {
        ...state,
        data: pot.toError(state.data, action.payload.message)
      };

    default:
      return state;
  }
};

const reduceLoadPreviousPage = (
  state: AllPaginated = INITIAL_STATE,
  action: Action
): AllPaginated => {
  switch (action.type) {
    case getType(loadPreviousPageMessages.request):
      return { data: pot.toLoading(state.data), lastRequest: some("previous") };

    case getType(loadPreviousPageMessages.success):
      const nextData = pot
        .toOption(state.data)
        .map(previousState =>
          pot.some({
            ...previousState,
            page: action.payload.messages.concat(previousState.page),
            // preserve previous if not present or it will be impossible to
            // retrieve further messages
            previous:
              action.payload.pagination.previous ?? previousState.previous
          })
        )
        .getOrElse(
          pot.some({
            page: [...action.payload.messages],
            previous: action.payload.pagination.previous
          })
        );

      return {
        data: nextData,
        lastRequest: none
      };

    case getType(loadPreviousPageMessages.failure):
      return {
        ...state,
        data: pot.toError(state.data, action.payload.message)
      };

    default:
      return state;
  }
};

// Selectors

/**
 * Return the data container for this reducer.
 * @param state
 */
export const allPaginatedMessagesSelector = (
  state: GlobalState
): AllPaginated["data"] => state.entities.messages.allPaginated.data;

/**
 * Return the whole state for this reducer.
 * @param state
 */
export const allPaginatedSelector = (state: GlobalState): AllPaginated =>
  state.entities.messages.allPaginated;

/**
 * Return the list of messages currently available.
 * @param state
 */
export const allMessagesSelector = createSelector(
  allPaginatedMessagesSelector,
  allPaginated =>
    pot.getOrElse(
      pot.map(allPaginated, _ => _.page),
      []
    )
);

export const getById = createSelector(
  [allMessagesSelector, (_: GlobalState, messageId: string) => messageId],
  (page, messageId): UIMessage | undefined => page.find(_ => _.id === messageId)
);

/**
 * True if the state is loading and the last request is for a next page.
 * @param state
 */
export const isLoadingNextPage = createSelector(
  allPaginatedSelector,
  ({ data, lastRequest }) =>
    lastRequest.map(_ => _ === "next" && pot.isLoading(data)).getOrElse(false)
);

/**
 * True if the state is loading and the last request is for a previous page.
 * @param state
 */
export const isLoadingPreviousPage = createSelector(
  allPaginatedSelector,
  ({ data, lastRequest }) =>
    lastRequest
      .map(_ => _ === "previous" && pot.isLoading(data))
      .getOrElse(false)
);

export const getCursors = createSelector(allPaginatedSelector, ({ data }) =>
  pot.map(data, ({ previous, next }) => ({ previous, next }))
);

/**
 * True if the state is loading and the last request is for all the messages
 * resulting in a complete reset.
 * @param state
 */
export const isReloading = createSelector(
  allPaginatedSelector,
  ({ data, lastRequest }) =>
    lastRequest.map(_ => _ === "all" && pot.isLoading(data)).getOrElse(false)
);

export default reducer;
