package be.unamur.infom451.bacht.controllers.api

import scala.concurrent.Future

import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import pdi.jwt.JwtClaim

import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.UserTable.User


object UserController extends Guide {

  val routes: Router = Router
    .add(Auth)
    .andThen[UserController]

  case class UserInfo(id: Int, username: String)
  type UserResponse = Seq[UserInfo]

  object DetailedUserInfo {
    def from(user: User): DetailedUserInfo = DetailedUserInfo(
      user.id.get,
      user.username,
      user.firstName,
      user.lastName,
      user.biopic,
      Seq()
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

}

@Endpoint(path="/api/user")
trait UserController {

  import UserController._

  @Endpoint(method = HttpMethod.GET, path = "/")
  def all: Future[UserResponse] = User
    .all
    .map(_.map(u => UserInfo(u.id.get, u.username)))
    .recoverWith(ErrorResponse.recover[UserResponse](500))

  @Endpoint(method = HttpMethod.GET, path = "/:id")
  def one(id: String): Future[DetailedUserResponse] =
    withContextValue("token") { (token: JwtClaim) =>

      val user =
        if (id == "self") User byUsername token.subject.get
        else User byId id.toInt

      user map (_.map(DetailedUserInfo.from).get)

    } recoverWith ErrorResponse.recover[DetailedUserInfo](404)

  // TODO PUT method

}
