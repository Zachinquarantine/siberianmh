load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_push")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "uwulectron",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "//packages/electron-discord/common:edis-common",
        "@npm//@sentry/node",
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

nodejs_image(
    name = "docker-uwulectron",
    data = [
        ":uwulectron",
    ],
    entry_point = ":src/index.ts",
)

container_push(
    name = "push-uwulectron",
    format = "Docker",
    image = ":docker-uwulectron",
    registry = "ghcr.io",
    repository = "siberianmh/uwulectron",
    tag = "latest",
)
