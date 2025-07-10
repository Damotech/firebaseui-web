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

import { Component, inject, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { injectForm, TanStackField } from "@tanstack/angular-form";
import { FirebaseUI } from "../../../provider";
import { ButtonComponent } from "../../../components/button/button.component";
import { TermsAndPrivacyComponent } from "../../../components/terms-and-privacy/terms-and-privacy.component";
import {
  createEmailFormSchema,
  FirebaseUIError,
  signInWithEmailAndPassword,
} from "@firebase-ui/core";
import { firstValueFrom } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "fui-email-password-form",
  standalone: true,
  imports: [
    CommonModule,
    TanStackField,
    ButtonComponent,
    TermsAndPrivacyComponent,
  ],
  template: `
    <form (submit)="onFormSubmit($event)" class="fui-form">
      <fieldset>
        <ng-container [tanstackField]="form" name="email" #email="field">
          <label [for]="email.api.name">
            <span>{{ emailLabel | async }}</span>
            <input
              type="email"
              [id]="email.api.name"
              [name]="email.api.name"
              [value]="email.api.state.value"
              (blur)="email.api.handleBlur()"
              (input)="email.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="!!email.api.state.meta.errors.length"
            />
            <span
              role="alert"
              aria-live="polite"
              class="fui-form__error"
              *ngIf="!!email.api.state.meta.errors.length"
            >
              {{ email.api.state.meta.errors[0].message }}
            </span>
          </label>
        </ng-container>
      </fieldset>
      <fieldset>
        <ng-container [tanstackField]="form" name="password" #password="field">
          <label [for]="password.api.name">
            <span class="flex">
              <span class="flex-grow">{{ passwordLabel | async }}</span>
              <button
                type="button"
                (click)="navigateTo(forgotPasswordRoute)"
                class="fui-form__action"
              >
                {{ forgotPasswordLabel | async }}
              </button>
            </span>
            <input
              type="password"
              [id]="password.api.name"
              [name]="password.api.name"
              [value]="password.api.state.value"
              (blur)="password.api.handleBlur()"
              (input)="password.api.handleChange($any($event).target.value)"
              [attr.aria-invalid]="!!password.api.state.meta.errors.length"
            />

            <span
              role="alert"
              aria-live="polite"
              class="fui-form__error"
              *ngIf="!!password.api.state.meta.errors.length"
            >
              {{ password.api.state.meta.errors[0].message }}
            </span>
          </label>
        </ng-container>
      </fieldset>

      <fui-terms-and-privacy></fui-terms-and-privacy>

      <fieldset>
        <fui-button type="submit" [disabled]="!form.state.canSubmit">
          {{ form.state.isSubmitting ? "..." : (signInLabel | async) }}
        </fui-button>
        <div class="fui-form__error" *ngIf="formError">{{ formError }}</div>
      </fieldset>

      <div class="flex justify-center items-center" *ngIf="registerRoute">
        <button
          type="button"
          (click)="navigateTo(registerRoute)"
          class="fui-form__action"
        >
          {{ noAccountLabel | async }} {{ registerLabel | async }}
        </button>
      </div>
    </form>
  `,
})
export class EmailPasswordFormComponent implements OnInit {
  private ui = inject(FirebaseUI);
  private router = inject(Router);

  @Input({ required: true }) forgotPasswordRoute!: string;
  @Input({ required: true }) registerRoute!: string;
  @Input() fallbackAuthFn!: (
    username: string,
    password: string,
  ) => Promise<boolean>;

  formError: string | null = null;
  private formSchema: any;
  private config: any;
  private fallbackAuthUsed = false;

  form = injectForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  private async handleValidationErrors(validationResult: any) {
    const validationErrors = validationResult.error.format();
    // Log all errors for debugging
    console.log("Validation errors:", validationErrors);

    if (validationErrors.email?._errors?.length) {
      this.formError = validationErrors.email._errors[0] || "Email is required";
      throw new Error(this.formError);
    }
    if (validationErrors.password?._errors?.length) {
      this.formError =
        validationErrors.password._errors[0] || "Password is required";
      throw new Error(this.formError);
    }
    this.formError = await firstValueFrom(
      this.ui.translation("errors", "unknownError"),
    );
    throw new Error(this.formError);
  }

  private async tryFallbackAuth(email: string, password: string, error: any) {
    if (
      error instanceof FirebaseUIError &&
      this.fallbackAuthFn &&
      !this.fallbackAuthUsed &&
      ["auth/user-not-found", "auth/invalid-credential"].includes(error.code)
    ) {
      this.fallbackAuthUsed = true;
      const response = await this.fallbackAuthFn(email, password);
      if (response) {
        await signInWithEmailAndPassword(this.config, email, password);
        return true;
      }
    }
    return false;
  }

  onFormSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    return this.form.handleSubmit(event);
  }

  async ngOnInit() {
    try {
      this.config = await firstValueFrom(this.ui.config());
      this.formSchema = createEmailFormSchema(this.config?.translations, this.config?.locale);

      this.form.update({
        onSubmit: async ({ value }) => {
          this.fallbackAuthUsed = false;
          const { email, password } = value;

          const validationResult = this.formSchema.safeParse(value);

          if (!validationResult.success) {
            await this.handleValidationErrors(validationResult);
          }

          this.formError = null;

          try {
            await signInWithEmailAndPassword(this.config, email, password);
          } catch (error) {
            const fallbackWorked = await this.tryFallbackAuth(
              email,
              password,
              error,
            );
            if (!fallbackWorked) {
              this.formError = await firstValueFrom(
                this.ui.translation("errors", "wrongPassword"),
              );
            }
          }
        },
        validators: {
          onSubmit: this.formSchema,
          onBlur: this.formSchema,
        },
      });
    } catch (error) {
      this.formError = await firstValueFrom(
        this.ui.translation("errors", "unknownError"),
      );
    }
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  get emailLabel() {
    return this.ui.translation("labels", "emailAddress");
  }

  get passwordLabel() {
    return this.ui.translation("labels", "password");
  }

  get forgotPasswordLabel() {
    return this.ui.translation("labels", "forgotPassword");
  }

  get signInLabel() {
    return this.ui.translation("labels", "signIn");
  }

  get noAccountLabel() {
    return this.ui.translation("prompts", "noAccount");
  }

  get registerLabel() {
    return this.ui.translation("labels", "register");
  }
}
