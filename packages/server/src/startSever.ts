import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import { buildSchema } from "type-graphql";
import { COOKIE_NAME, __prod__ } from "./constants";
import { AddressResolver } from "./resolvers/address";
import { CartItemResolver } from "./resolvers/cartItem";
import { CartItemNotiResolver } from "./resolvers/cartItemNoti";
import { FollowResolver } from "./resolvers/follow";
import { MealkitResolver } from "./resolvers/mealkit";
import { OrderResolver } from "./resolvers/order";
import { PaymentResolver } from "./resolvers/payment";
import { PaymentInfoResolver } from "./resolvers/paymentInfo";
import { PostResolver } from "./resolvers/post";
import { ReviewResolver } from "./resolvers/review";
import { TrackingResolver } from "./resolvers/tracking";
import { UserResolver } from "./resolvers/user";
import paymentRouter from "./routes/payment";
import trackingRouter from "./routes/tracking";
import { MyContext } from "./types";
import { createTypeORMConn } from "./utils/createTypeORMConn";
import { upvoteLoader } from "./utils/createUpvoteLoader";
import { createUserLoader } from "./utils/createUserLoader";
import { S3Resolver } from "./utils/resolvers/s3";
// import { useMeQuery, shitColor, primaryColor } from "@cookknow/shared-package";

export const startServer = async () => {
  // const conn = await createConnection({
  //   type: "postgres",
  //   host: "localhost",
  //   url: process.env.DATABASE_URL,
  //   port: 5432,
  //   // username: "postgres",
  //   // password: "chain123",
  //   // database: "cookknowdb",
  //   logging: true,
  //   synchronize: true,
  //   migrations: [path.join(__dirname, "./migrations/*")],
  //   entities: [
  //     User,
  //     Post,
  //     Upvote,
  //     Address,
  //     Mealkit,
  //     CartItem,
  //     CartItemNoti,
  //     Order,
  //     Payment,
  //     Follow,
  //     PaymentInfo,
  //     Tracking,
  //     Review,
  //   ],
  // });

  const conn = await createTypeORMConn();

  // await conn.runMigrations();
  const app = express();

  // console.log(process.memoryUsage());
  // sendSMS();
  // generateQr();
  // generateQr();
  // console.log(shitColor);
  // console.log(primaryColor);

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());
  app.use("/api/payment", paymentRouter);
  app.use("/api/tracking", trackingRouter);

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1); //make cookie working in a proxy environment since Nginx will be sitting infront of our api(server), 1 -> we have 1 proxy
  app.use(
    cors({
      origin: [process.env.CORS_ORIGIN, "http://localhost:19006"], //localhost 3000 and mobile
      credentials: true,
    })
  );

  // const redisClient = redis.createClient（）
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
        domain: __prod__ ? ".cookknow.com" : undefined, //no need if in development
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      PostResolver,
      AddressResolver,
      MealkitResolver,
      CartItemResolver,
      CartItemNotiResolver,
      PaymentResolver,
      OrderResolver,
      FollowResolver,
      PaymentInfoResolver,
      TrackingResolver,
      S3Resolver,
      ReviewResolver,
    ],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      // upvoteLoader: createUpvoteLoader(),
      upvoteLoader: upvoteLoader(),
    }), //so that we can access session because session is stick with request
  });

  // const apolloServer = new ApolloServer({
  //     schema: await buildSchema({
  //         resolvers: [HelloResolver],
  //         validate: false,
  //     })
  // })
  // Rest to test whether it is running all not

  apolloServer.applyMiddleware({ app, cors: false });
  // console.log(process.memoryUsage());

  console.log("port", process.env.PORT); //spicicy in .env

  const PORT = process.env.NODE_ENV === "test" ? 0 : process.env.PORT;
  const server = app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });

  return { server: server, connection: conn };
};
