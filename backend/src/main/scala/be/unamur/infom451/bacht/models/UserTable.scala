package be.unamur.infom451.bacht.models

import scala.concurrent.{ExecutionContext, Future}

import be.unamur.infom451.bacht.lib._


object UserTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object User {

    def all(implicit ec: ExecutionContext, db: Database): Future[Seq[User]] =
      users.execute

    def byId(id: Int)(
      implicit ec: ExecutionContext, db: Database
    ): Future[Option[User]] = users
      .withId(id)
      .oneOption

    def byUsername(username: String)(
      implicit ec: ExecutionContext, db: Database
    ): Future[Option[User]] = users
      .withUsername(username)
      .oneOption

    def byIdWithShareas(id: Int)(
      implicit ec: ExecutionContext, db: Database
    ): Future[(User, Seq[Sharea])] = users
      .withId(id)
      .withShareas
      .execute
      .map {
        case Nil => throw unknownIdentifier
        case xs => (xs.head._1, xs.flatMap(_._2))
      }

    def byUsernameWithShareas(username: String)(
      implicit ec: ExecutionContext, db: Database
    ): Future[(User, Seq[Sharea])] = users
      .withUsername(username)
      .withShareas
      .execute
      .map {
        case Nil => throw unknownIdentifier
        case xs => (xs.head._1, xs.flatMap(_._2))
      }

    def update(user: User)(implicit ec: ExecutionContext, db: Database):
    Future[User] =
      users
        .withId(user.id.get)
        .update(user)
        .execute
        .map(m => if (m != 1) throw updateError else m)
        .map(_ => user)

    def delete(id: Int)(implicit ec: ExecutionContext, db: Database):
    Future[Boolean] =
      users.withId(id).delete.execute.map(m => if(m!=1) throw updateError else true)
  }

  case class User(
     id: Option[Int],
     username: String,
     password: Hash,
     firstName: String,
     lastName: String,
     biopic: String,
     refreshTokenId: Int
  )

  /* ----------------------------- Projection ----------------------------- */

  type UserTuple = (Option[Int], String, Hash, String, String, String, Int)

  // Tuple -> Token
  private def userApply(u: UserTuple): User =
    User(u._1, u._2, u._3, u._4, u._5, u._6, u._7)

  // Token -> Tuple
  private def userUnapply(u: User): Option[UserTuple] = Some(
    u.id, u.username, u.password, u.firstName, u.lastName, u.biopic,
    u.refreshTokenId
  )

  /* -------------------------- Table definition --------------------------- */

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
      column[String]("biopic", O.Length(256))

    def refreshTokenId: Rep[Int] =
      column[Int]("refresh_token_id", O.Unique)

    // Projection
    def * = (
      id.?, username, password, firstName, lastName, biopic, refreshTokenId
    ) <> (userApply, userUnapply)

    // Foreign key
    def refreshToken =
      foreignKey("users_ibfk_1", refreshTokenId, tokens)(_.id)

  }

  val users = TableQuery[Users]

}
