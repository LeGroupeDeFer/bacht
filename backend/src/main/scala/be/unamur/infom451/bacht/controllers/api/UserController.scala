package be.unamur.infom451.bacht.controllers.api

import be.unamur.infom451.bacht.controllers.api.ShareaController.{DetailedShareaInfo, ShareaInfo}

import scala.concurrent.Future
import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import pdi.jwt.JwtClaim
import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.Sharea
import be.unamur.infom451.bacht.models.UserTable.User
import be.unamur.infom451.bacht.models.likes.LikeResponse
import be.unamur.infom451.bacht.models.likes.UserLikeTable.UserLike


object UserController extends Guide {

  val routes: Router = Router
    .add(Auth)
    .andThen[UserController]

  case class UserInfo(id: Int, username: String)

  type UserResponse = Seq[UserInfo]

  object DetailedUserInfo {
    def from(user: User): DetailedUserInfo =
      DetailedUserInfo(
        user.id.get,
        user.username,
        user.firstName,
        user.lastName,
        user.biopic,
        Seq(),
        None,
        None
      )

    def from(user: User, shareas: Seq[Sharea]): DetailedUserInfo =
      DetailedUserInfo(
        user.id.get,
        user.username,
        user.firstName,
        user.lastName,
        user.biopic,
        shareas.map(_.id.get),
        None,
        None
      )

    def from(user: User, shareas: Seq[Sharea], likeInfo: LikeResponse): DetailedUserInfo =
      DetailedUserInfo(
        user.id.get,
        user.username,
        user.firstName,
        user.lastName,
        user.biopic,
        shareas.map(_.id.get),
        Some(likeInfo.like),
        Some(likeInfo.likes)
      )
  }

  case class DetailedUserInfo(
    id       : Int,
    username : String,
    firstName: String,
    lastName : String,
    biopic   : String,
    shareas  : Seq[Int],
    like     : Option[Boolean],
    likes    : Option[Int]
  )

  type DetailedUserResponse = DetailedUserInfo

  type UserShareaResponse = Seq[ShareaInfo]

  case class UpdateRequest(
    username : String,
    firstName: String,
    lastName : String,
    biopic   : String
  )

}

@Endpoint(path = "/api/user")
trait UserController {

  import UserController._

  @Endpoint(method = HttpMethod.GET, path = "/")
  def all: Future[UserResponse] = User
    .all
    .map(_.map(u => UserInfo(u.id.get, u.username)))
    .recoverWith(ErrorResponse.recover(500))

  @Endpoint(method = HttpMethod.GET, path = "/:id/sharea")
  def userShareas(id: String): Future[UserShareaResponse] =
    withContextValue("token") { (token: JwtClaim) =>
      val user =
        if (id == "self") User byUsernameWithShareas token.subject.get
        else User byIdWithShareas id.toInt

      user map {
        case (_, shareas) => shareas.map(s => ShareaInfo(s.id.get, s.name, s.creatorId))
      }

    } recoverWith ErrorResponse.recover(404)

  @Endpoint(method = HttpMethod.GET, path = "/:id")
  def one(id: String): Future[DetailedUserResponse] = {
    withUser(u => u)
      .flatMap(current => {
        val user =
          if (id == "self") User byIdWithShareas current.id.get
          else User byIdWithShareas id.toInt

        user.flatMap {
          case (user, shareas) => UserLike
            .likeInformation(current.id.get, user.id.get)
            .map(likeInfo => DetailedUserInfo.from(user, shareas, likeInfo))
        }
      })
  } recoverWith ErrorResponse.recover(404)


  @Endpoint(method = HttpMethod.PUT, path = "/")
  def update(updateRequest: UpdateRequest): Future[DetailedUserInfo] =
    withUser(u => u).flatMap {
      (current: User) =>
        User
          .update(User(current.id, updateRequest.username, current.password, updateRequest.firstName, updateRequest.lastName, updateRequest.biopic, current.refreshTokenId))
          .map(DetailedUserInfo.from)
    } recoverWith ErrorResponse.recover(404)


  @Endpoint(method = HttpMethod.DELETE, path = "/")
  def delete(): Future[Boolean] =
    withUser(u => u).flatMap {
      (current: User) =>
        User.delete(current.id.get)
    } recoverWith ErrorResponse.recover(418)

  @Endpoint(method = HttpMethod.POST, path = "/:id/userlike")
  def likeUser(id  : Int): Future[LikeResponse] = {
    withUser(u => u).flatMap(user => {
      UserLike.toggle(user.id.get, id)
    })
  } recoverWith ErrorResponse.recover(418)
}
