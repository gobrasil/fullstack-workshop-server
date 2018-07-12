const Sequelize = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  logging: false
});

const CREATE_LIKES_QUERY = `CREATE TABLE likes(
  id INTEGER PRIMARY KEY,
  createdAt DATETIME,
  updatedAt DATETIME,
  user TEXT,
  movie TEXT
)`;

sequelize.query(CREATE_LIKES_QUERY);

const likes = sequelize.define("like", {
  user: Sequelize.STRING,
  movie: Sequelize.STRING
});

class LikesDB {
  async getMovieLikes({ user }) {
    return await likes.findAll({ where: { user } });
  }

  async toggleMovieLike({ id, user }) {
    const like = await likes.find({
      where: {
        user,
        movie: id
      }
    });

    if (!like) await likes.create({ user, movie: id });
    else await likes.destroy({ where: { user, movie: id } });
  }

  async isMovieLiked({ id, user }) {
    const like = await likes.find({ where: { user, movie: id } });
    return !!like;
  }
}

module.exports = LikesDB;
