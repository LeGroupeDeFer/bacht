package be.unamur.infom451.bacht.models.likes

import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models._
import be.unamur.infom451.bacht.models.Ops

import scala.concurrent.{ExecutionContext, Future}

object MediaLikeTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object MediaLike {
    def all()
      (implicit ec: ExecutionContext, db: Database)
    : Future[Seq[MediaLike]] =
      mediaLikes.execute

    def byId(id: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Option[MediaLike]] = mediaLikes
      .withId(id)
      .oneOption

    def byMediaId(mediaId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Seq[MediaLike]] =
      mediaLikes
        .withMediaId(mediaId)
        .execute

    def toggle(userId: Int, mediaId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[LikeResponse] =
      mediaLikes
        .withUserId(userId)
        .withMediaId(mediaId)
        .oneOption
        .flatMap {
          case Some(l) => l.delete
          case None => MediaLike(None, mediaId, userId).insert
        }
        .flatMap(_ => MediaLike.likeInformation(userId, mediaId))

    def likeInformation(userId: Int, mediaId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[LikeResponse] = MediaLike
      .byMediaId(mediaId)
      .map(list => {
        LikeResponse(list.map(_.userId).contains(userId), list.length)
      })

  }

  case class MediaLike(
    id: Option[Int],
    mediaId: Int,
    userId  : Int
  ) {
    def insert: Future[MediaLike] =
      mediaLikes
        .insert(this)
        .execute
        .map(id => this.copy(id = Some(id)))

    def delete: Future[Boolean] =
      mediaLikes.withId(this.id.get)
        .delete
        .execute
        .map(m => if (m != 1) throw updateError else true)

    def update: Future[MediaLike] =
      mediaLikes.insertOrUpdate(this)
        .execute
        .map(_ => this)


  }

  /* ----------------------------- Projection ----------------------------- */

  type MediaLikeTuple = (Option[Int], Int, Int)

  private def mediaLikeApply(m: MediaLikeTuple): MediaLike =
    MediaLike(m._1, m._2, m._3)

  private def mediaLikeUnapply(m: MediaLike): Option[MediaLikeTuple] =
    Some(m.id, m.mediaId, m.userId)

  /* -------------------------- Table definition --------------------------- */

  class MediaLikes(tag: Tag) extends Table[MediaLike](tag, "media_like") {

    // Columns
    def id: Rep[Int] =
      column[Int]("id", O.PrimaryKey, O.AutoInc)

    def mediaId: Rep[Int] =
      column[Int]("media_id")

    def userId: Rep[Int] =
      column[Int]("user_id")


    // Projection
    def * = (
      id.?, mediaId, userId
    ) <> (mediaLikeApply, mediaLikeUnapply)

    def creator =
      foreignKey("media_like_ibfk_1", mediaId, medias)(_.id)

    def media =
      foreignKey("media_like_ibfk_2", userId, users)(_.id)

  }

  val mediaLikes = TableQuery[MediaLikes]
}
