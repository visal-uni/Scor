export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

const base = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" ?? "lax",
    path: "/",
}

export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie(ACCESS_COOKIE, accessToken, {
        ...base,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie(REFRESH_COOKIE, refreshToken, {
        ...base,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
}

export const clearAuthCookies = (res) => {
    res.clearCookie(ACCESS_COOKIE, {...base});
    res.clearCookie(REFRESH_COOKIE, {...base});
}