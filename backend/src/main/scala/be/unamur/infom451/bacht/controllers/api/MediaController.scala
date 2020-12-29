package be.unamur.infom451.bacht.controllers.api

import com.twitter.util.{Future => TwitterFuture}
import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.Media
import be.unamur.infom451.bacht.models.MediaTable.Media

import java.sql.Blob
import scala.concurrent.Future

object MediaController extends Guide {

  /* ------------------------------- Routes -------------------------------- */

  val routes: Router = Router
    .add(Auth)
    .andThen[MediaController]

  case class MediaCreationRequest(
    name: String,
    content: String,
    kind : String,
    shareaId : Int
  )

  object DetailedMediaInfo {
    def from(media: Media) : DetailedMediaInfo =
      DetailedMediaInfo(
        media.id.get,
        media.name,
        media.kind,
        media.content.toString,
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
  type DetailedMediaResponse = DetailedMediaInfo

  type MediaUpdateRequest = MediaCreationRequest
}

@Endpoint(path = "/api/media")
trait MediaController {

  import MediaController._
  //import ShareaController._

  @Endpoint(method = HttpMethod.POST, path = "/")
  def insertMedia (request: MediaCreationRequest): Future[DetailedMediaResponse] =
    withUser(u => u)
      .map(user =>
        Media(None, request.name, request.kind,request.content.getBytes,user.id.get,request.shareaId)
      )
      .flatMap(_.insert)
      .map(DetailedMediaInfo.from)
      .recoverWith(ErrorResponse.recover(409))

  @Endpoint(method = HttpMethod.DELETE, path = "/:id")
  def deleteMedia (id : Int): Future[Unit] =
    Media.byId(id)
      .flatMap(optionMedia => optionMedia.get.delete)
      .recoverWith(ErrorResponse.recover(404))

  @Endpoint(method = HttpMethod.PUT, path= "/:id")
  def updateMedia(id: Int, change : MediaUpdateRequest) : Future[Media] =
    Media.byId(id)
      .map(media => media.get.copy(
        name = change.name, content = change.content.getBytes, kind = change.kind, shareaId = change.shareaId)
      )
      .flatMap(mediaCopy => mediaCopy.update)
      .recoverWith(ErrorResponse.recover(404))

}





