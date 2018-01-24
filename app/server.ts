/**
 * Created by axetroy on 17-7-13.
 */
import { EventEmitter } from "events";
const path = require("path");
import * as express from "express";
const cookieParser = require("cookie-parser");
const timeout = require("connect-timeout");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");

import CONFIG from "./config";
import sequelize from "./postgres/index";

// Routers
import GraphqlRouter from "./routers/graphql";
import exportsRouter from "./routers/exports";

import { initUser } from "./controllers/user";

const app: express.Application = express();

// 端口监听
const SERVER_PORT: number = Number(process.env.PORT) || 3000;

process.on("uncaughtException", function(err) {
  console.error("Error caught in uncaughtException event:", err);
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
  cors({
    origin: true,
    credentials: true,
    allowHeaders: [
      "Origin",
      "Accept-Language",
      "X-Requested-with",
      "Content-Type",
      "Accept",
      "Authentication",
      "Authorization",
      "X-Real-IP",
      "X-Server",
      "X-Forward-Ip"
    ],
    allowMethods: ["GET", "HEAD", "OPTIONS", "POST"]
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, type: "application/x-www-form-urlencoded" }));
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(timeout("120s"));
app.use(cookieParser());
app.use(helmet());

app.use(function(req: any, res: any, next: Function) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

class Program extends EventEmitter {
  private ERROR: string = "error";
  constructor() {
    super();
    this.on(this.ERROR, (err: Error) => {
      console.error(`Program Init Fail.`);
      console.error(err);
      process.exit(1);
    });
  }

  /**
   * 启动程序
   * @returns {Promise<void>}
   */
  async bootstrap(): Promise<void> {
    try {
      await this.onOrm();
      await this.onInitData();
      await [this.onServer()];
    } catch (err) {
      this.emit(this.ERROR, err);
    }
  }

  /**
   * 初始化orm的连接
   * @returns {Promise<void>}
   */
  async onOrm(): Promise<void> {
    // sequelize的初始化
    await sequelize.authenticate();
    await sequelize.sync();
    console.info(`所有ORM连接成功`);
  }

  /**
   * 初始化数据，例如默认配置
   * @returns {Promise<any>}
   */
  async onInitData(): Promise<void> {
    await initUser();
    console.info(`初始化数据成功`);
  }

  /**
   * 启动http服务
   * @param {number} port
   * @returns {Promise<any>}
   */
  async onServer(port: number = SERVER_PORT): Promise<any> {
    // graphql 接口
    app.use("/api", GraphqlRouter());
    app.use("/api", exportsRouter());

    app.use((req, res, next) => {
      res.status(404).json({ error: [{ message: "Invalid url" }] });
    });

    // error handler
    app.use(function(err: any, req: any, res: any, next: Function) {
      res.status(err.status || 500);
      res.render("error", {
        message: err.message,
        error: CONFIG.isProduction ? {} : err
      });
    });

    return new Promise((resolve, reject) => {
      app.listen(port, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          console.info(`HTTP服务 监听 ${port} 端口`);
          resolve();
        }
      });
    });
  }
}

new Program().bootstrap();
