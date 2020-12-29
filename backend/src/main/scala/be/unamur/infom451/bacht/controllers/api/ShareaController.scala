package be.unamur.infom451.bacht.controllers.api

import scala.concurrent.Future
import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.ShareaTable.Sharea
import be.unamur.infom451.bacht.models.{Media, Sharea}


object ShareaController extends Guide {

  val routes: Router = Router
    .add(Auth)
    .andThen[ShareaController]

  case class ShareaInfo(id: Int, name: String, creator: Int)
  type ShareaResponse = Seq[ShareaInfo]

  object DetailedShareaInfo {
    def from(sharea: Sharea): DetailedShareaInfo =
      DetailedShareaInfo(
        sharea.id.get,
        sharea.name,
        sharea.description,
        sharea.creatorId,
        Seq()
      )
    def from(sharea: Sharea, medias: Seq[Media]): DetailedShareaInfo =
      DetailedShareaInfo(
        sharea.id.get,
        sharea.name,
        sharea.description,
        sharea.creatorId,
        medias.map(_.id.get)
      )
  }
  case class DetailedShareaInfo(
    id: Int,
    name: String,
    description: String,
    creator: Int,
    medias: Seq[Int]
  )
  type DetailedShareaResponse = DetailedShareaInfo

  case class ShareaCreationRequest(
    name: String,
    description: String
  )
  object DetailedMediaInfo {
    def from(media: Media) : DetailedMediaInfo =
      DetailedMediaInfo(
        media.id.get,
        media.name,
        media.kind,
        media.content.map(_.toChar).mkString,
        media.creatorId,
        media.shareaId
      )
  }
  case class DetailedMediaInfo(
    id : Int,
    name : String,
    kind : String,
    content : String,
    author : Int,
    shareaId : Int
                              )
  type DetailedShareaMedias = Seq[DetailedMediaInfo]
  type DetailedMediaResponse = DetailedMediaInfo
}

@Endpoint(path = "/api/sharea")
trait ShareaController {

  import ShareaController._

  @Endpoint(method = HttpMethod.GET, path = "/")
  def all: Future[ShareaResponse] = Sharea
    .all
    .map(_.map(s => ShareaInfo(s.id.get, s.name, s.creatorId)))
    .recoverWith(ErrorResponse.recover(500))

  @Endpoint(method = HttpMethod.GET, path = "/:id")
  def one(id: Int): Future[DetailedShareaResponse] = Sharea
    .byIdWithMedias(id)
    .map {
      case (sharea, medias) => DetailedShareaInfo.from(sharea, medias)
    } recoverWith ErrorResponse.recover(404)

  @Endpoint(method = HttpMethod.GET, path = "/:id/medias")
  def medias(id : Int): Future[DetailedShareaMedias] = Sharea
    .byIdWithMedias(id)
    .map {
      case (_, medias) => medias.map(DetailedMediaInfo.from)
    } recoverWith ErrorResponse.recover(404)


  @Endpoint(method = HttpMethod.POST, path = "/")
  def create(request: ShareaCreationRequest): Future[DetailedShareaResponse] =
    withUser(u => u)
      .map(user => Sharea(None, request.name, request.description, user.id.get))
      .flatMap(_.insert)
      .map(DetailedShareaInfo.from)
      .recoverWith(ErrorResponse.recover(409))


  @Endpoint(method = HttpMethod.PUT, path = "/:id")
  def update(id: Int, request: ShareaCreationRequest): Future[DetailedShareaResponse] =
    withUser(u => u)
      .flatMap(user => Sharea
        .byId(id)
        .map(s => {
          if (s.get.creatorId != user.id.get) {
            throw notCreator
          }
          s.get
        }))
      .flatMap(current => Sharea.update(Sharea(current.id, request.name, request.description, current.creatorId))
        .map(DetailedShareaInfo.from))


  @Endpoint(method = HttpMethod.DELETE, path = "/:id")
  def delete(id: Int): Future[Boolean] =
    withUser(u => u)
      .flatMap(user => Sharea
        .byId(id)
        .map(s => {
          if (s.get.creatorId != user.id.get) {
            throw notCreator
          }
          s.get
        }))
      .flatMap(current => Sharea.delete(id))
}
