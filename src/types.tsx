type Article = {
  article_id: string,
  title: string,
  body: string,
  createdAt: string
}

type Articles = {
  items: Article[],
  total_items: number
}

export type {
  Article,
  Articles,
}