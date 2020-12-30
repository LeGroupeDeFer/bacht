package be.unamur.infom451.bacht.models

import be.unamur.infom451.bacht.Configuration
import slick.jdbc
import slick.jdbc.MySQLProfile

package object likes {
  case class LikeResponse(like: Boolean, likes: Int)

  implicit val api: jdbc.MySQLProfile.API =
    slick.jdbc.MySQLProfile.api

  import api._


  implicit val db: MySQLProfile.backend.DatabaseDef = {
    val conf = Configuration.instance.get
    Database.forURL(
      conf.dbUri,
      conf.dbUser,
      conf.dbPassword,
      driver = "com.mysql.cj.jdbc.Driver"
    )
  }
}
