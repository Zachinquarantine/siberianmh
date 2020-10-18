import { Article } from '../../entities/article'

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

  public async getArticle(articleId: number, articleTitle: string) {
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
}
