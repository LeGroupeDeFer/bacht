package be.unamur.infom451.bacht.controllers.api

import scala.concurrent.Future

import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import pdi.jwt.JwtClaim

import be.unamur.infom451.bacht.lib._
import be.unamur.infom451.bacht.models.UserTable.User


object APIController extends Guide {

  /* ------------------------------- Routes -------------------------------- */

  val routes: Router = Router.of[APIController]

  /* --------------- Request / Response classes and objects ---------------- */

  sealed trait APIRequest

  sealed trait APIResponse

  case class WaffleResponse(name: String, value: Double)

}

/* ------------------------------ Controller ------------------------------- */

@Endpoint(path = "/api")
trait APIController {

  import APIController._

  @Endpoint(method = HttpMethod.GET, path = "/waffle")
  def waffle: WaffleResponse = WaffleResponse("brasse", 42.69)

}
