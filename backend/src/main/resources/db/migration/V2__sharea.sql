CREATE TABLE shareas
(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    creator_id  INT UNSIGNED NOT NULL,
    name        VARCHAR(128) NOT NULL,
    description TEXT         NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE medias
(
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    sharea_id  INT UNSIGNED NOT NULL,
    creator_id INT UNSIGNED NOT NULL,
    name       VARCHAR(128) NOT NULL,
    type       VARCHAR(128) NOT NULL,
    content    BLOB         NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (sharea_id) REFERENCES shareas (id),
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE media_like
(
    id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    media_id INT UNSIGNED NOT NULL,
    user_id  INT UNSIGNED NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (media_id) REFERENCES medias (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
)