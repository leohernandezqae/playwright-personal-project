import { Page, Locator } from '@playwright/test';

export class PageLogin {
    readonly page: Page;
    readonly loginTittle: Locator;
    readonly loginInput: Locator;
    readonly passwordInput: Locator;
    readonly lenghtReqText: Locator;
    readonly upperCaseReqText: Locator;
    readonly numberReqText: Locator;
    readonly specialReqText: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginTittle = page.getByTestId('login-title');
        this.loginInput = page.getByTestId('login-input');
        this.passwordInput = page.getByTestId('password-input');
        this.lenghtReqText = page.getByTestId('req-length');
        this.upperCaseReqText = page.getByTestId('req-upper');
        this.numberReqText = page.getByTestId('req-number');
        this.specialReqText = page.getByTestId('req-special');
        this.loginButton = page.getByTestId('submit-btn');
    }
}