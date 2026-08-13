/**
 * Identity adapter boundary for Espresso Throwdown.
 *
 * Version one authenticates with hashed email one-time codes and issues a
 * Throwdown session cookie. Member IDs live on `profiles` and are stable.
 *
 * Future WEC OIDC/OAuth/SSO should implement `IdentityAdapter` and set
 * `externalIdentityProvider` + `externalSubjectId` (or `kimiUnionId`) on the
 * existing profile. Do not create a second member row when linking accounts.
 */
export type IdentityAdapter = {
  sendLoginChallenge(email: string): Promise<void>;
  verifyLoginChallenge(email: string, secret: string): Promise<{ email: string }>;
};

export const LOCAL_MAGIC_LINK_PROVIDER = "throwdown_otp";
export const FUTURE_WEC_OIDC_PROVIDER = "wec_oidc";
