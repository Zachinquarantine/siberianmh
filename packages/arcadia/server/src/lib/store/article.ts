import { Article } from '../../entities/article'
import { User } from '../../entities/user'
import { IArticle, IMutationCreateArticleArgs } from '../generated/graphql'
import { ServerError } from '../graphql-error'
import { randomString } from '../randomizer'
import { sanitizeTitle } from '../sanitize'
import { IRequest } from '../types/gql-context'

export class ArticleStore {
  //#region Public API Query
  public async allArticles() {
    const articles = Article.find({
      relations: ['author'],
      // TODO: make this option configurable
      order: { id: 'DESC' },
    })

    return articles
  }

  public async getArticle(
    articleId: number | null | undefined,
    articleTitle: string | null | undefined,
  ) {
    let article = null

    if (articleId) {
      article = await Article.findOne({ where: { title: articleTitle } })
      return article
    }

    if (articleTitle) {
      article = await Article.findOne({ where: { id: articleId } })
      return article
    }
  }
  //#endregion

  //#region Public API Mutation
  public async createArticle(
    data: IMutationCreateArticleArgs,
    req: IRequest,
  ): Promise<IArticle> {
    const { title: originalTitle, text } = data
    const userId = req.session.userId

    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
      throw new ServerError('Unable to find user')
    }

    const title = sanitizeTitle(originalTitle)
    const htmlURL = `${user.username}/${title.toLowerCase}-${randomString(4)}`

    // TODO: Transpile MD to HTML
    const content = text

    const article = Article.create({
      title: originalTitle,
      body: text,
      body_html: content,
      description: '',
      html_url: htmlURL,
      author: user,
    })

    await article.save()

    return article
  }
  //#endregion
}
