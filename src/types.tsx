type Article = {
  id: string,
  title: string,
  content: string,
  authorId: number,
  createdAt: string,
  updateAt: string,
  published: boolean
}

type Articles = {
  items: Article[],
  length: number
}

export type {
  Article,
  Articles,
}