import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql'
import { IContext } from '../types/gql-context'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X]
} &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type IArticle = {
  __typename?: 'Article'
  id: Scalars['Int']
  title: Scalars['String']
  body: Scalars['String']
  body_html: Scalars['String']
  author?: Maybe<IUser>
  created_at: Scalars['Date']
}

export type IQuery = {
  __typename?: 'Query'
  allArticles: Array<IArticle>
  getArticle?: Maybe<IArticle>
  user: IUser
  viewer: IUser
}

export type IQueryAllArticlesArgs = {
  first: Scalars['Int']
}

export type IQueryGetArticleArgs = {
  articleId?: Maybe<Scalars['Int']>
  articleName?: Maybe<Scalars['String']>
}

export type IQueryUserArgs = {
  login: Scalars['String']
}

export type IMutation = {
  __typename?: 'Mutation'
  createArticle: IArticle
  deleteArticle: Scalars['Boolean']
  login: IUser
  register: IUser
}

export type IMutationCreateArticleArgs = {
  title: Scalars['String']
  text: Scalars['String']
}

export type IMutationDeleteArticleArgs = {
  id: Scalars['Int']
}

export type IMutationLoginArgs = {
  email: Scalars['String']
  password: Scalars['String']
}

export type IMutationRegisterArgs = {
  username: Scalars['String']
  email: Scalars['String']
  password: Scalars['String']
}

export type IUser = {
  __typename?: 'User'
  id: Scalars['Int']
  username: Scalars['String']
  email: Scalars['String']
  avatar_url: Scalars['String']
  site_admin: Scalars['Boolean']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
  Article: ResolverTypeWrapper<IArticle>
  Int: ResolverTypeWrapper<Scalars['Int']>
  String: ResolverTypeWrapper<Scalars['String']>
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Date: ResolverTypeWrapper<Scalars['Date']>
  User: ResolverTypeWrapper<IUser>
}

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
  Article: IArticle
  Int: Scalars['Int']
  String: Scalars['String']
  Query: {}
  Mutation: {}
  Boolean: Scalars['Boolean']
  Date: Scalars['Date']
  User: IUser
}

export type IArticleResolvers<
  ContextType = IContext,
  ParentType extends IResolversParentTypes['Article'] = IResolversParentTypes['Article']
> = {
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>
  title?: Resolver<IResolversTypes['String'], ParentType, ContextType>
  body?: Resolver<IResolversTypes['String'], ParentType, ContextType>
  body_html?: Resolver<IResolversTypes['String'], ParentType, ContextType>
  author?: Resolver<Maybe<IResolversTypes['User']>, ParentType, ContextType>
  created_at?: Resolver<IResolversTypes['Date'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type IQueryResolvers<
  ContextType = IContext,
  ParentType extends IResolversParentTypes['Query'] = IResolversParentTypes['Query']
> = {
  allArticles?: Resolver<
    Array<IResolversTypes['Article']>,
    ParentType,
    ContextType,
    RequireFields<IQueryAllArticlesArgs, 'first'>
  >
  getArticle?: Resolver<
    Maybe<IResolversTypes['Article']>,
    ParentType,
    ContextType,
    RequireFields<IQueryGetArticleArgs, never>
  >
  user?: Resolver<
    IResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<IQueryUserArgs, 'login'>
  >
  viewer?: Resolver<IResolversTypes['User'], ParentType, ContextType>
}

export type IMutationResolvers<
  ContextType = IContext,
  ParentType extends IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation']
> = {
  createArticle?: Resolver<
    IResolversTypes['Article'],
    ParentType,
    ContextType,
    RequireFields<IMutationCreateArticleArgs, 'title' | 'text'>
  >
  deleteArticle?: Resolver<
    IResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<IMutationDeleteArticleArgs, 'id'>
  >
  login?: Resolver<
    IResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<IMutationLoginArgs, 'email' | 'password'>
  >
  register?: Resolver<
    IResolversTypes['User'],
    ParentType,
    ContextType,
    RequireFields<IMutationRegisterArgs, 'username' | 'email' | 'password'>
  >
}

export interface IDateScalarConfig
  extends GraphQLScalarTypeConfig<IResolversTypes['Date'], any> {
  name: 'Date'
}

export type IUserResolvers<
  ContextType = IContext,
  ParentType extends IResolversParentTypes['User'] = IResolversParentTypes['User']
> = {
  id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>
  username?: Resolver<IResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<IResolversTypes['String'], ParentType, ContextType>
  avatar_url?: Resolver<IResolversTypes['String'], ParentType, ContextType>
  site_admin?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type IResolvers<ContextType = IContext> = {
  Article?: IArticleResolvers<ContextType>
  Query?: IQueryResolvers<ContextType>
  Mutation?: IMutationResolvers<ContextType>
  Date?: GraphQLScalarType
  User?: IUserResolvers<ContextType>
}
