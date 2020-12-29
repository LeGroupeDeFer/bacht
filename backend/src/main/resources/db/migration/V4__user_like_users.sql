CREATE TABLE user_like
(
    id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    liker_id INT UNSIGNED NOT NULL,
    liked_id  INT UNSIGNED NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (liker_id) REFERENCES users (id),
    FOREIGN KEY (liked_id) REFERENCES users (id)
)