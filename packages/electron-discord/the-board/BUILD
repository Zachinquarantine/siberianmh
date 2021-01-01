load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "the-board",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//packages/electron-discord/common:edis-common",
        "@npm//@sentry/node",
        "@npm//@types/node",
        "@npm//axios",
        "@npm//cookiecord",
        "@npm//discord.js",
    ],
)

nodejs_binary(
    name = "serve",
    data = [
        ":the-board",
    ],
    entry_point = ":src/index.ts",
)
