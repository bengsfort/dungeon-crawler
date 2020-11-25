import express from "express";

export enum CookieIds {
  GameSessionAuth = "GameSessionAuth",
}

export interface RequestCookies {
  GameSessionAuth?: string;
}

export const createGameSessionCookie = (
  res: express.Response,
  token: string
): void => {
  console.log("Creating game session cookie with token: " + token);
  res.cookie(CookieIds.GameSessionAuth, token, {
    httpOnly: true,
    sameSite: "strict",
    signed: true,
  });
};
