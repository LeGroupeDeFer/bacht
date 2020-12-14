package be.unamur.infom451.bacht

import wvlet.airframe.http.Router


package object controllers {

  val routes: Router =
    Router(api.routes, StaticController.routes)

}