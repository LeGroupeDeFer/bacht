package be.unamur.infom451.bacht.controllers

import wvlet.airframe.http.Router

package object api {

  val routes: Router = Router(
    AuthController.routes,
    APIController.routes,
    UserController.routes,
    ShareaController.routes
  )

}
