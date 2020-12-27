package be.unamur.infom451.bacht.controllers.api

import com.twitter.util.{Future => TwitterFuture}
import wvlet.airframe.http.{Endpoint, HttpMethod, Router}
import be.unamur.infom451.bacht.{lib => Bacht}
import be.unamur.infom451.bacht.lib.Guide


object AuthController extends Guide {

  /* ------------------------------- Routes -------------------------------- */

  val routes: Router = Router.of[AuthController]

  /* --------------- Request / Response classes and objects ---------------- */

  sealed trait AuthRequest

  sealed trait AuthResponse

  case class RegisterRequest(
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    biopic: String
  ) extends AuthRequest

  case class LoginRequest(username: String, password: String) extends AuthRequest

  case class LoginResponse(token: String) extends AuthResponse

  case class LogoutRequest(username: String, token: String) extends AuthRequest

  case class RefreshRequest(username: String, token: String) extends AuthRequest

  case class RefreshResponse(refresh: String, access: String) extends AuthResponse


}

/* ------------------------------ Controller ------------------------------- */

@Endpoint(path = "/api/auth")
trait AuthController {

  import Bacht._
  import AuthController._

  @Endpoint(method = HttpMethod.POST, path = "/login")
  def login(r: LoginRequest): TwitterFuture[LoginResponse] =
    Auth.login(r.username, r.password)
      .map(LoginResponse)
      .recoverWith(ErrorResponse.recover[LoginResponse](403))

  @Endpoint(method = HttpMethod.POST, path = "/logout")
  def logout(r: LogoutRequest): TwitterFuture[String] =
    Auth.logout(r.username, r.token)
      .map(_ => "Ok")
      .recoverWith(ErrorResponse.recover[String](403))

  @Endpoint(method = HttpMethod.POST, path = "/refresh")
  def refresh(r: RefreshRequest): TwitterFuture[RefreshResponse] =
    Auth.refresh(r.username, r.token)
      .map(result => RefreshResponse(result._1, result._2))
      .recoverWith(ErrorResponse.recover[RefreshResponse](403))

  // TODO - Place account creation logic somewhere else
  @Endpoint(method = HttpMethod.POST, path = "/register")
  def register(r: RegisterRequest): TwitterFuture[String] =
    Auth.register(r.username, r.password, r.firstName, r.lastName, r.biopic)
      .map(_ => "Ok")
      .recoverWith(ErrorResponse.recover[String](422))

}
