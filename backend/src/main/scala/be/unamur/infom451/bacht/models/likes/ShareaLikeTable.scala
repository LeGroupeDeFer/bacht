package be.unamur.infom451.bacht.models.likes

import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models._
import be.unamur.infom451.bacht.models.{Ops, api}

import scala.concurrent.{ExecutionContext, Future}

object ShareaLikeTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object ShareaLike {
    def all()
      (implicit ec: ExecutionContext, db: Database)
    : Future[Seq[ShareaLike]] =
      shareaLikes.execute

    def byId(id: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Option[ShareaLike]] = shareaLikes
      .withId(id)
      .oneOption

    def byShareaId(shareaId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Seq[ShareaLike]] =
      shareaLikes
        .withShareaId(shareaId)
        .execute

    def toggle(userId: Int, shareaId: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[LikeResponse] =
      shareaLikes
        .withUserId(userId)
        .withShareaId(shareaId)
        .oneOption
        .flatMap {
          case Some(l) => l.delete
          case None => ShareaLike(None, userId, shareaId).insert
        }
        .flatMap(_ => ShareaLike.byShareaId(shareaId).map(list => {
          LikeResponse(list.map(_.userId).contains(userId), list.length)
        }))
  }

  case class ShareaLike(
    id      : Option[Int],
    userId  : Int,
    shareaId: Int
  ) {
    def insert: Future[ShareaLike] =
      shareaLikes
        .insert(this)
        .execute
        .map(id => this.copy(id = Some(id)))

    def delete: Future[Boolean] =
      shareaLikes.withId(this.id.get)
        .delete
        .execute
        .map(m => if (m != 1) throw updateError else true)

    def update: Future[ShareaLike] =
      shareaLikes.insertOrUpdate(this)
        .execute
        .map(_ => this)


  }

  /* ----------------------------- Projection ----------------------------- */

  type ShareaLikeTuple = (Option[Int], Int, Int)

  private def shareaLikeApply(m: ShareaLikeTuple): ShareaLike =
    ShareaLike(m._1, m._2, m._3)

  private def shareaLikeUnapply(m: ShareaLike): Option[ShareaLikeTuple] =
    Some(m.id, m.userId, m.shareaId)

  /* -------------------------- Table definition --------------------------- */

  class ShareaLikes(tag: Tag) extends Table[ShareaLike](tag, "sharea_like") {

    // Columns
    def id: Rep[Int] =
      column[Int]("id", O.PrimaryKey, O.AutoInc)

    def userId: Rep[Int] =
      column[Int]("user_id")

    def shareaId: Rep[Int] =
      column[Int]("sharea_id")

    // Projection
    def * = (
      id.?, userId, shareaId
    ) <> (shareaLikeApply, shareaLikeUnapply)

    def creator =
      foreignKey("sharea_like_ibfk_1", userId, users)(_.id)

    def sharea =
      foreignKey("sharea_like_ibfk_2", shareaId, shareas)(_.id)

  }

  val shareaLikes = TableQuery[ShareaLikes]
}
