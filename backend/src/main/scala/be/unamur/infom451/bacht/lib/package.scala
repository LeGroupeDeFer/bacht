package be.unamur.infom451.bacht

import java.io.File
import java.sql.Timestamp
import java.text.SimpleDateFormat
import java.time.{Clock, Instant, ZoneOffset}
import java.util.Date
import java.util.concurrent.atomic.AtomicReference

import collection.mutable.{Map => MutableMap}
import com.twitter.{util => twitter}
import com.twitter.finagle.context.Contexts
import com.twitter.util.tunable.TunableMap.Key
import org.mindrot.jbcrypt.BCrypt
import slick.jdbc.MySQLProfile
import wvlet.airframe.http.finagle.{Finagle, FinagleBackend}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{ExecutionContext, Future, Promise}
import scala.util.{Failure, Success, Try}


package object lib {

  /* --------------------- Global & global implicits ---------------------- */

  implicit val ec: ExecutionContext = global
  implicit val api: MySQLProfile.API = models.api
  implicit val db: models.api.Database = models.db
  implicit val zoneOffset: ZoneOffset = ZoneOffset.UTC
  implicit val clock: Clock = Clock.systemUTC

  val insertionError = new Exception("Unable to insert")
  val alreadyInserted = new Exception("This can was already inserted in the database")
  val updateError = new Exception("Unable to update")
  val persistenceError = new Exception("Entity was not saved to the database yet")
  val invalidPassword = new Exception("Invalid password")
  val invalidIDs = new Exception("Invalid authentication IDs")
  val invalidToken = new Exception("Invalid token")
  val usernameTaken = new Exception("Username in use")
  val missingAttribute = new Exception("At least one attribute is missing")
  val invalidAttribute = new Exception("At least one attribute is missing")
  val idMismatch = new Exception("The ids do not match")
  val unknownIdentifier = new Exception("Unknown identifer")

  case class TokenException(
                             private val message: String,
                             private val cause: Throwable = None.orNull
                           ) extends Exception

  val expiredToken: TokenException = TokenException("This token has expired")
  val malformedToken: TokenException = TokenException("Malformed token")
  val absentToken: TokenException = TokenException("Token was not provided")

  /* -------------------------- Utils functions --------------------------- */

  import api._

  def contextValue[A](name: String): Option[A] =
    FinagleBackend.getThreadLocal[A](name)

  def withContextValue[A, B](name: String)(body: A => B): B =
    body(contextValue[A](name).get)

  def withContextValueOption[A, B](name: String)(body: Option[A] => B): B =
    body(contextValue[A](name))

  def now(implicit clock: Clock): Instant =
    clock.instant

  def after(seconds: Long)(implicit clock: Clock): Instant =
    now.plusSeconds(seconds)

  def timestampNow(): Timestamp =
    Timestamp.from(now)

  def instantFromString(t: String): Instant = {
    val date: Date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(t)
    date.toInstant
  }

  def stringFromInstant(i: Instant): String =
    (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(i)

  def timestampAfter(seconds: Long): Timestamp =
    Timestamp.from(after(seconds))

  def singleOption[A, B](query: Query[A, B, Seq])(
    implicit ec: ExecutionContext,
    db: Database
  ): Future[Option[B]] = db.run(query.result.headOption)

  def single[A, B](query: Query[A, B, Seq])(
    implicit ec: ExecutionContext,
    db: Database
  ): Future[B] = db.run(query.result.head)


  def jarDirectory: String = new File(
    getClass.getProtectionDomain.getCodeSource.getLocation.toURI
  ).getParent

  def queryAll[A, B, C[_]](query: Query[A, B, C])(
    implicit ec: ExecutionContext,
    db: Database
  ): Future[C[B]] =
    db.run(query.result)

  private val contextKey =
    new Contexts.local.Key[AtomicReference[MutableMap[String, Any]]]

  def context: Option[AtomicReference[MutableMap[String, Any]]] = {
    Contexts.local.get(contextKey)
  }

  /* ------------------------ Implicit conversions ------------------------ */

  // ScalaTry[T] -> TwitterTry[T]
  implicit def scalaToTwitterTry[T](t: Try[T]): twitter.Try[T] = t match {
    case Success(r) => twitter.Return(r)
    case Failure(ex) => twitter.Throw(ex)
  }

  // TwitterTry[T] -> ScalaTry[T]
  implicit def twitterToScalaTry[T](t: twitter.Try[T]): Try[T] = t match {
    case twitter.Return(r) => Success(r)
    case twitter.Throw(ex) => Failure(ex)
  }

  // ScalaFuture[T] -> TwitterFuture[T]
  implicit def scalaToTwitterFuture[T](f: Future[T])(
    implicit ec: ExecutionContext
  ): twitter.Future[T] = {
    val promise = twitter.Promise[T]()
    f.onComplete(promise update _)(ec)
    promise
  }

  // TwitterFuture[T] -> ScalaFuture[T]
  implicit def twitterToScalaFuture[T](f: twitter.Future[T]): Future[T] = {
    val promise = Promise[T]()
    f.respond(promise complete _)
    promise.future
  }

  /* -------------------------- Database related -------------------------- */

  object Hash {
    def of(pw: String): Hash =
      Hash(BCrypt.hashpw(pw, BCrypt.gensalt()))
  }

  case class Hash(value: String) extends MappedTo[String] {
    def ==(other: Hash): Boolean =
      value == other.value

    def ==(other: String): Boolean =
      BCrypt.checkpw(other, value)
  }

}
