/*
Copyright 2019-2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React from "react";
import classNames from "classnames";
import { type EmptyObject } from "matrix-js-sdk/src/matrix";

import SdkConfig from "../../../SdkConfig";
import AuthPage from "./AuthPage";
import AsciiFishBackground from "./AsciiFishBackground";
import SettingsStore from "../../../settings/SettingsStore";
import { UIFeature } from "../../../settings/UIFeature";
import LanguageSelector from "./LanguageSelector";
import EmbeddedPage from "../../structures/EmbeddedPage";
import { MATRIX_LOGO_HTML } from "../../structures/static-page-vars";

export default class WelcomeDev extends React.PureComponent<EmptyObject> {
    public render(): React.ReactNode {
        const pagesConfig = SdkConfig.getObject("embedded_pages");
        let pageUrl: string | undefined;
        if (pagesConfig) {
            const welcomeDevUrl = (pagesConfig as any).get?.("welcome_dev_url");
            const welcomeUrl = pagesConfig.get("welcome_url");
            pageUrl = typeof welcomeDevUrl === "string" ? welcomeDevUrl : welcomeUrl;
        }

        const replaceMap: Record<string, string> = {
            "$brand": SdkConfig.get("brand"),
            "$riot:ssoUrl": "#/start_sso",
            "$riot:casUrl": "#/start_cas",
            "$matrixLogo": MATRIX_LOGO_HTML,
            "[matrix]": MATRIX_LOGO_HTML,
        };

        if (!pageUrl) {
            const brandingConfig = SdkConfig.getObject("branding");
            const logoUrl = brandingConfig?.get("auth_header_logo_url") ?? "themes/element/img/logos/element-logo.svg";
            replaceMap["$logoUrl"] = logoUrl;
            pageUrl = "welcome-dev.html";
        }

        return (
            <AuthPage
                addBlur={false}
                backgroundStyle="linear-gradient(to top, #000000 0%, #010101 66%, #0f1118 100%)"
                backgroundOverlay={<AsciiFishBackground />}
            >
                <div
                    className={classNames("mx_Welcome", {
                        mx_WelcomePage_registrationDisabled: !SettingsStore.getValue(UIFeature.Registration),
                    })}
                    data-testid="mx_welcome_screen"
                >
                    <EmbeddedPage className="mx_WelcomePage" url={pageUrl} replaceMap={replaceMap} />
                    <LanguageSelector />
                </div>
            </AuthPage>
        );
    }
}
