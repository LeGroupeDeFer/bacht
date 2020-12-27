package be.unamur.infom451.bacht.models

import be.unamur.infom451.bacht.lib._


object UserTable {

  import api._

  /* ------------------------ ORM class definition ------------------------- */

  case class User(
     id: Option[Int],
     username: String,
     password: Hash,
     firstName: String,
     lastName: String,
     biopic: String,
     refreshTokenId: Int
  )

  class Users(tag: Tag) extends Table[User](tag, "users") {

    // Columns
    def id: Rep[Int] =
      column[Int]("id", O.PrimaryKey, O.AutoInc)

    def username: Rep[String] =
      column[String]("username", O.Unique, O.Length(128))

    def password: Rep[Hash] =
      column[Hash]("password", O.Length(128))

    def firstName: Rep[String] =
      column[String]("first_name", O.Length(128))

    def lastName: Rep[String] =
      column[String]("last_name", O.Length(128))

    def biopic: Rep[String] =
      column[String]("biopic")

    def refreshTokenId: Rep[Int] =
      column[Int]("refresh_token_id", O.Unique)

    // Projection
    def * = (
      id.?, username, password, firstName, lastName, biopic, refreshTokenId
    ) <> (User.tupled, User.unapply)

    // Foreign key
    def refreshToken =
      foreignKey("users_ibfk_1", refreshTokenId, tokens)(_.id)

  }

  val users = TableQuery[Users]

}
