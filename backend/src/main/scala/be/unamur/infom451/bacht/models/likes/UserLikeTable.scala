package be.unamur.infom451.bacht.models.likes

import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models._
import be.unamur.infom451.bacht.models.{Ops, api}

import scala.concurrent.{ExecutionContext, Future}

object UserLikeTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object UserLike {
    def all()
      (implicit ec: ExecutionContext, db: Database)
    : Future[Seq[UserLike]] =
      userLikes.execute

    def byId(id: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Option[UserLike]] = userLikes
      .withId(id)
      .oneOption

    def byLikedId(likedId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Seq[UserLike]] =
      userLikes
        .withLikedId(likedId)
        .execute

    def toggle(likerId: Int, likedId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[LikeResponse] =
      userLikes
        .withLikerId(likerId)
        .withLikedId(likedId)
        .oneOption
        .flatMap {
          case Some(l) => l.delete
          case None => UserLike(None, likerId, likedId).insert
        }
        .flatMap(_ => UserLike.likeInformation(likerId, likedId))

    def likeInformation(likerId: Int, likedId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[LikeResponse] = UserLike
      .byLikedId(likedId)
      .map(list => {
        LikeResponse(list.map(_.likerId).contains(likerId), list.length)
      })

  }

  case class UserLike(
    id      : Option[Int],
    likedId  : Int,
    likerId: Int
  ) {
    def insert: Future[UserLike] =
      userLikes
        .insert(this)
        .execute
        .map(id => this.copy(id = Some(id)))

    def delete: Future[Boolean] =
      userLikes.withId(this.id.get)
        .delete
        .execute
        .map(m => if (m != 1) throw updateError else true)

    def update: Future[UserLike] =
      userLikes.insertOrUpdate(this)
        .execute
        .map(_ => this)


  }

  /* ----------------------------- Projection ----------------------------- */

  type UserLikeTuple = (Option[Int], Int, Int)

  private def userLikeApply(m: UserLikeTuple): UserLike =
    UserLike(m._1, m._2, m._3)

  private def userLikeUnapply(m: UserLike): Option[UserLikeTuple] =
    Some(m.id, m.likerId, m.likedId)

  /* -------------------------- Table definition --------------------------- */

  class UserLikes(tag: Tag) extends Table[UserLike](tag, "user_like") {

    // Columns
    def id: Rep[Int] =
      column[Int]("id", O.PrimaryKey, O.AutoInc)

    def likerId: Rep[Int] =
      column[Int]("liker_id")

    def likedId: Rep[Int] =
    column[Int]("liked_id")

    // Projection
    def * = (
      id.?, likedId, likerId
    ) <> (userLikeApply, userLikeUnapply)

    def creator =
      foreignKey("user_like_ibfk_1", likerId, users)(_.id)

    def user =
      foreignKey("user_like_ibfk_2", likedId, users)(_.id)

  }

  val userLikes = TableQuery[UserLikes]
}
