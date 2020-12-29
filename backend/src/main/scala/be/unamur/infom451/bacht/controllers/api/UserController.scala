package be.unamur.infom451.bacht.controllers.api

import be.unamur.infom451.bacht.controllers.api.ShareaController.{DetailedShareaInfo, ShareaInfo}

import scala.concurrent.Future
import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import pdi.jwt.JwtClaim
import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.Sharea
import be.unamur.infom451.bacht.models.UserTable.User


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
        Seq()
      )
    def from(user: User, shareas: Seq[Sharea]): DetailedUserInfo =
      DetailedUserInfo(
        user.id.get,
        user.username,
        user.firstName,
        user.lastName,
        user.biopic,
        shareas.map(_.id.get)
      )
  }
  case class DetailedUserInfo(
    id: Int,
    username: String,
    firstName: String,
    lastName: String,
    biopic: String,
    shareas: Seq[Int]
  )
  type DetailedUserResponse = DetailedUserInfo

  type UserShareaResponse = Seq[ShareaInfo]

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
  def one(id: String): Future[DetailedUserResponse] =
    withContextValue("token") { (token: JwtClaim) =>

      val user =
        if (id == "self") User byUsernameWithShareas token.subject.get
        else User byIdWithShareas id.toInt

      user map {
        case (user, shareas) => DetailedUserInfo.from(user, shareas)
      }

    } recoverWith ErrorResponse.recover(404)

  // TODO PUT method

}
