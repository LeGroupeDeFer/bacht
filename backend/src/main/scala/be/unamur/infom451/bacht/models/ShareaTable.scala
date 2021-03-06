package be.unamur.infom451.bacht.models

import scala.concurrent.{ExecutionContext, Future}

import be.unamur.infom451.bacht.lib._


object ShareaTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object Sharea {

    def all(implicit ec: ExecutionContext, db: Database): Future[Seq[Sharea]] =
      shareas.execute

    def allWithMedia (implicit ec: ExecutionContext, db: Database): Future[Seq[(Sharea, Seq[Media])]] =
      shareas
        .withMedias
        .execute
        .map(
          _.groupBy(_._1.id)
            .toSeq
            .map (t => (t._2.head._1, t._2.filter(_._2.isDefined).map(_._2.get)))
        )

    def byId(id: Int)(
      implicit ec: ExecutionContext, db: Database
    ): Future[Option[Sharea]] = shareas
      .withId(id)
      .oneOption

    def byName(name: String)(
      implicit ec: ExecutionContext, db: Database
    ): Future[Option[Sharea]] = shareas
      .withName(name)
      .oneOption

    def byIdWithMedias(id: Int)(
      implicit ec: ExecutionContext, db: Database
    ): Future[(Sharea, Seq[Media])] = shareas
      .withId(id)
      .withMedias
      .execute
      .map {
        case Nil => throw unknownIdentifier
        case xs => (xs.head._1, xs.flatMap(_._2))
      }

    def update(sharea: Sharea)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Sharea] = shareas
      .withId(sharea.id.get)
      .update(sharea)
      .execute
      .map(m => if (m != 1) throw updateError else m)
      .map(_ => sharea)

    def delete(id: Int)
      (implicit ec: ExecutionContext, db: Database)
    : Future[Boolean] = shareas
      .withId(id)
      .delete
      .execute
      .map(m => if (m != 1) throw updateError else true)
  }

  case class Sharea(
    id         : Option[Int],
    name       : String,
    description: String,
    creatorId  : Int
  ) {

    def insert: Future[Sharea] = shareas
      .insert(this)
      .execute
      .map(id => this.copy(id = Some(id)))
  }

  /* ----------------------------- Projection ----------------------------- */

  type ShareaTuple = (Option[Int], String, String, Int)

  private def shareaApply(s: ShareaTuple): Sharea =
    Sharea(s._1, s._2, s._3, s._4)

  private def shareaUnapply(s: Sharea): Option[ShareaTuple] =
    Some(s.id, s.name, s.description, s.creatorId)

  /* -------------------------- Table definition --------------------------- */

  class Shareas(tag: Tag) extends Table[Sharea](tag, "shareas") {

    // Columns
    def id: Rep[Int] =
      column[Int]("id", O.PrimaryKey, O.AutoInc)

    def name: Rep[String] =
      column[String]("name", O.Length(128))

    def description: Rep[String] =
      column[String]("description", O.Length(256))

    def creatorId: Rep[Int] =
      column[Int]("creator_id")

    // Projection
    def * = (
      id.?, name, description, creatorId
    ) <> (shareaApply, shareaUnapply)

    def creator =
      foreignKey("shareas_ibfk_1", creatorId, users)(_.id)

  }

  val shareas = TableQuery[Shareas]

}
