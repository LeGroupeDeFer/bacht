package be.unamur.infom451.bacht.controllers

import wvlet.airframe.http.HttpMessage.Response
import wvlet.airframe.http.{Endpoint, Router, StaticContent}

import be.unamur.infom451.bacht.lib.jarDirectory
import be.unamur.infom451.bacht.lib.Guide


object StaticController extends Guide {

  val routes: Router =
    Router.of[StaticController]

  val asset: StaticContent =
    StaticContent.fromDirectory(s"$jarDirectory/assets")

}

trait StaticController {

  import StaticController.asset

  @Endpoint(path = "/")
  def index(): Response =
    content("index.html")

  @Endpoint(path = "/auth")
  def redirectAuth(): Response = index()

  @Endpoint(path = "/*path")
  def content(path: String): Response =
    asset(path)

}
