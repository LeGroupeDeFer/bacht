package be.unamur.infom451.bacht.models

import scala.concurrent.{ExecutionContext, Future}


object ShareaTable {

  import api._
  import Ops._

  /* ------------------------ ORM class definition ------------------------- */

  object Sharea {

    def all(implicit ec: ExecutionContext, db: Database): Future[Seq[Sharea]] =
      shareas.execute

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

  }

  case class Sharea(
    id: Option[Int],
    name: String,
    description: String,
    creatorId: Int
  )

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
