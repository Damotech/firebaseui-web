/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Translations } from "../types";

// TODO: Should this be required or optional?
export const frCA = {
  errors: {
    userNotFound: "Utilisateur non trouvé",
    wrongPassword: "Mot de passe incorrect",
    invalidEmail: "Adresse courriel invalide",
    userDisabled: "Ce compte est désactivé",
    networkRequestFailed: "La connexion au réseau a échoué",
    tooManyRequests: "Trop de tentatives. Réessayez plus tard.",
    emailAlreadyInUse: "Cette adresse courriel est déjà utilisée",
    weakPassword: "Mot de passe trop faible",
    too_small: "Mot de passe trop faible",
    operationNotAllowed: "Opération non permise",
    invalidPhoneNumber: "Numéro de téléphone invalide",
    missingPhoneNumber: "Numéro de téléphone manquant",
    quotaExceeded: "Quota dépassé",
    codeExpired: "Le code a expiré",
    captchaCheckFailed: "Échec de la vérification Captcha",
    missingVerificationId: "ID de vérification manquante",
    missingEmail: "Adresse courriel manquante",
    invalidActionCode: "Code d’action invalide",
    credentialAlreadyInUse: "Identifiants déjà utilisés",
    requiresRecentLogin: "Veuillez vous reconnecter récemment pour continuer",
    providerAlreadyLinked: "Ce fournisseur est déjà lié à ce compte",
    invalidVerificationCode: "Code de vérification invalide",
    unknownError: "Erreur inconnue",
    popupClosed: "Fenêtre fermée",
    accountExistsWithDifferentCredential:
      "Un compte existe déjà avec des identifiants différents",
  },
  messages: {
    passwordResetEmailSent:
      "Courriel de réinitialisation du mot de passe envoyé",
    signInLinkSent: "Lien de connexion envoyé",
    verificationCodeFirst: "Entrez d'abord le code de vérification",
    checkEmailForReset:
      "Vérifiez votre courriel pour réinitialiser le mot de passe",
    dividerOr: "ou",
    termsAndPrivacy: "Conditions d'utilisation et politique de confidentialité",
  },
  labels: {
    emailAddress: "Adresse courriel",
    password: "Mot de passe",
    forgotPassword: "Mot de passe oublié?",
    register: "S'inscrire",
    signIn: "Se connecter",
    resetPassword: "Réinitialiser le mot de passe",
    createAccount: "Créer un compte",
    backToSignIn: "Retour à la connexion",
    signInWithPhone: "Se connecter avec un téléphone",
    phoneNumber: "Numéro de téléphone",
    verificationCode: "Code de vérification",
    sendCode: "Envoyer le code",
    verifyCode: "Vérifier le code",
    signInWithGoogle: "Se connecter avec Google",
    signInWithEmailLink: "Se connecter via un lien courriel",
    sendSignInLink: "Envoyer le lien de connexion",
    termsOfService: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    resendCode: "Renvoyer le code",
    sending: "Envoi...",
  },
  prompts: {
    noAccount: "Pas de compte?",
    haveAccount: "Déjà un compte?",
    enterEmailToReset:
      "Entrez votre courriel pour réinitialiser votre mot de passe",
    signInToAccount: "Connectez-vous à votre compte",
    enterDetailsToCreate: "Entrez vos informations pour créer un compte",
    enterPhoneNumber: "Entrez votre numéro de téléphone",
    enterVerificationCode: "Entrez le code de vérification",
    enterEmailForLink:
      "Entrez votre courriel pour recevoir le lien de connexion",
  },
} satisfies Translations;
