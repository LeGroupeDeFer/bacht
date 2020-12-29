CREATE TABLE user_like
(
    id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    sharea_id  INT UNSIGNED NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (sharea_id) REFERENCES shareas (id)
)