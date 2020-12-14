val airFrameHttpVersion = "20.10.0"
val slickVersion = "3.3.3"
val slf4jVersion = "1.6.4"
val slickHikaricpVersion = "3.3.3"
val mysqlConnectorVersion = "8.0.19"
val bcryptVersion = "0.4"
val jwtVersion = "4.2.0"
val scoptVersion = "4.0.0-RC2"
val commonCodecVersion = "1.9"
val flywayVersion = "7.2.1"

enablePlugins(JavaAppPackaging)

lazy val root = (project in file("."))
  .settings(
    organization := "be.unamur.infom451",
    name := "bacht",
    version := "v0.0.1",
    scalaVersion := "2.12.7",
    libraryDependencies ++= Seq(
      "org.wvlet.airframe" %% "airframe-http-finagle" % airFrameHttpVersion,
      "com.typesafe.slick" %% "slick" % slickVersion,
      "org.slf4j" % "slf4j-nop" % slf4jVersion,
      "com.typesafe.slick" %% "slick-hikaricp" % slickHikaricpVersion,
      "mysql" % "mysql-connector-java" % mysqlConnectorVersion,
      "org.mindrot" % "jbcrypt" % bcryptVersion,
      "com.pauldijou" %% "jwt-circe" % jwtVersion,
      "commons-codec" % "commons-codec" % commonCodecVersion,
      "com.github.scopt" %% "scopt" % scoptVersion,
      "org.flywaydb" % "flyway-core" % flywayVersion
    )
  )
