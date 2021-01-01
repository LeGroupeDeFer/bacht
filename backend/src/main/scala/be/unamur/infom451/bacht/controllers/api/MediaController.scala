package be.unamur.infom451.bacht.controllers.api

import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.MediaTable.Media
import be.unamur.infom451.bacht.models.likes.LikeResponse
import be.unamur.infom451.bacht.models.likes.MediaLikeTable.MediaLike

import java.util.Base64
import scala.concurrent.Future

object MediaController extends Guide {

  /* ------------------------------- Routes -------------------------------- */

  val routes: Router = Router
    .add(Auth)
    .andThen[MediaController]

  case class MediaCreationRequest(
    name: String,
    content : String,
    kind    : String,
    shareaId: Int
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

    def from(media: Media, likeInfo: LikeResponse): DetailedMediaInfo =
      DetailedMediaInfo(
        media.id.get,
        media.name,
        media.kind,
        media.content.map(_.toChar).mkString,
        media.creatorId,
        media.shareaId,
        Some(likeInfo.like),
        Some(likeInfo.likes)
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

  type DetailedMediaResponse = DetailedMediaInfo

  case class MediaUpdateRequest(
    name   : String,
    content: String,
  )

}

@Endpoint(path = "/api/media")
trait MediaController {

  import MediaController._

  @Endpoint(method = HttpMethod.GET, path = "/kinds")
  def availableMediaKinds: Seq[String] = Seq("text", "sound", "video", "image")

  @Endpoint(method = HttpMethod.POST, path = "/")
  def insertMedia(request: MediaCreationRequest): Future[DetailedMediaResponse] =
    withUser(u => u)
      .map(user => {
        if (!availableMediaKinds.contains(request.kind)) {
          throw invalidAttribute
        }
        Media(None, request.name, request.kind, request.content.getBytes, user.id.get, request.shareaId)
      }
      )
      .flatMap(_.insert)
      .map(DetailedMediaInfo.from)
      .recoverWith(ErrorResponse.recover(409))

  @Endpoint(method = HttpMethod.GET, path = "/:id")
  def getMedia(id: Int): Future[DetailedMediaResponse] = {
    withUser(u => u)
      .flatMap(user => Media
        .byId(id)
        .flatMap(optionMedia => MediaLike
          .likeInformation(user.id.get, id)
          .map(likeInformation => DetailedMediaInfo.from(optionMedia.get, likeInformation)))
      )

      .recoverWith(ErrorResponse.recover(404))
  }

  @Endpoint(method = HttpMethod.DELETE, path = "/:id")
  def deleteMedia(id: Int): Future[Boolean] =
    Media.byId(id)
      .flatMap(optionMedia => optionMedia.get.delete)
      .recoverWith(ErrorResponse.recover(404))

  @Endpoint(method = HttpMethod.PUT, path = "/:id")
  def updateMedia(id: Int, change: MediaUpdateRequest): Future[Media] =
    Media.byId(id)
      .map(media => media.get.copy(
        name = change.name, content = change.content.getBytes)
      )
      .flatMap(mediaCopy => mediaCopy.update)
      .recoverWith(ErrorResponse.recover(404))

  @Endpoint(method = HttpMethod.POST, path = "/:id/medialike")
  def likeMedia(id: Int): Future[LikeResponse] = {
    withUser(u => u).flatMap(user => {
      MediaLike.toggle(user.id.get, id)
    })
  } recoverWith ErrorResponse.recover(418)
}
