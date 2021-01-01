load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "uwulectron",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//packages/electron-discord/common:edis-common",
        "@npm//@types/luxon",
        "@npm//@types/node",
        "@npm//axios",
        "@npm//cookiecord",
        "@npm//discord.js",
        "@npm//dotenv",
        "@npm//ioredis",
        "@npm//luxon",
        "@npm//mysql",
        "@npm//parse-duration",
        "@npm//pretty-ms",
        "@npm//reflect-metadata",
        "@npm//typeorm",
    ],
)

nodejs_binary(
    name = "serve",
    data = [
        ":uwulectron",
        "//packages/electron-discord/common:edis-common",
    ],
    entry_point = ":src/index.ts",
)
