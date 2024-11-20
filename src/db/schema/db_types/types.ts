import Focus from "../schema";

export const ProviderEnum = Focus.enum("Provider", [
  "GOOGLE",
  "GITHUB",
  "LOCAL"
]);

export const ThemeEnum = Focus.enum("Theme", ["LIGHT", "DARK"]);
export const GenderEnum = Focus.enum("Gender", [
  "MALE",
  "FEMALE",
  "PREFER_NOT_TO_SAY"
]);
export const LinkTargetEnum = Focus.enum("LinkTarget", ["_self", "_blank"]);

export const subscriptionStatusEnum = Focus.enum("SubscriptionStatus", [
  "ACTIVE",
  "EXPIRED",
  "CANCELLED"
]);

export const SubscriptionsEventsNamesEnum = Focus.enum(
  "SubscriptionsEventsNames",
  ["AUTO_RESUBSCRIBE", "EXPIRED", "CANCELLED"]
);
