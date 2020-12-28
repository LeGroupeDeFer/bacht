package be.unamur.infom451.bacht.models

import java.time.Clock

import be.unamur.infom451.bacht.lib.{after, now, timestampAfter, timestampNow}
import be.unamur.infom451.bacht.models.TokenTable.Token

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Random


object Ops {

  import api._
  import slick.dbio.DBIOAction
  import slick.dbio.NoStream

  implicit class SqlActionOps[+R, +S <: slick.dbio.NoStream, -E <: slick.dbio.Effect](
     a: DBIOAction[R, S, E]
   ) {

    def execute(implicit ec: ExecutionContext, db: Database): Future[R] =
      db.run(a)

  }

  // All Extension

  implicit class QueryOps[As, A, C[_]](q: Query[As, A, C]) {

    def one(implicit ec: ExecutionContext, db: Database): Future[A] =
      db.run(q.result.head)

    def oneOption(implicit ec: ExecutionContext, db: Database): Future[Option[A]] =
      db.run(q.result.headOption)

    def all(implicit ec: ExecutionContext, db: Database): Future[C[A]] =
      db.run(q.result)

    def execute(implicit ec: ExecutionContext, db: Database): Future[C[A]] =
      db.run(q.result)

  }

  // User Extension

  implicit class UserQueryOps[C[_]](q: Query[Users, User, C]) {

    def withId(id: Int): Query[Users, User, C] =
      q.filter(_.id === id)

    def withUsername(username: String): Query[Users, User, C] =
      q.filter(_.username === username)

    def withFirstName(firstName: String): Query[Users, User, C] =
      q.filter(_.firstName === firstName)

    def withLastName(lastName: String): Query[Users, User, C] =
      q.filter(_.lastName === lastName)

    def withName(name: String): Query[Users, User, C] =
      q.filter(u => u.username === name || u.firstName === name || u.lastName === name)

    def withToken: Query[(Users, Tokens), (User, Token), C] =
      q.join(tokens).on(_.refreshTokenId === _.id)

    def token: Query[Tokens, Token, C] = q.withToken.map(_._2)

    def insert(user: User): DBIOAction[Int, NoStream, Effect.Write] =
      users returning users.map(_.id) += user

  }

  // Token Extension

  implicit class TokenQueryOps[C[_]](q: Query[Tokens, Token, C]) {

    private def seed: String = Random.alphanumeric.take(32).mkString

    def withId(id: Int): Query[Tokens, Token, C] =
      q.filter(_.id === id)

    def withHash(hash: String): Query[Tokens, Token, C] =
      q.filter(_.hash === hash)

    def ifNotExpired: Query[Tokens, Token, C] =
      q.filter(_.expirationDate >= timestampNow())


    def insert(lifetime: Long)(implicit clock: Clock): DBIOAction[Int, NoStream, Effect.Write] =
      tokens returning tokens.map(_.id) += Token(None, seed, now, Some(after(Math.max(0, lifetime))))

    def revoke: DBIOAction[Int, NoStream, Effect.Write] =
      q.map(_.expirationDate).update(timestampNow())

    def renew(hash: String, lifetime: Long)(implicit clock: Clock): DBIOAction[Int, NoStream, Effect.Write] =
      q.map(t => (t.hash, t.expirationDate)).update((hash, timestampAfter(lifetime)))

  }

  // Sharea Extension

  implicit class ShareaQueryOps[C[_]](q: Query[Shareas, Sharea, C]) {

    def withId(id: Int): Query[Shareas, Sharea, C] =
      q.filter(_.id === id)

    def withName(name: String): Query[Shareas, Sharea, C] =
      q.filter(_.name === name)

    def insert(sharea: Sharea): DBIOAction[Int, NoStream, Effect.Write] =
      shareas returning shareas.map(_.id) += sharea

  }

  implicit class MediaQueryOps[C[_]](q: Query[Medias, Media, C]) {

    def withId(id: Int): Query[Medias, Media, C] =
      q.filter(_.id === id)

    def insert(media: Media): DBIOAction[Int, NoStream, Effect.Write] =
      medias returning medias.map(_.id) += media

  }

}
