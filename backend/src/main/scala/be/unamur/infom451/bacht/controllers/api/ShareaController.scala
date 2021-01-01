package be.unamur.infom451.bacht.controllers.api

import scala.concurrent.Future
import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.lib.bacht.ShareaUserStore
import be.unamur.infom451.bacht.models.ShareaTable.Sharea
import be.unamur.infom451.bacht.models.likes.LikeResponse
import be.unamur.infom451.bacht.models.likes.ShareaLikeTable.{ShareaLike, shareaLikes}
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
        Seq(),
        None,
        None,
        ShareaUserStore.count_token("sharea_%d".format(sharea.id.get))
      )

    def from(sharea: Sharea, medias: Seq[Media]): DetailedShareaInfo =
      DetailedShareaInfo(
        sharea.id.get,
        sharea.name,
        sharea.description,
        sharea.creatorId,
        medias.map(_.id.get),
        None,
        None,
        ShareaUserStore.count_token("sharea_%d".format(sharea.id.get))
      )

    def from(sharea: Sharea, medias: Seq[Media], likeInformation: LikeResponse): DetailedShareaInfo =
      DetailedShareaInfo(
        sharea.id.get,
        sharea.name,
        sharea.description,
        sharea.creatorId,
        medias.map(_.id.get),
        Some(likeInformation.like),
        Some(likeInformation.likes),
        ShareaUserStore.count_token("sharea_%d".format(sharea.id.get))
      )
  }

  case class DetailedShareaInfo(
    id         : Int,
    name       : String,
    description: String,
    creator    : Int,
    medias     : Seq[Int],
    like       : Option[Boolean],
    likes      : Option[Int],
    connectedUsers: Int
  )

  type DetailedShareaResponse = DetailedShareaInfo

  case class ShareaCreationRequest(
    name: String,
    description: String
  )

  object DetailedMediaInfo {
    def from(media: Media): DetailedMediaInfo =
      DetailedMediaInfo(
        media.id.get,
        media.name,
        media.kind,
        media.content.map(_.toChar).mkString,
        media.creatorId,
        media.shareaId,
        None,
        None
      )
  }

  case class DetailedMediaInfo(
    id      : Int,
    name    : String,
    kind    : String,
    content : String,
    author  : Int,
    shareaId: Int,
    like    : Option[Boolean],
    likes   : Option[Int]
  )

  type DetailedShareaMedias = Seq[DetailedMediaInfo]
  type DetailedMediaResponse = DetailedMediaInfo
}

@Endpoint(path = "/api/sharea")
trait ShareaController {

  import ShareaController._

  @Endpoint(method = HttpMethod.GET, path = "/")
  def all: Future[Seq[DetailedShareaInfo]] = withUser(u => u)
    .flatMap(user =>
      Sharea.allWithMedia.map(sm => (user, sm))
    )
    .map {
      case (user, sm) => sm.map { case (sharea, medias) =>
        ShareaLike.likeInformation(user.id.get, sharea.id.get)
          .map(li => (sharea, medias, li))
      }
    }.flatMap((xs: Seq[Future[(Sharea, Seq[Media], LikeResponse)]]) => Future.sequence(xs))
    .map(smls => smls.map(sml => DetailedShareaInfo.from(sml._1, sml._2, sml._3)))

  @Endpoint(method = HttpMethod.GET, path = "/:id")
  def one(id: Int): Future[DetailedShareaResponse] =
    withUser(u => u)
      .flatMap(user => Sharea
        .byIdWithMedias(id)
        .flatMap {
          case (sharea, medias) => ShareaLike
            .likeInformation(user.id.get, id)
            .map(likeInformation => DetailedShareaInfo.from(sharea, medias, likeInformation))
        }
      ) recoverWith ErrorResponse.recover(404)

  @Endpoint(method = HttpMethod.GET, path = "/:id/medias")
  def medias(id: Int): Future[DetailedShareaMedias] = Sharea
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
      .flatMap(_ => Sharea.delete(id))

  @Endpoint(method = HttpMethod.POST, path = "/:id/sharealike")
  def likeSharea(id: Int): Future[LikeResponse] = {
    withUser(u => u).flatMap(user => {
      ShareaLike.toggle(user.id.get, id)
    })
  } recoverWith ErrorResponse.recover(418)

  @Endpoint(method = HttpMethod.GET, path = "/:id/count_users")
  def countUsers(id: Int): Future[Int] = {
    Future(ShareaUserStore.count_token("sharea_%d".format(id)))
  } recoverWith ErrorResponse.recover(418)

  @Endpoint(method = HttpMethod.POST, path = "/:id/enter")
  def userJoins(id: Int): Future[Int] = {
    ShareaUserStore.tell("sharea_%d".format(id))
    countUsers(id)
  } recoverWith ErrorResponse.recover(418)

  @Endpoint(method = HttpMethod.POST, path = "/:id/quit")
  def userQuits(id: Int): Future[Int] = {
    ShareaUserStore.get("sharea_%d".format(id))
    countUsers(id)
  } recoverWith ErrorResponse.recover(418)
}
