import { render } from "@testing-library/react-native";
import * as React from "react";
import UserProfileDetails from "../UserProfileDetails";

const loadingProfileWhenEmpty = {
  isLoading: true,
  isEmpty: true,
  isError: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loadProfile: () => {}
};

const profileWithData = {
  isEmpty: false,
  isError: false,
  fullName: "Citizen",
  email: "email@pagopa.it",
  fiscalCode: "XXXXXXXXXXXXXXXX",
  birthdate: new Date(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loadProfile: () => {}
};

describe("UserProfileDetails", () => {
  describe("given empty state", () => {
    describe("when loading", () => {
      it("shows the loader", () => {
        const component = render(
          <UserProfileDetails {...loadingProfileWhenEmpty} />
        );
        expect(component.queryByTestId("user.profile.loader")).not.toBeNull();
      });

      it("hides the refresh control", () => {
        const component = render(
          <UserProfileDetails {...loadingProfileWhenEmpty} />
        );
        expect(
          component.queryByTestId("user.profile.refreshControl")
        ).toBeNull();
      });
    });
  });

  describe("given profile data", () => {
    describe("when loading", () => {
      it("doesn't show the loader", () => {
        const component = render(
          <UserProfileDetails {...profileWithData} isLoading={true} />
        );
        expect(component.queryByTestId("user.profile.loader")).toBeNull();
      });
    });
  });
});
