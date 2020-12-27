package be.unamur.infom451.bacht.controllers.api

import scala.concurrent.Future

import wvlet.airframe.http.{Endpoint, HttpMethod, Router}

import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.UserTable.User


object APIController extends Guide {

  /* ------------------------------- Routes -------------------------------- */

  val routes: Router = Router
    //.add(Auth)
    //.andThen[APIController]
    .of[APIController]

  /* --------------- Request / Response classes and objects ---------------- */

  sealed trait APIRequest

  sealed trait APIResponse

  case class WaffleResponse(name: String, value: Double)

  case class UserInfo(id: Int, username: String)

  case class DetailedUserInfo(
    id: Int,
    username: String,
    firstName: String,
    lastName: String,
    biopic: String,
    shareas: Seq[Int]
  )

  type DetailedUserResponse = DetailedUserInfo

  type UserResponse = Seq[UserInfo]

}

/* ------------------------------ Controller ------------------------------- */

@Endpoint(path = "/api")
trait APIController {

  import APIController._

  @Endpoint(method = HttpMethod.GET, path = "/waffle")
  def waffle: WaffleResponse = WaffleResponse("brasse", 42.69)

  @Endpoint(method = HttpMethod.GET, path="/user")
  def listUser: Future[UserResponse] = for {
    users <- User.all
  } yield users.map(u => UserInfo(u.id.get, u.username))

  @Endpoint(method = HttpMethod.GET, path="/user/:id")
  def getUser(id: Int): Future[DetailedUserResponse] = for {
    user <- User.byId(id)
  } yield DetailedUserInfo(
    user.id.get,
    user.username,
    user.firstName,
    user.lastName,
    user.biopic,
    Seq()
  )

}
