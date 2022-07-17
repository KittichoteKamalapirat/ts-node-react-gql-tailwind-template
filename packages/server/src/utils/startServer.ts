import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";

import connectRedis from "connect-redis";
import cors from "cors";
import session from "express-session";
import Redis from "ioredis";
import { COOKIE_NAME, __prod__ } from "../constants";
import { AddressResolver } from "../resolvers/address";
import { HelloResolver } from "../resolvers/hello";
import { PostResolver } from "../resolvers/post";
import { UserResolver } from "../resolvers/user";
import { MyContext } from "../types";
import { createTypeORMConn } from "./createTypeORMConn";
import { upvoteLoader } from "./createUpvoteLoader";
import { createUserLoader } from "./createUserLoader";

export const startServer = async () => {
  console.log("This is", process.env.NODE_ENV, "environment.");
  console.log("CORS origin:", process.env.CORS_ORIGIN);
  console.log("CORS origin production:", process.env.CORS_ORIGIN_TEST);
  console.log("CORS origin test:", process.env.CORS_ORIGIN_TEST);
  console.log("db url:", process.env.DATABASE_URL);
  console.log("port:", process.env.PORT);
  console.log("redis url:", process.env.REDIS_URL);

  const conn = await createTypeORMConn(process.env.NODE_ENV);
  // await conn.runMigrations();
  const app = express();

  // rollbar.error("ccc");
  // rollbar.critical("Crash while processing payment");
  // rollbar.warning("Facebook API unavailable");
  // rollbar.info("User logged in");
  // rollbar.debug("Cron job starting");

  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use(express.json());

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.set("trust proxy", 1); // make cookie working in a proxy environment since Nginx will be sitting infront of our api(server), 1 -> we have 1 proxy

  app.use(
    cors({
      origin: [
        process.env.CORS_ORIGIN,
        process.env.CORS_ORIGIN_PROD,
        process.env.CORS_ORIGIN_TEST,
        "http://localhost:19006",
      ], // localhost 3000 and mobile
      credentials: true,
    })
  );

  // const redisClient = redis.createClient();
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true, //so that Javascript's front end can't access cookie
        sameSite: "lax", //csrf
        secure: __prod__, //cookie onl works in https
        // domain: "http://localhost:3000/",
      },
      saveUninitialized: false,
      secret: "secret",
      resave: false,
    })
  );

  try {
    const schema = await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver, AddressResolver],
      validate: false,
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }): MyContext => ({
        req,
        res,
        redis,
        userLoader: createUserLoader(),
        upvoteLoader: upvoteLoader(),
      }), //so that we can access session because session is stick with request
    });

    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = parseInt(process.env.PORT, 10);

    const server = app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
    return { server, connection: conn };
  } catch (error) {
    console.log(error);
    return error;
  }
};
