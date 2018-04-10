import { InjectionToken } from '@angular/core';

const appVersion = require('../../package.json').version;

export const APP_INFO = new InjectionToken('app.info');

export const AppInfo = {
    version: appVersion
}
