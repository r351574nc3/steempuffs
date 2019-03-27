import { Body, Get, Controller, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { homedir } from 'os';
import  { SignupDto, AccessTokenDto } from "./dto";
import * as crypto from "crypto";
import { JwtService, Token } from "./core/jwt.service";
import { PreferencesService } from './steemit/preferences.service';
import { json } from 'body-parser';


@Controller("/oauth2")
export class OAuthController {
  constructor(private readonly appService: AppService,
    private readonly jwtService: JwtService,
    private readonly preferencesService: PreferencesService) {}

  /**
   * Signup accounts and stuff
   */
  @Post("/signup")
  setup(@Body() signupDto: SignupDto): string {
    const wif = crypto.createHash("sha256").update(signupDto.wif).digest("hex");
    const refresh_token = this.jwtService.createRefreshToken(signupDto.steemuser);
    this.preferencesService.put(signupDto.steemuser, "refreshToken", refresh_token);
    this.preferencesService.put(signupDto.steemuser, "wif", wif);
    return JSON.stringify({"username": signupDto.steemuser, "status": "success"});
  }

  @Get("/token")
  token(@Headers("authorization") authorization: string): AccessTokenDto {
    const refresh_token = Buffer.from(authorization, "base64").toString().trim();
    const token_obj = this.jwtService.verify(refresh_token);
    const access_token = this.jwtService.createAccessToken(token_obj.username, "posting");
    return {
      access_token: access_token,
      status: "success"
    };
  }
}
