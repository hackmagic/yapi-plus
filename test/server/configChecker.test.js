const test = require("ava");
const rewire = require("rewire");
const configChecker = rewire("../../server/configChecker.js");

// Mock fs 模块
const mockFs = {
  existsSync: () => true,
};

// Mock yapi 模块
const mockYapi = {
  WEBCONFIG: {},
  path: {
    join: function () {
      var path = "";
      for (var i = 0; i < arguments.length; i++) {
        if (i > 0) path += "/";
        path += arguments[i];
      }
      return path;
    },
  },
  WEBROOT_RUNTIME: "/tmp",
};

test.beforeEach((t) => {
  // 重置模块状态
  configChecker.__set__("fs", mockFs);
  configChecker.__set__("yapi", mockYapi);
});

test("checkConfigStatus - 完全配置", async (t) => {
  const mockFs = {
    existsSync: () => true,
  };
  const mockYapi = {
    WEBCONFIG: {
      db: { servername: "localhost", DATABASE: "test" },
      adminAccount: "admin@test.com",
    },
    path: {
      join: function () {
        var path = "";
        for (var i = 0; i < arguments.length; i++) {
          if (i > 0) path += "/";
          path += arguments[i];
        }
        return path;
      },
    },
    WEBROOT_RUNTIME: "/tmp",
  };

  configChecker.__set__("fs", mockFs);
  configChecker.__set__("yapi", mockYapi);

  const result = await configChecker.checkConfigStatus();
  t.deepEqual(result, { configured: true, missing: [] });
});

test("checkConfigStatus - 缺少 init.lock", async (t) => {
  const mockFs = {
    existsSync: (path) => {
      if (path.includes("init.lock")) return false;
      return true;
    },
  };
  const mockYapi = {
    WEBCONFIG: {
      db: { servername: "localhost", DATABASE: "test" },
      adminAccount: "admin@test.com",
    },
    path: {
      join: function () {
        var path = "";
        for (var i = 0; i < arguments.length; i++) {
          if (i > 0) path += "/";
          path += arguments[i];
        }
        return path;
      },
    },
    WEBROOT_RUNTIME: "/tmp",
  };

  configChecker.__set__("fs", mockFs);
  configChecker.__set__("yapi", mockYapi);

  const result = await configChecker.checkConfigStatus();
  t.truthy(result.missing.includes("init_lock"));
});

test("checkConfigStatus - 缺少 DB（无 servername 和 connectString）", async (t) => {
  const mockFs = {
    existsSync: () => true,
  };
  const mockYapi = {
    WEBCONFIG: {
      db: {},
      adminAccount: "admin@test.com",
    },
    path: {
      join: function () {
        var path = "";
        for (var i = 0; i < arguments.length; i++) {
          if (i > 0) path += "/";
          path += arguments[i];
        }
        return path;
      },
    },
    WEBROOT_RUNTIME: "/tmp",
  };

  configChecker.__set__("fs", mockFs);
  configChecker.__set__("yapi", mockYapi);

  const result = await configChecker.checkConfigStatus();
  t.truthy(result.missing.includes("database"));
});

test("checkConfigStatus - 缺少 adminAccount", async (t) => {
  const mockFs = {
    existsSync: () => true,
  };
  const mockYapi = {
    WEBCONFIG: {
      db: { servername: "localhost", DATABASE: "test" },
      adminAccount: undefined,
    },
    path: {
      join: function () {
        var path = "";
        for (var i = 0; i < arguments.length; i++) {
          if (i > 0) path += "/";
          path += arguments[i];
        }
        return path;
      },
    },
    WEBROOT_RUNTIME: "/tmp",
  };

  configChecker.__set__("fs", mockFs);
  configChecker.__set__("yapi", mockYapi);

  const result = await configChecker.checkConfigStatus();
  t.truthy(result.missing.includes("admin_account"));
});

test("checkConfigStatus - 全部缺失", async (t) => {
  const mockFs = {
    existsSync: () => false,
  };
  const mockYapi = {
    WEBCONFIG: {
      db: {},
      adminAccount: undefined,
    },
    path: {
      join: function () {
        var path = "";
        for (var i = 0; i < arguments.length; i++) {
          if (i > 0) path += "/";
          path += arguments[i];
        }
        return path;
      },
    },
    WEBROOT_RUNTIME: "/tmp",
  };

  configChecker.__set__("fs", mockFs);
  configChecker.__set__("yapi", mockYapi);

  const result = await configChecker.checkConfigStatus();
  t.is(result.configured, false);
  t.truthy(result.missing.includes("init_lock"));
  t.truthy(result.missing.includes("database"));
  t.truthy(result.missing.includes("admin_account"));
});

test("testDatabaseConnection - 连接成功", async (t) => {
  const mongoose = {
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
  };

  configChecker.__set__("mongoose", mongoose);

  const dbConfig = {
    servername: "localhost",
    port: 27017,
    DATABASE: "test",
  };

  const result = await configChecker.testDatabaseConnection(dbConfig);
  t.deepEqual(result, { success: true });
});

test("testDatabaseConnection - 连接失败（拒绝）", async (t) => {
  const mongoose = {
    connect: () => Promise.reject(new Error("ECONNREFUSED")),
    disconnect: () => Promise.resolve(),
  };

  configChecker.__set__("mongoose", mongoose);

  const dbConfig = {
    servername: "localhost",
    port: 27017,
    DATABASE: "test",
  };

  const result = await configChecker.testDatabaseConnection(dbConfig);
  t.false(result.success);
  t.is(result.error, "ECONNREFUSED");
});

test("testDatabaseConnection - 带 user/pass 认证连接", async (t) => {
  let connectOptions;
  const mongoose = {
    connect: (uri, options) => {
      connectOptions = options;
      return Promise.resolve();
    },
    disconnect: () => Promise.resolve(),
  };

  configChecker.__set__("mongoose", mongoose);

  const dbConfig = {
    user: "admin",
    pass: "secret",
    servername: "localhost",
    port: 27017,
    DATABASE: "test",
  };

  await configChecker.testDatabaseConnection(dbConfig);
  t.truthy(connectOptions);
  t.is(connectOptions.user, "admin");
  t.is(connectOptions.pass, "secret");
});

test("testDatabaseConnection - 使用 connectString", async (t) => {
  let connectUri;
  const mongoose = {
    connect: (uri) => {
      connectUri = uri;
      return Promise.resolve();
    },
    disconnect: () => Promise.resolve(),
  };

  configChecker.__set__("mongoose", mongoose);

  const dbConfig = {
    connectString: "mongodb://user:pass@localhost:27017/mydb",
  };

  await configChecker.testDatabaseConnection(dbConfig);
  t.is(connectUri, "mongodb://user:pass@localhost:27017/mydb");
});

test("testDatabaseConnection - 含 authSource", async (t) => {
  let connectOptions;
  let connectUri;
  const mongoose = {
    connect: (uri, options) => {
      connectUri = uri;
      connectOptions = options;
      return Promise.resolve();
    },
    disconnect: () => Promise.resolve(),
  };

  configChecker.__set__("mongoose", mongoose);

  const dbConfig = {
    servername: "localhost",
    port: 27017,
    DATABASE: "test",
    authSource: "admin",
  };

  await configChecker.testDatabaseConnection(dbConfig);
  t.truthy(connectUri);
  t.true(connectUri.includes("?authSource=admin"));
});
