load("//:tools/ts_library.bzl", "ts_library")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

package(default_visibility = ["//visibility:public"])

ts_library(
    name = "server",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "@npm//@graphql-tools/merge",
        "@npm//@graphql-tools/schema",
        "@npm//@types/body-parser",
        "@npm//@types/connect-redis",
        "@npm//@types/express",
        "@npm//@types/express-session",
        "@npm//@types/glob",
        "@npm//@types/ioredis",
        "@npm//@types/node",
        "@npm//apollo-server-express",
        "@npm//argon2",
        "@npm//body-parser",
        "@npm//connect-redis",
        "@npm//dotenv",
        "@npm//express",
        "@npm//express-session",
        "@npm//glob",
        "@npm//graphql",
        "@npm//ioredis",
        "@npm//reflect-metadata",
        "@npm//typeorm",
    ],
)

nodejs_binary(
    name = "serve",
    data = [
        ":server",
    ],
    entry_point = ":src/index.ts",
)
