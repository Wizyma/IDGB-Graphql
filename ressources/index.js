import { is } from 'ramda';
import { RESTDataSource } from 'apollo-datasource-rest';
import igdb from 'igdb-api-node';

class Resources extends RESTDataSource {
  constructor (config = {
    API_KEY: null,
  }) {
    super();

    if (!is(Object, config)) {
      throw new Error(`config must be an object instead got ${typeof config}`);
    }

    const { API_KEY } = config;

    this.client = igdb(API_KEY);
  }

  async games (limit, name) {
    let games

    if (name) {
      games = await this.client.games({
        fields: '*',
        limit,
        offset: 0,
        search: name,
        order: 'release_dates.date:desc'
      })
    } else {
      games = await this.client.games({
        fields: '*',
        filters: {
          'popularity-gt': 80
        },
        limit,
        offset: 0,
        order: 'rating:desc'
      })
    }

    const withReviews = await Promise.all(games.body.map(async game => {
      const reviews = await this.client.reviews({
        fields: '*',
        filters: {
          'game-eq': game.id
        }
      })

      return {
        ...game,
        reviews: reviews.body
      }
    }))

    const withCredits = await Promise.all(withReviews.map(async game => {
      const credits = await this.client.credits({
        fields: '*',
        filters: {
          'game-eq': game.id
        }
      })

      return {
        ...game,
        credits: credits.game
      }
    }))

    return withCredits
  }

  async gameById (id) {
    const game = await this.client.games({
      fields: '*',
      offset: 0,
      order: 'release_dates.date:desc',
      ids: [
        id
      ]
    })

    const reviews = await this.client.reviews({
      fields: '*',
      filters: {
        'game-eq': id
      }
    })

    const credits = await this.client.credits({
      fields: '*',
      filters: {
        'game-eq': id
      }
    })

    return {
      ...game.body[0],
      reviews: reviews.body,
      credits: credits.body
    }
  }

  async getCloudinaryImg (id) {
    const img = await this.client.image({
      cloudinary_id: id
    }, 'cover_big')

    return img
  }
}

export default Resources;
