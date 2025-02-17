import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import tokenTypes from "./tokens";
import User from "../models/user.model";
import config from "./config";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "your_jwt_secret",
};


const jwtVerify = async (payload : any, done : any) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  };

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);


export default jwtStrategy;
