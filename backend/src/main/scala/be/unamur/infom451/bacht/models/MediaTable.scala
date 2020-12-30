package be.unamur.infom451.bacht.models

import be.unamur.infom451.bacht.lib._

import scala.concurrent.{ExecutionContext, Future}


object MediaTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object Media {

    def all(implicit ec: ExecutionContext, db: Database): Future[Seq[Media]] =
      medias.execute

    def byId(id: Int)(
      implicit ec: ExecutionContext, db: Database
    ): Future[Option[Media]] = medias
      .withId(id)
      .oneOption

  }

  case class Media(
    id: Option[Int],
    name: String,
    kind: String,
    content: Array[Byte],
    creatorId: Int,
    shareaId: Int
  ) {
    def insert: Future[Media] =
      medias
        .insert(this)
        .execute
        .map( id => this.copy (id = Some(id)))

    def delete: Future[Boolean] =
      medias.withId(this.id.get)
        .delete
        .execute
        .map(m => if (m != 1) throw updateError else true)

    def update: Future[Media] =
      medias.insertOrUpdate(this)
        .execute
        .map(_ => this)
  }

  /* ----------------------------- Projection ----------------------------- */

  type MediaTuple = (Option[Int], String, String, Array[Byte], Int, Int)

  private def mediaApply(m: MediaTuple): Media =
    Media(m._1, m._2, m._3, m._4, m._5, m._6)

  private def mediaUnapply(m: Media): Option[MediaTuple] =
    Some(m.id, m.name, m.kind, m.content, m.creatorId, m.shareaId)

  /* -------------------------- Table definition --------------------------- */

  class Medias(tag: Tag) extends Table[Media](tag, "medias") {

    // Columns
    def id: Rep[Int] =
      column[Int]("id", O.PrimaryKey, O.AutoInc)

    def name: Rep[String] =
      column[String]("name", O.Length(128))

    def kind: Rep[String] =
      column[String]("type", O.Length(128))

    def content: Rep[Array[Byte]] =
      column[Array[Byte]]("content")

    def creatorId: Rep[Int] =
      column[Int]("creator_id")

    def shareaId: Rep[Int] =
      column[Int]("sharea_id")

    // Projection
    def * = (
      id.?, name, kind, content, creatorId, shareaId
    ) <> (mediaApply, mediaUnapply)

    def creator =
      foreignKey("medias_ibfk_1", creatorId, users)(_.id)

    def sharea =
      foreignKey("medias_ibfk_2", shareaId, shareas)(_.id)

  }

  val medias = TableQuery[Medias]

}
