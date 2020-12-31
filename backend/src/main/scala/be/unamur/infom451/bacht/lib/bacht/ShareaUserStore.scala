package be.unamur.infom451.bacht.lib.bacht

object ShareaUserStore extends BachTStore {
  def count_token(token: String): Int = {
    if (theStore.contains(token))
      theStore(token)
    else
      0
  }
}
