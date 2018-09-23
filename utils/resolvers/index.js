const resolvers = {
  Query: {
    searchGame: async (_, { name, limit }, { dataSources }) => dataSources.api.games(limit, name),

    popularGames: async (_, { limit }, { dataSources }) => dataSources.api.games(limit),

    cloudinaryImg: async (_, { id }, { dataSources }) => dataSources.api.getCloudinaryImg(id),

    searchGameById: async (_, { id }, { dataSources }) => dataSources.api.gameById(id)
  }
}

export {
  resolvers
}
