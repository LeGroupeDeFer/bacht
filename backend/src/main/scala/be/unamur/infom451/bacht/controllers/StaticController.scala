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

  @Endpoint(path = "/dashboard/*path")
  def redirectDashboard(): Response =
    index()

  @Endpoint(path = "/profile/*path")
  def redirectProfile(): Response =
    index()

  @Endpoint(path = "/discover/*path")
  def redirectDiscover(): Response =
    index()

  @Endpoint(path = "/auth/*path")
  def redirectAuth(): Response =
    index()

  @Endpoint(path = "/sharea/*path")
  def redirectSharea(): Response =
    index()

  @Endpoint(path = "/*path")
  def content(path: String): Response =
    asset(path)

}
