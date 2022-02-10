import { Content, Text, View } from "native-base";
import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationStackScreenProps } from "react-navigation-stack";
import Pinpad from "../../components/Pinpad";
import BaseScreenComponent, {
  ContextualHelpPropsMarkdown
} from "../../components/screens/BaseScreenComponent";
import I18n from "../../i18n";
import variables from "../../theme/variables";
import { PinString } from "../../types/PinString";
import { LightModalContextInterface } from "../../components/ui/LightModal";
import FooterWithButtons from "../../components/ui/FooterWithButtons";
import {
  cancelButtonProps,
  confirmButtonProps
} from "../../features/bonus/bonusVacanze/components/buttons/ButtonConfigurations";
import { InfoBox } from "../../components/box/InfoBox";
import { IOColors } from "../../components/core/variables/IOColors";
import { Label } from "../../components/core/typography/Label";

const contextualHelpMarkdown: ContextualHelpPropsMarkdown = {
  title: "onboarding.unlockCode.contextualHelpTitle",
  body: "onboarding.unlockCode.contextualHelpContent"
};

type Props = NavigationStackScreenProps & LightModalContextInterface;

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  header: {
    fontSize: 20,
    lineHeight: 22
  }
});

/**
 * A screen that allows the user to confirm the unlock code.
 */
const OnboardingPinConfirmationScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = React.useState<PinString | null>(null);

  const handleGoBack = React.useCallback(
    () => navigation.goBack(),
    [navigation]
  );

  const resetPin = () => setPin(null);

  const computedCancelButtonProps = React.useMemo(
    () => ({
      ...cancelButtonProps(() => null, I18n.t("global.buttons.back")),
      onPress: handleGoBack
    }),
    [handleGoBack]
  );

  const computedConfirmButtonProps = React.useMemo(
    () => ({
      ...confirmButtonProps(() => null, I18n.t("global.buttons.confirm")),
      disabled: pin === null,
      onPress: () => null
    }),
    [pin]
  );

  return (
    <BaseScreenComponent
      goBack={handleGoBack}
      contextualHelpMarkdown={contextualHelpMarkdown}
      faqCategories={["onboarding_pin", "unlock"]}
      headerTitle={I18n.t("onboarding.confirmPin.headerTitle")}
    >
      <SafeAreaView style={styles.flex}>
        <Content>
          <>
            <Text style={styles.header} bold={true} dark={true}>
              {I18n.t("onboarding.confirmPin.title")}
            </Text>

            <Text dark={true}>{I18n.t("onboarding.confirmPin.subTitle")}</Text>
          </>

          <View spacer large />

          <>
            <Pinpad
              inactiveColor={variables.brandLightGray}
              activeColor={variables.contentPrimaryBackground}
              onFulfill={setPin}
              onDeleteLastDigit={resetPin}
              buttonType={"light"}
            />
          </>

          <View spacer large />

          <>
            <InfoBox iconName={"io-titolare"} iconColor={IOColors.bluegrey}>
              <Label color={"bluegrey"} weight={"Regular"}>
                {I18n.t("onboarding.confirmPin.tutorial")}
              </Label>
            </InfoBox>
          </>
        </Content>

        <FooterWithButtons
          type="TwoButtonsInlineHalf"
          leftButton={computedCancelButtonProps}
          rightButton={computedConfirmButtonProps}
        />
      </SafeAreaView>
    </BaseScreenComponent>
  );
};

export default OnboardingPinConfirmationScreen;
