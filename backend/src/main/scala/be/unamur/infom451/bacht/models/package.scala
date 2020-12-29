package be.unamur.infom451.bacht

import slick.jdbc
import slick.jdbc.MySQLProfile


package object models {

  // Expose everything needed for db manipulations here (to facilitate imports)

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

  type Users    = UserTable.Users
  type User     = UserTable.User
  val users     = UserTable.users

  type Tokens   = TokenTable.Tokens
  type Token    = TokenTable.Token
  val tokens    = TokenTable.tokens

  type Shareas  = ShareaTable.Shareas
  type Sharea   = ShareaTable.Sharea
  val shareas   = ShareaTable.shareas

  type Medias   = MediaTable.Medias
  type Media    = MediaTable.Media
  val medias    = MediaTable.medias

}
