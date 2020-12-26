load("//:tools/ts_project.bzl", "ts_project")
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

package(default_visibility = ["//visibility:public"])

ts_project(
    name = "server",
    srcs = glob(["src/**/*.ts"]),
    deps = [
        "@npm//@graphql-tools/merge",
        "@npm//@graphql-tools/schema",
        "@npm//apollo-server-express",
        "@npm//argon2",
        "@npm//body-parser",
        "@npm//connect-redis",
        "@npm//dotenv",
        "@npm//express",
        "@npm//express-session",
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
